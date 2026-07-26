import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  assertNonEmpty,
  assertRunId,
  defaultGitHubApi,
  defaultGitHubPaginatedApi,
  execFileAsync,
  readJson,
  runDirectory,
  sameGitHubLogin,
  writeJson,
} from './common.mjs'
import {
  canonicalCheckpointRecord,
  checkpointArtifactsForEvents,
  checkpointJournalConfiguration,
  checkpointPublicationBody,
  checkpointRecordDigest,
  checkpointWorktreeHead,
  parseCheckpointRecord,
  validateCheckpointRecord,
  verifyPublishedCheckpoint,
} from './checkpoint-proof.mjs'
import { appendValidatedEvent, readEvents, readRun } from './run-store.mjs'

const ACTIVE_STATUSES = new Set(['running', 'waiting_for_owner', 'awaiting_owner_review'])

export const canonicalCheckpoint = canonicalCheckpointRecord
export const checkpointDigest = checkpointRecordDigest

function durableCommentId(comment) {
  const rawId =
    comment.id ??
    comment.html_url?.match(/#issuecomment-([1-9][0-9]*)$/)?.[1] ??
    null
  return /^[1-9][0-9]*$/.test(String(rawId ?? '')) ? BigInt(rawId) : null
}

function compareDurableCheckpoints(candidate, existing) {
  const updatedDifference =
    Date.parse(candidate.record.updatedAt) - Date.parse(existing.record.updatedAt)
  if (updatedDifference !== 0) return Math.sign(updatedDifference)
  if (checkpointRecordDigest(candidate.record) === checkpointRecordDigest(existing.record)) {
    return 0
  }

  const candidateCreatedAt = Date.parse(candidate.comment.created_at)
  const existingCreatedAt = Date.parse(existing.comment.created_at)
  if (
    !Number.isNaN(candidateCreatedAt) &&
    !Number.isNaN(existingCreatedAt) &&
    candidateCreatedAt !== existingCreatedAt
  ) {
    return Math.sign(candidateCreatedAt - existingCreatedAt)
  }

  const candidateId = durableCommentId(candidate.comment)
  const existingId = durableCommentId(existing.comment)
  if (candidateId !== null && existingId !== null && candidateId !== existingId) {
    return candidateId > existingId ? 1 : -1
  }
  throw new Error(
    `ambiguous durable active checkpoints for ${candidate.record.run.runId} at ${candidate.record.updatedAt}`,
  )
}

export async function prepareActiveCheckpoint({ loopRoot = DEFAULT_LOOP_ROOT, runId } = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (!ACTIVE_STATUSES.has(run.status) || run.finishedAt !== null) {
    throw new Error('only an active run can be checkpointed')
  }
  const events = (await readEvents(loopRoot, normalizedRunId)).filter(
    (event) => event.type !== 'checkpoint_published',
  )
  const briefPath = path.join(loopRoot, 'handoffs', normalizedRunId, 'implementation-brief.md')
  const record = validateCheckpointRecord({
    schemaVersion: 1,
    kind: 'active-checkpoint',
    run,
    briefSource: await readFile(briefPath, 'utf8'),
    events,
    artifacts: await checkpointArtifactsForEvents({
      loopRoot,
      runId: normalizedRunId,
      events,
    }),
    updatedAt: events.at(-1)?.timestamp,
  })
  const resultPath = path.join(runDirectory(loopRoot, normalizedRunId), 'checkpoint-result.json')
  await writeJson(resultPath, record)
  const { channel, owner, repo } = await checkpointJournalConfiguration(loopRoot)
  const { digest, body } = checkpointPublicationBody(record)
  return {
    record,
    resultPath,
    digest,
    body,
    journalIssueUrl: `https://github.com/${owner}/${repo}/issues/${channel.stateIssueNumber}`,
  }
}

export async function recordActiveCheckpointPublication({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  resultPath,
  commentUrl,
  now = new Date(),
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const resolvedResultPath = path.resolve(assertNonEmpty(resultPath, 'resultPath'))
  const runRoot = runDirectory(loopRoot, normalizedRunId)
  if (!resolvedResultPath.startsWith(`${runRoot}${path.sep}`)) {
    throw new Error('checkpoint result must be inside the current run directory')
  }
  const record = validateCheckpointRecord(await readJson(resolvedResultPath))
  const run = await readRun(loopRoot, normalizedRunId)
  const allEvents = await readEvents(loopRoot, normalizedRunId)
  const currentEvents = allEvents.filter((event) => event.type !== 'checkpoint_published')
  const briefSource = await readFile(
    path.join(loopRoot, 'handoffs', normalizedRunId, 'implementation-brief.md'),
    'utf8',
  )
  const currentRecord = {
    ...record,
    run,
    briefSource,
    events: currentEvents,
    artifacts: await checkpointArtifactsForEvents({
      loopRoot,
      runId: normalizedRunId,
      events: currentEvents,
    }),
    updatedAt: currentEvents.at(-1)?.timestamp,
  }
  if (canonicalCheckpointRecord(currentRecord) !== canonicalCheckpointRecord(record)) {
    throw new Error('checkpoint result no longer matches the active run')
  }
  const { digest } = await verifyPublishedCheckpoint({
    loopRoot,
    record,
    commentUrl: assertNonEmpty(commentUrl, 'commentUrl'),
    githubApi,
  })
  if (
    !allEvents.some(
      (event) =>
        event.type === 'checkpoint_published' &&
        event.payload?.commentUrl === commentUrl &&
        event.payload?.digest === digest,
    )
  ) {
    await appendValidatedEvent({
      loopRoot,
      runId: normalizedRunId,
      type: 'checkpoint_published',
      status: 'published',
      payload: { commentUrl, digest, checkpointUpdatedAt: record.updatedAt },
      now,
    })
  }
  return { record, digest, commentUrl }
}

export async function reconcileActiveJournal({
  loopRoot = DEFAULT_LOOP_ROOT,
  githubPaginatedApi = defaultGitHubPaginatedApi,
  terminalRunIds = [],
} = {}) {
  const { channel, owner, repo } = await checkpointJournalConfiguration(loopRoot)
  const comments = await githubPaginatedApi(
    `repos/${owner}/${repo}/issues/${channel.stateIssueNumber}/comments?per_page=100`,
  )
  const terminalIds = new Set(terminalRunIds)
  const latestByRunId = new Map()
  for (const comment of comments) {
    if (!sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin)) continue
    const marker = comment.body?.match(
      /<!-- issue-dev-loop:checkpoint:([^:]+):sha256:([0-9a-f]{64}) -->/,
    )
    if (!marker) continue
    const record = validateCheckpointRecord(parseCheckpointRecord(comment.body))
    if (record.run.runId !== marker[1] || checkpointRecordDigest(record) !== marker[2]) {
      throw new Error(`invalid durable active checkpoint for ${marker[1]}`)
    }
    const candidate = { record, comment }
    const existing = latestByRunId.get(record.run.runId)
    if (!existing || compareDurableCheckpoints(candidate, existing) > 0) {
      latestByRunId.set(record.run.runId, candidate)
    }
  }

  const activeCheckpoints = []
  for (const [runId, durable] of latestByRunId) {
    if (terminalIds.has(runId)) continue
    activeCheckpoints.push({
      record: durable.record,
      commentUrl: durable.comment.html_url ?? null,
      createdAt: durable.comment.created_at ?? durable.record.updatedAt,
    })
  }
  activeCheckpoints.sort(
    (left, right) => Date.parse(left.record.updatedAt) - Date.parse(right.record.updatedAt),
  )
  return { activeCheckpoints }
}

async function defaultWorkspaceValidator({ loopRoot, record }) {
  const repositoryRoot = path.resolve(loopRoot, '..', '..')
  const [branch, head, status, gitDirectory, commonDirectory] = await Promise.all([
    execFileAsync('git', ['branch', '--show-current'], { cwd: repositoryRoot }),
    execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot }),
    execFileAsync('git', ['status', '--porcelain'], { cwd: repositoryRoot }),
    execFileAsync('git', ['rev-parse', '--path-format=absolute', '--git-dir'], {
      cwd: repositoryRoot,
    }),
    execFileAsync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], {
      cwd: repositoryRoot,
    }),
  ])
  if (gitDirectory.stdout.trim() === commonDirectory.stdout.trim()) {
    throw new Error('restore requires an isolated linked Git worktree')
  }
  if (branch.stdout.trim() !== record.run.branch) {
    throw new Error(`restore requires isolated worktree branch ${record.run.branch}`)
  }
  const expectedHead = checkpointWorktreeHead(record)
  if (head.stdout.trim() !== expectedHead) {
    throw new Error(`restore requires exact durable head ${expectedHead}`)
  }
  if (status.stdout.trim()) {
    throw new Error('restore requires a clean isolated worktree')
  }
}

export async function restoreActiveCheckpoint({
  loopRoot = DEFAULT_LOOP_ROOT,
  checkpoint,
  workspaceValidator = defaultWorkspaceValidator,
} = {}) {
  const record = validateCheckpointRecord(checkpoint?.record)
  await workspaceValidator({ loopRoot, record })
  const runId = record.run.runId
  const runPath = runDirectory(loopRoot, runId)
  await Promise.all(
    [
      runPath,
      path.join(loopRoot, 'logs', 'claims', `issue-${record.run.issueNumber}`),
      path.join(loopRoot, 'handoffs', runId),
      path.join(loopRoot, 'screen-shots', runId, 'before'),
      path.join(loopRoot, 'screen-shots', runId, 'after'),
      path.join(loopRoot, 'evidence', runId, 'test-results'),
    ].map((directory) => mkdir(directory, { recursive: true })),
  )
  await writeJson(path.join(runPath, 'run.json'), record.run)
  const restoredEvents = [
    ...record.events,
    {
      schemaVersion: 1,
      runId,
      type: 'checkpoint_published',
      timestamp: checkpoint.createdAt ?? record.updatedAt,
      status: 'published',
      payload: {
        commentUrl: checkpoint.commentUrl ?? null,
        digest: checkpointRecordDigest(record),
        checkpointUpdatedAt: record.updatedAt,
      },
    },
  ]
  await writeFile(
    path.join(runPath, 'events.jsonl'),
    `${restoredEvents.map((event) => JSON.stringify(event)).join('\n')}\n`,
    'utf8',
  )
  await writeFile(
    path.join(loopRoot, 'handoffs', runId, 'implementation-brief.md'),
    record.briefSource,
    'utf8',
  )
  for (const artifact of record.artifacts) {
    const artifactPath = path.resolve(loopRoot, artifact.path)
    await mkdir(path.dirname(artifactPath), { recursive: true })
    await writeFile(artifactPath, artifact.source, 'utf8')
  }
  await writeJson(path.join(runPath, 'checkpoint-result.json'), record)
  return record.run
}
