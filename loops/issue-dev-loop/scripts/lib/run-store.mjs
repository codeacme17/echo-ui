import { randomBytes } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  appendJsonLine,
  assertIssueNumber,
  assertNonEmpty,
  assertRunId,
  parseGitHubTarget,
  pathExists,
  readJson,
  replaceTemplate,
  runDirectory,
  sameGitHubLogin,
  sameRepository,
  timestampToken,
  writeJson,
} from './common.mjs'
import { updateEvolveMetrics } from './evolve.mjs'

export const PAUSED_STATUSES = new Set(['awaiting_owner_review', 'waiting_for_owner'])
const TERMINAL_STATUSES = new Set(['completed', 'failed', 'blocked', 'cancelled'])
const RUN_STATUSES = new Set(['running', ...PAUSED_STATUSES, ...TERMINAL_STATUSES])
const RESERVED_EVENT_TYPES = new Set([
  'loop_started',
  'verification_completed',
  'review_completed',
  'owner_review_approved',
  'pr_merged',
  'run_status_changed',
  'run_finalized',
])

export function makeRunId({ issueNumber, now = new Date(), entropy } = {}) {
  const issue = assertIssueNumber(issueNumber)
  const suffix = entropy ?? randomBytes(3).toString('hex')
  if (!/^[A-Za-z0-9]+$/.test(suffix)) throw new Error('entropy must be alphanumeric')
  return `${timestampToken(now)}-issue-${issue}-${suffix.toLowerCase()}`
}

export async function readRun(loopRoot, runId) {
  return readJson(path.join(runDirectory(loopRoot, runId), 'run.json'))
}

export async function startRun({
  loopRoot = DEFAULT_LOOP_ROOT,
  issueNumber,
  issueTitle,
  issueUrl,
  now = new Date(),
  entropy,
} = {}) {
  const issue = assertIssueNumber(issueNumber)
  const title = assertNonEmpty(issueTitle, 'issueTitle')
  const url = assertNonEmpty(issueUrl, 'issueUrl')
  const runId = makeRunId({ issueNumber: issue, now, entropy })
  const runPath = runDirectory(loopRoot, runId)
  if (await pathExists(runPath)) throw new Error(`run already exists: ${runId}`)

  await Promise.all(
    [
      runPath,
      path.join(loopRoot, 'handoffs', runId),
      path.join(loopRoot, 'screen-shots', runId, 'before'),
      path.join(loopRoot, 'screen-shots', runId, 'after'),
      path.join(loopRoot, 'evidence', runId, 'test-results'),
    ].map((directory) => mkdir(directory, { recursive: true })),
  )

  const run = {
    schemaVersion: 1,
    runId,
    issueNumber: issue,
    issueTitle: title,
    issueUrl: url,
    baseBranch: 'dev',
    branch: `codex/issue-${issue}`,
    status: 'running',
    startedAt: now.toISOString(),
    finishedAt: null,
    prUrl: null,
    headSha: null,
    mergeSha: null,
  }
  await writeJson(path.join(runPath, 'run.json'), run)
  await appendValidatedEvent({
    loopRoot,
    runId,
    type: 'loop_started',
    status: 'running',
    payload: { issueNumber: issue, branch: run.branch },
    now,
  })

  const template = await readFile(
    path.join(loopRoot, 'templates', 'implementation-brief.md'),
    'utf8',
  )
  const briefPath = path.join(loopRoot, 'handoffs', runId, 'implementation-brief.md')
  await writeFile(
    briefPath,
    replaceTemplate(template, {
      RUN_ID: runId,
      ISSUE_NUMBER: issue,
      ISSUE_TITLE: title,
      ISSUE_URL: url,
    }),
    'utf8',
  )
  return { run, briefPath, runPath }
}

export async function appendValidatedEvent({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  type,
  status = null,
  payload = {},
  now = new Date(),
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const eventType = assertNonEmpty(type, 'type')
  const runPath = runDirectory(loopRoot, normalizedRunId)
  if (!(await pathExists(path.join(runPath, 'run.json')))) {
    throw new Error(`unknown run: ${normalizedRunId}`)
  }
  if (payload === null || Array.isArray(payload) || typeof payload !== 'object') {
    throw new Error('payload must be an object')
  }
  const event = {
    schemaVersion: 1,
    runId: normalizedRunId,
    type: eventType,
    timestamp: now.toISOString(),
    status,
    payload,
  }
  await appendJsonLine(path.join(runPath, 'events.jsonl'), event)
  return event
}

export async function appendEvent(options = {}) {
  if (RESERVED_EVENT_TYPES.has(options.type)) {
    throw new Error(`event type is reserved for a validated runtime operation: ${options.type}`)
  }
  return appendValidatedEvent(options)
}

export async function readEvents(loopRoot, runId) {
  const contents = await readFile(path.join(runDirectory(loopRoot, runId), 'events.jsonl'), 'utf8')
  return contents
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

function hasPassedEventForHead(events, type, headSha) {
  return events.some(
    (event) =>
      event.type === type &&
      event.payload?.headSha === headSha &&
      (event.status === 'passed' ||
        event.payload?.verdict === 'passed' ||
        event.payload?.verdict === 'PASS'),
  )
}

export async function transitionRun({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  status,
  prUrl = null,
  headSha = null,
  mergeSha = null,
  failureFingerprint = null,
  now = new Date(),
} = {}) {
  const normalizedRunId = assertRunId(runId)
  if (!RUN_STATUSES.has(status)) throw new Error(`invalid run status: ${status}`)

  const runPath = runDirectory(loopRoot, normalizedRunId)
  const runFile = path.join(runPath, 'run.json')
  const run = await readJson(runFile)
  if (run.finishedAt !== null) throw new Error(`run is already finalized: ${normalizedRunId}`)
  if (run.status === status) throw new Error(`run already has status: ${status}`)
  const events = await readEvents(loopRoot, normalizedRunId)

  if (status === 'awaiting_owner_review') {
    if (!prUrl || !headSha) throw new Error('awaiting_owner_review requires prUrl and headSha')
    const issueTarget = parseGitHubTarget(run.issueUrl)
    const pullRequestTarget = parseGitHubTarget(prUrl)
    if (
      !pullRequestTarget ||
      pullRequestTarget.kind !== 'pull' ||
      !sameRepository(issueTarget, pullRequestTarget)
    ) {
      throw new Error('awaiting_owner_review requires a PR in the issue repository')
    }
    if (!hasPassedEventForHead(events, 'verification_completed', headSha)) {
      throw new Error('awaiting_owner_review requires passed verification_completed for headSha')
    }
    if (!hasPassedEventForHead(events, 'review_completed', headSha)) {
      throw new Error('awaiting_owner_review requires passed review_completed for headSha')
    }
  }

  if (status === 'completed') {
    if (run.status !== 'awaiting_owner_review' || !run.prUrl || !run.headSha || !mergeSha) {
      throw new Error('completed requires an owner-ready PR and mergeSha')
    }
    const channel = await readJson(
      path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
    )
    const ownerApproval = events.some(
      (event) =>
        event.type === 'owner_review_approved' &&
        event.status === 'observed' &&
        sameGitHubLogin(event.payload?.actor, channel.ownerGitHubLogin) &&
        event.payload?.headSha === run.headSha,
    )
    const ownerMerge = events.some(
      (event) =>
        event.type === 'pr_merged' &&
        event.status === 'observed' &&
        sameGitHubLogin(event.payload?.actor, channel.ownerGitHubLogin) &&
        event.payload?.headSha === run.headSha &&
        event.payload?.mergeSha === mergeSha,
    )
    if (!ownerApproval || !ownerMerge) {
      throw new Error(
        'completed requires observed owner approval and owner merge for the current head',
      )
    }
  }
  if (['failed', 'blocked'].includes(status)) {
    assertNonEmpty(failureFingerprint, 'failureFingerprint')
  }

  const transitioned = {
    ...run,
    status,
    finishedAt: TERMINAL_STATUSES.has(status) ? now.toISOString() : null,
    prUrl: prUrl ?? run.prUrl,
    headSha: headSha ?? run.headSha,
    mergeSha: mergeSha ?? run.mergeSha,
  }
  await writeJson(runFile, transitioned)
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: TERMINAL_STATUSES.has(status) ? 'run_finalized' : 'run_status_changed',
    status,
    payload: { previousStatus: run.status },
    now,
  })
  if (!TERMINAL_STATUSES.has(status)) return transitioned

  const summaryTemplate = await readFile(path.join(loopRoot, 'templates', 'run-summary.md'), 'utf8')
  await writeFile(
    path.join(runPath, 'summary.md'),
    replaceTemplate(summaryTemplate, {
      RUN_ID: normalizedRunId,
      ISSUE_NUMBER: run.issueNumber,
      STATUS: status,
      STARTED_AT: run.startedAt,
      FINISHED_AT: transitioned.finishedAt,
      PR_URL: transitioned.prUrl ?? 'N/A',
      HEAD_SHA: transitioned.headSha ?? 'N/A',
      MERGE_SHA: transitioned.mergeSha ?? 'N/A',
    }),
    'utf8',
  )
  await appendJsonLine(path.join(loopRoot, 'logs', 'index.jsonl'), {
    schemaVersion: 1,
    event: 'run_finalized',
    runId: normalizedRunId,
    issueNumber: run.issueNumber,
    status,
    startedAt: run.startedAt,
    finishedAt: transitioned.finishedAt,
    prUrl: transitioned.prUrl,
    headSha: transitioned.headSha,
    mergeSha: transitioned.mergeSha,
    failureFingerprint,
  })
  await updateEvolveMetrics({ loopRoot, status, failureFingerprint, now })
  return transitioned
}

export async function finalizeRun(options = {}) {
  if (!TERMINAL_STATUSES.has(options.status)) {
    throw new Error(`invalid final status: ${options.status}`)
  }
  return transitionRun(options)
}
