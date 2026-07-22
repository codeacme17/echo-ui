import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  assertNonEmpty,
  assertRunId,
  defaultGitHubApi,
  defaultGitHubPaginatedApi,
  parsePullCommentUrl,
  pathExists,
  readJson,
  runDirectory,
  sameGitHubLogin,
  writeJson,
} from './common.mjs'
import { appendValidatedEvent, readEvents, readRun } from './run-store.mjs'

const ACTIVE_STATUSES = new Set(['running', 'waiting_for_owner', 'awaiting_owner_review'])

async function journalConfiguration(loopRoot) {
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  if (
    !Number.isInteger(channel.stateIssueNumber) ||
    channel.stateIssueNumber < 1 ||
    !channel.automationGitHubLogin
  ) {
    throw new Error('owner channel must configure stateIssueNumber and automationGitHubLogin')
  }
  const [owner, repo] = channel.repository.split('/')
  return { channel, owner, repo }
}

function canonicalRun(run) {
  return {
    schemaVersion: run.schemaVersion,
    runId: run.runId,
    issueNumber: run.issueNumber,
    issueTitle: run.issueTitle,
    issueUrl: run.issueUrl,
    baseBranch: run.baseBranch,
    baseSha: run.baseSha,
    branch: run.branch,
    status: run.status,
    startedAt: run.startedAt,
    finishedAt: run.finishedAt,
    prUrl: run.prUrl,
    headSha: run.headSha,
    mergeSha: run.mergeSha,
    issueSnapshot: run.issueSnapshot,
    briefDigest: run.briefDigest,
    uiEvidenceRequired: run.uiEvidenceRequired,
    implementationCommit: run.implementationCommit,
  }
}

function canonicalEvent(event) {
  return {
    schemaVersion: event.schemaVersion,
    runId: event.runId,
    type: event.type,
    timestamp: event.timestamp,
    status: event.status,
    payload: event.payload,
  }
}

export function canonicalCheckpoint(record) {
  return JSON.stringify({
    schemaVersion: 1,
    kind: 'active-checkpoint',
    run: canonicalRun(record.run),
    briefSource: record.briefSource,
    events: record.events.map(canonicalEvent),
    updatedAt: record.updatedAt,
  })
}

export function checkpointDigest(record) {
  return createHash('sha256').update(canonicalCheckpoint(record)).digest('hex')
}

function validateCheckpoint(record) {
  const run = record?.run
  const events = record?.events
  if (
    record?.schemaVersion !== 1 ||
    record?.kind !== 'active-checkpoint' ||
    !run ||
    run.schemaVersion !== 1 ||
    !ACTIVE_STATUSES.has(run.status) ||
    run.finishedAt !== null ||
    !Number.isInteger(run.issueNumber) ||
    !/^[0-9a-f]{40}$/i.test(run.baseSha) ||
    (run.headSha !== null && !/^[0-9a-f]{40}$/i.test(run.headSha)) ||
    !Array.isArray(events) ||
    events.length === 0 ||
    typeof record.briefSource !== 'string' ||
    Number.isNaN(Date.parse(record.updatedAt))
  ) {
    throw new Error('invalid active checkpoint record')
  }
  assertRunId(run.runId)
  let previousTimestamp = -Infinity
  for (const event of events) {
    const timestamp = Date.parse(event.timestamp)
    if (
      event.schemaVersion !== 1 ||
      event.runId !== run.runId ||
      event.type === 'checkpoint_published' ||
      Number.isNaN(timestamp) ||
      timestamp < previousTimestamp
    ) {
      throw new Error('active checkpoint contains invalid or unordered events')
    }
    previousTimestamp = timestamp
  }
  if (
    events.at(-1).timestamp !== record.updatedAt ||
    !events.some((event) => event.type === 'loop_started')
  ) {
    throw new Error('active checkpoint is not bound to the latest run event')
  }
  if (
    run.briefDigest !== null &&
    createHash('sha256').update(record.briefSource).digest('hex') !== run.briefDigest
  ) {
    throw new Error('active checkpoint brief does not match the frozen digest')
  }
  return record
}

function checkpointBody(record) {
  const digest = checkpointDigest(record)
  const result = {
    digest,
    body: [
      `<!-- issue-dev-loop:checkpoint:${record.run.runId}:sha256:${digest} -->`,
      '```json',
      canonicalCheckpoint(record),
      '```',
    ].join('\n'),
  }
  if (result.body.length > 60_000) {
    throw new Error('active checkpoint exceeds the GitHub comment size budget')
  }
  return result
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
  const record = validateCheckpoint({
    schemaVersion: 1,
    kind: 'active-checkpoint',
    run: canonicalRun(run),
    briefSource: await readFile(briefPath, 'utf8'),
    events,
    updatedAt: events.at(-1)?.timestamp,
  })
  const resultPath = path.join(runDirectory(loopRoot, normalizedRunId), 'checkpoint-result.json')
  await writeJson(resultPath, record)
  const { channel, owner, repo } = await journalConfiguration(loopRoot)
  const { digest, body } = checkpointBody(record)
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
  const record = validateCheckpoint(await readJson(resolvedResultPath))
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
    updatedAt: currentEvents.at(-1)?.timestamp,
  }
  if (canonicalCheckpoint(currentRecord) !== canonicalCheckpoint(record)) {
    throw new Error('checkpoint result no longer matches the active run')
  }
  const { channel, owner, repo } = await journalConfiguration(loopRoot)
  const target = parsePullCommentUrl(assertNonEmpty(commentUrl, 'commentUrl'))
  if (
    !target ||
    target.surface !== 'issues' ||
    target.kind !== 'issue_comment' ||
    target.owner.toLowerCase() !== owner.toLowerCase() ||
    target.repo.toLowerCase() !== repo.toLowerCase() ||
    target.number !== channel.stateIssueNumber
  ) {
    throw new Error('checkpoint comment must be on the configured state journal issue')
  }
  const comment = await githubApi(
    `repos/${target.owner}/${target.repo}/issues/comments/${target.commentId}`,
  )
  const { digest, body } = checkpointBody(record)
  if (
    !sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin) ||
    !comment.body?.includes(body)
  ) {
    throw new Error('published checkpoint comment does not attest the exact active state')
  }
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

function parseSerializedRecord(body) {
  const serialized = body?.match(/```json\s*([^\n]+)\s*```/)?.[1]
  return serialized ? JSON.parse(serialized) : null
}

export async function reconcileActiveJournal({
  loopRoot = DEFAULT_LOOP_ROOT,
  githubPaginatedApi = defaultGitHubPaginatedApi,
} = {}) {
  const { channel, owner, repo } = await journalConfiguration(loopRoot)
  const comments = await githubPaginatedApi(
    `repos/${owner}/${repo}/issues/${channel.stateIssueNumber}/comments?per_page=100`,
  )
  const terminalRunIds = new Set()
  const latestByRunId = new Map()
  for (const comment of comments) {
    if (!sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin)) continue
    const finalizationMarker = comment.body?.match(
      /<!-- issue-dev-loop:finalization:([^:]+):sha256:([0-9a-f]{64}) -->/,
    )
    if (finalizationMarker) terminalRunIds.add(finalizationMarker[1])
    const marker = comment.body?.match(
      /<!-- issue-dev-loop:checkpoint:([^:]+):sha256:([0-9a-f]{64}) -->/,
    )
    if (!marker) continue
    const record = validateCheckpoint(parseSerializedRecord(comment.body))
    if (record.run.runId !== marker[1] || checkpointDigest(record) !== marker[2]) {
      throw new Error(`invalid durable active checkpoint for ${marker[1]}`)
    }
    const existing = latestByRunId.get(record.run.runId)
    if (!existing || Date.parse(record.updatedAt) > Date.parse(existing.record.updatedAt)) {
      latestByRunId.set(record.run.runId, { record, comment })
    }
  }

  const activeCheckpoints = []
  for (const [runId, durable] of latestByRunId) {
    if (terminalRunIds.has(runId)) continue
    const { record, comment } = durable
    const runPath = runDirectory(loopRoot, runId)
    const runFile = path.join(runPath, 'run.json')
    const eventsFile = path.join(runPath, 'events.jsonl')
    let restoreNeeded = !(await pathExists(runFile)) || !(await pathExists(eventsFile))
    if (await pathExists(runFile)) {
      const localRun = await readJson(runFile)
      if (localRun.issueNumber !== record.run.issueNumber) {
        throw new Error(`local run conflicts with durable checkpoint: ${runId}`)
      }
      if (localRun.finishedAt !== null) {
        throw new Error(`terminal local run conflicts with active durable checkpoint: ${runId}`)
      }
      if (!restoreNeeded) {
        const localEvents = (await readFile(eventsFile, 'utf8'))
          .split('\n')
          .filter(Boolean)
          .map((line) => JSON.parse(line))
          .filter((event) => event.type !== 'checkpoint_published')
        restoreNeeded =
          localEvents.length === 0 ||
          Date.parse(localEvents.at(-1).timestamp) < Date.parse(record.updatedAt)
      }
    }
    if (restoreNeeded) {
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
      await writeJson(runFile, record.run)
      const restoredEvents = [
        ...record.events,
        {
          schemaVersion: 1,
          runId,
          type: 'checkpoint_published',
          timestamp: comment.created_at ?? record.updatedAt,
          status: 'published',
          payload: {
            commentUrl: comment.html_url ?? null,
            digest: checkpointDigest(record),
            checkpointUpdatedAt: record.updatedAt,
          },
        },
      ]
      await writeFile(
        eventsFile,
        `${restoredEvents.map((event) => JSON.stringify(event)).join('\n')}\n`,
        'utf8',
      )
      await writeFile(
        path.join(loopRoot, 'handoffs', runId, 'implementation-brief.md'),
        record.briefSource,
        'utf8',
      )
    }
    activeCheckpoints.push(record)
  }
  activeCheckpoints.sort((left, right) => Date.parse(left.updatedAt) - Date.parse(right.updatedAt))
  return { activeCheckpoints }
}
