import { randomBytes } from 'node:crypto'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  appendJsonLine,
  assertIssueNumber,
  assertNonEmpty,
  assertRunId,
  defaultGitHubApi,
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
import { defaultClaimIssue } from './issue-claim.mjs'
import { updateEvolveMetrics } from './evolve.mjs'

export const PAUSED_STATUSES = new Set(['awaiting_owner_review', 'waiting_for_owner'])
const TERMINAL_STATUSES = new Set(['completed', 'failed', 'blocked', 'cancelled'])
const RUN_STATUSES = new Set(['running', ...PAUSED_STATUSES, ...TERMINAL_STATUSES])
const RESERVED_EVENT_TYPES = new Set([
  'loop_started',
  'verification_completed',
  'review_completed',
  'pr_published',
  'owner_notified',
  'notification_failed',
  'notification_dry_run',
  'owner_review_approved',
  'pr_merged',
  'run_status_changed',
  'run_finalized',
])

const ALLOWED_TRANSITIONS = new Map([
  ['running', new Set(['waiting_for_owner', 'cancelled'])],
  [
    'waiting_for_owner',
    new Set(['running', 'awaiting_owner_review', 'blocked', 'failed', 'cancelled']),
  ],
  ['awaiting_owner_review', new Set(['running', 'completed', 'cancelled'])],
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
  githubApi = defaultGitHubApi,
  claimIssue = defaultClaimIssue,
} = {}) {
  const issue = assertIssueNumber(issueNumber)
  const title = assertNonEmpty(issueTitle, 'issueTitle')
  const url = assertNonEmpty(issueUrl, 'issueUrl')
  const runId = makeRunId({ issueNumber: issue, now, entropy })
  const runPath = runDirectory(loopRoot, runId)
  if (await pathExists(runPath)) throw new Error(`run already exists: ${runId}`)

  const runsRoot = path.join(loopRoot, 'logs', 'runs')
  const activeRuns = []
  for (const entry of await readdir(runsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const runFile = path.join(runsRoot, entry.name, 'run.json')
    if (!(await pathExists(runFile))) continue
    const existing = await readJson(runFile)
    if (existing.finishedAt === null) activeRuns.push(existing)
  }
  if (activeRuns.some((existing) => existing.issueNumber === issue)) {
    throw new Error(`issue ${issue} already has an active run`)
  }

  const claimsRoot = path.join(loopRoot, 'logs', 'claims')
  const claimDirectory = path.join(claimsRoot, `issue-${issue}`)
  await mkdir(claimsRoot, { recursive: true })
  try {
    await mkdir(claimDirectory)
  } catch (error) {
    if (error?.code === 'EEXIST') throw new Error(`issue ${issue} is already locally claimed`)
    throw error
  }

  try {
    await claimIssue({
      issueUrl: url,
      issueNumber: issue,
      branch: `codex/issue-${issue}`,
      githubApi,
    })
  } catch (error) {
    await rm(claimDirectory, { recursive: true, force: true })
    throw error
  }

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

export async function recordPullRequest({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  prUrl,
  headSha,
  now = new Date(),
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const runFile = path.join(runDirectory(loopRoot, normalizedRunId), 'run.json')
  const run = await readJson(runFile)
  if (run.finishedAt !== null || run.status !== 'running') {
    throw new Error('draft PR publication requires a running run')
  }
  const issueTarget = parseGitHubTarget(run.issueUrl)
  const pullTarget = parseGitHubTarget(prUrl)
  if (!pullTarget || pullTarget.kind !== 'pull' || !sameRepository(issueTarget, pullTarget)) {
    throw new Error('prUrl must identify a pull request in the issue repository')
  }
  const livePullRequest = await githubApi(
    `repos/${pullTarget.owner}/${pullTarget.repo}/pulls/${pullTarget.number}`,
  )
  if (
    livePullRequest.state !== 'open' ||
    livePullRequest.draft !== true ||
    livePullRequest.base?.ref !== 'dev' ||
    livePullRequest.head?.ref !== run.branch ||
    livePullRequest.head?.repo?.full_name?.toLowerCase() !==
      `${pullTarget.owner}/${pullTarget.repo}`.toLowerCase() ||
    livePullRequest.head?.sha !== headSha
  ) {
    throw new Error('record-pr requires a live draft PR to dev at the exact run branch and headSha')
  }
  const updated = { ...run, prUrl, headSha }
  await writeJson(runFile, updated)
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'pr_published',
    status: 'draft',
    payload: { prUrl, headSha, baseBranch: 'dev', branch: run.branch },
    now,
  })
  return updated
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
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  if (!RUN_STATUSES.has(status)) throw new Error(`invalid run status: ${status}`)

  const runPath = runDirectory(loopRoot, normalizedRunId)
  const runFile = path.join(runPath, 'run.json')
  const run = await readJson(runFile)
  if (run.finishedAt !== null) throw new Error(`run is already finalized: ${normalizedRunId}`)
  if (run.status === status) throw new Error(`run already has status: ${status}`)
  const events = await readEvents(loopRoot, normalizedRunId)
  if (!ALLOWED_TRANSITIONS.get(run.status)?.has(status)) {
    throw new Error(`invalid run status transition: ${run.status} -> ${status}`)
  }

  if (status === 'awaiting_owner_review') {
    if (!prUrl || !headSha || run.prUrl !== prUrl || run.headSha !== headSha) {
      throw new Error('awaiting_owner_review requires the recorded PR URL and headSha')
    }
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
    const ownerNotification = events.findLast(
      (event) =>
        event.type === 'owner_notified' &&
        event.status === 'delivered' &&
        event.payload?.notificationType === 'pr_ready_for_review' &&
        event.payload?.delivery?.github === 'delivered' &&
        event.payload?.targetUrl === prUrl &&
        event.payload?.headSha === headSha,
    )
    if (!ownerNotification) {
      throw new Error('awaiting_owner_review requires a delivered GitHub owner notification')
    }
    const livePullRequest = await githubApi(
      `repos/${pullRequestTarget.owner}/${pullRequestTarget.repo}/pulls/${pullRequestTarget.number}`,
    )
    if (
      livePullRequest.state !== 'open' ||
      livePullRequest.draft !== false ||
      livePullRequest.base?.ref !== 'dev' ||
      livePullRequest.head?.ref !== run.branch ||
      livePullRequest.head?.repo?.full_name?.toLowerCase() !==
        `${pullRequestTarget.owner}/${pullRequestTarget.repo}`.toLowerCase() ||
      livePullRequest.head?.sha !== headSha
    ) {
      throw new Error('awaiting_owner_review requires a live ready PR to dev at the exact headSha')
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
    const requiredType = status === 'failed' ? 'loop_failed' : 'blocked'
    if (
      !events.some(
        (event) =>
          event.type === 'owner_notified' &&
          event.status === 'delivered' &&
          event.payload?.notificationType === requiredType &&
          event.payload?.delivery?.github === 'delivered',
      )
    ) {
      throw new Error(`${status} requires a delivered GitHub ${requiredType} notification`)
    }
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
  await rm(path.join(loopRoot, 'logs', 'claims', `issue-${run.issueNumber}`), {
    recursive: true,
    force: true,
  })
  return transitioned
}

export async function finalizeRun(options = {}) {
  if (!TERMINAL_STATUSES.has(options.status)) {
    throw new Error(`invalid final status: ${options.status}`)
  }
  return transitionRun(options)
}
