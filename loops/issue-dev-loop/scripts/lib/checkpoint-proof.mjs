import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  assertRunId,
  defaultGitHubApi,
  parsePullCommentUrl,
  readJson,
  runDirectory,
  sameGitHubLogin,
} from './common.mjs'

const ACTIVE_STATUSES = new Set(['running', 'waiting_for_owner', 'awaiting_owner_review'])

export async function checkpointJournalConfiguration(loopRoot) {
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

function permittedArtifactPath(runId, relativePath) {
  if (
    typeof relativePath !== 'string' ||
    path.isAbsolute(relativePath) ||
    relativePath.split(/[\\/]/).includes('..')
  ) {
    return false
  }
  const normalized = relativePath.split(path.sep).join('/')
  return (
    normalized.startsWith(`logs/runs/${runId}/`) ||
    normalized.startsWith(`evidence/${runId}/`) ||
    normalized.startsWith(`handoffs/${runId}/`)
  )
}

function artifactReferencesFromEvents(events) {
  const references = new Map()
  const add = (relativePath, digest) => {
    if (!relativePath) return
    const existing = references.get(relativePath)
    if (existing && digest && existing !== digest) {
      throw new Error(`checkpoint artifact has conflicting digests: ${relativePath}`)
    }
    references.set(relativePath, digest ?? existing ?? null)
  }
  for (const event of events) {
    if (event.type === 'implementation_completed' && event.payload?.resultPath) {
      add(event.payload.resultPath, event.payload.resultDigest)
    }
    if (event.type === 'verification_completed' && event.payload?.manifestPath) {
      add(event.payload.manifestPath, event.payload.manifestDigest)
    }
    if (event.type === 'review_completed' && event.payload?.resultPath) {
      add(event.payload.resultPath, event.payload.resultDigest)
    }
    if (event.type === 'finalization_published' && event.payload?.resultPath) {
      add(event.payload.resultPath, event.payload.resultDigest)
    }
  }
  return [...references].sort(([left], [right]) => left.localeCompare(right))
}

export async function checkpointArtifactsForEvents({ loopRoot, runId, events }) {
  const artifacts = []
  for (const [relativePath, expectedDigest] of artifactReferencesFromEvents(events)) {
    if (!permittedArtifactPath(runId, relativePath)) {
      throw new Error(`checkpoint artifact path is outside the run: ${relativePath}`)
    }
    const source = await readFile(path.resolve(loopRoot, relativePath), 'utf8')
    const sha256 = createHash('sha256').update(source).digest('hex')
    if (expectedDigest !== sha256) {
      throw new Error(`checkpoint artifact no longer matches its event: ${relativePath}`)
    }
    artifacts.push({
      path: relativePath.split(path.sep).join('/'),
      sha256,
      source,
    })
  }
  return artifacts
}

export function canonicalCheckpointRecord(record) {
  return JSON.stringify({
    schemaVersion: 1,
    kind: 'active-checkpoint',
    run: canonicalRun(record.run),
    briefSource: record.briefSource,
    events: record.events.map(canonicalEvent),
    artifacts: record.artifacts.map((artifact) => ({
      path: artifact.path,
      sha256: artifact.sha256,
      source: artifact.source,
    })),
    updatedAt: record.updatedAt,
  })
}

export function checkpointRecordDigest(record) {
  return createHash('sha256').update(canonicalCheckpointRecord(record)).digest('hex')
}

export function validateCheckpointRecord(record) {
  const run = record?.run
  const events = record?.events
  const artifacts = record?.artifacts
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
    !Array.isArray(artifacts) ||
    typeof record.briefSource !== 'string' ||
    Number.isNaN(Date.parse(record.updatedAt))
  ) {
    throw new Error('invalid active checkpoint record')
  }
  assertRunId(run.runId)
  const artifactPaths = new Set()
  for (const artifact of artifacts) {
    if (
      !permittedArtifactPath(run.runId, artifact?.path) ||
      typeof artifact.source !== 'string' ||
      !/^[0-9a-f]{64}$/.test(artifact.sha256 ?? '') ||
      createHash('sha256').update(artifact.source).digest('hex') !== artifact.sha256 ||
      artifactPaths.has(artifact.path)
    ) {
      throw new Error('active checkpoint contains an invalid artifact')
    }
    artifactPaths.add(artifact.path)
  }
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

export function checkpointPublicationBody(record) {
  const digest = checkpointRecordDigest(record)
  const result = {
    digest,
    body: [
      `<!-- issue-dev-loop:checkpoint:${record.run.runId}:sha256:${digest} -->`,
      '```json',
      canonicalCheckpointRecord(record),
      '```',
    ].join('\n'),
  }
  if (result.body.length > 60_000) {
    throw new Error('active checkpoint exceeds the GitHub comment size budget')
  }
  return result
}

export function parseCheckpointRecord(body) {
  const serialized = body?.match(/```json\s*([^\n]+)\s*```/)?.[1]
  return serialized ? JSON.parse(serialized) : null
}

export async function verifyPublishedCheckpoint({
  loopRoot,
  record,
  commentUrl,
  githubApi = defaultGitHubApi,
} = {}) {
  const validated = validateCheckpointRecord(record)
  const { channel, owner, repo } = await checkpointJournalConfiguration(loopRoot)
  const target = parsePullCommentUrl(commentUrl)
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
  const { digest, body } = checkpointPublicationBody(validated)
  if (
    !sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin) ||
    !comment.body?.includes(body)
  ) {
    throw new Error('published checkpoint comment does not attest the exact active state')
  }
  return { record: validated, digest, commentUrl }
}

export async function verifyLatestDurableCheckpoint({
  loopRoot,
  runId,
  events,
  operation,
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const latestPhaseEvent = events.findLast((event) => event.type !== 'checkpoint_published')
  const checkpoint = events.findLast(
    (event) =>
      event.type === 'checkpoint_published' &&
      event.status === 'published' &&
      event.payload?.checkpointUpdatedAt === latestPhaseEvent?.timestamp,
  )
  if (!latestPhaseEvent || !checkpoint) {
    throw new Error(`${operation} requires a durable checkpoint for the latest run phase`)
  }
  const record = validateCheckpointRecord(
    await readJson(path.join(runDirectory(loopRoot, normalizedRunId), 'checkpoint-result.json')),
  )
  const currentRecord = validateCheckpointRecord({
    schemaVersion: 1,
    kind: 'active-checkpoint',
    run: await readJson(path.join(runDirectory(loopRoot, normalizedRunId), 'run.json')),
    briefSource: await readFile(
      path.join(loopRoot, 'handoffs', normalizedRunId, 'implementation-brief.md'),
      'utf8',
    ),
    events: events.filter((event) => event.type !== 'checkpoint_published'),
    artifacts: await checkpointArtifactsForEvents({
      loopRoot,
      runId: normalizedRunId,
      events: events.filter((event) => event.type !== 'checkpoint_published'),
    }),
    updatedAt: latestPhaseEvent.timestamp,
  })
  const digest = checkpointRecordDigest(record)
  if (
    record.run.runId !== normalizedRunId ||
    record.updatedAt !== latestPhaseEvent.timestamp ||
    canonicalCheckpointRecord(currentRecord) !== canonicalCheckpointRecord(record) ||
    checkpoint.payload?.digest !== digest
  ) {
    throw new Error(`${operation} checkpoint event does not match its durable record`)
  }
  return verifyPublishedCheckpoint({
    loopRoot,
    record,
    commentUrl: checkpoint.payload?.commentUrl,
    githubApi,
  })
}
