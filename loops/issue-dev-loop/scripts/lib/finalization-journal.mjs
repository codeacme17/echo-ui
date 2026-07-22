import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  appendJsonLine,
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
import { updateEvolveMetrics } from './evolve.mjs'
import { observeOwnerApprovedMerge } from './owner-gate.mjs'
import {
  appendValidatedEvent,
  assertLatestDurableCheckpoint,
  readEvents,
  readRun,
} from './run-store.mjs'

const TERMINAL_STATUSES = new Set(['completed', 'failed', 'blocked', 'cancelled'])

function canonicalRecord(record) {
  return JSON.stringify({
    schemaVersion: 1,
    runId: record.runId,
    issueNumber: record.issueNumber,
    status: record.status,
    startedAt: record.startedAt,
    finishedAt: record.finishedAt,
    prUrl: record.prUrl ?? null,
    headSha: record.headSha ?? null,
    mergeSha: record.mergeSha ?? null,
    failureFingerprint: record.failureFingerprint ?? null,
    notificationUrl: record.notificationUrl ?? null,
  })
}

function recordDigest(record) {
  return createHash('sha256').update(canonicalRecord(record)).digest('hex')
}

function validateRecord(record, run = null) {
  if (
    record.schemaVersion !== 1 ||
    !TERMINAL_STATUSES.has(record.status) ||
    !Number.isInteger(record.issueNumber) ||
    Number.isNaN(Date.parse(record.startedAt)) ||
    Number.isNaN(Date.parse(record.finishedAt)) ||
    Date.parse(record.finishedAt) < Date.parse(record.startedAt) ||
    (record.headSha !== null && !/^[0-9a-f]{40}$/i.test(record.headSha)) ||
    (record.mergeSha !== null && !/^[0-9a-f]{40}$/i.test(record.mergeSha))
  ) {
    throw new Error('invalid finalization journal record')
  }
  if (
    record.status === 'completed' &&
    (!record.prUrl || !record.headSha || !record.mergeSha || record.failureFingerprint !== null)
  ) {
    throw new Error('completed finalization record requires PR, head, and merge proof')
  }
  if (
    ['failed', 'blocked'].includes(record.status) &&
    (!assertNonEmpty(record.failureFingerprint, 'failureFingerprint') || !record.notificationUrl)
  ) {
    throw new Error('failed or blocked finalization requires a fingerprint and notification URL')
  }
  if (record.status === 'cancelled' && (!record.prUrl || !record.headSha)) {
    throw new Error('cancelled finalization requires a published PR')
  }
  if (
    run &&
    (record.runId !== run.runId ||
      record.issueNumber !== run.issueNumber ||
      record.startedAt !== run.startedAt ||
      record.prUrl !== run.prUrl ||
      record.headSha !== run.headSha)
  ) {
    throw new Error('finalization journal record does not match the run')
  }
  return record
}

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

async function verifyTerminalExternalProof({ loopRoot, record, githubApi }) {
  if (record.status === 'completed') {
    const merge = await observeOwnerApprovedMerge({
      loopRoot,
      prUrl: record.prUrl,
      expectedHeadSha: record.headSha,
      expectedHeadBranch: `codex/issue-${record.issueNumber}`,
      githubApi,
    })
    if (merge.mergeSha !== record.mergeSha) {
      throw new Error('completed finalization does not match the remote owner merge')
    }
  }
  if (['failed', 'blocked'].includes(record.status)) {
    const target = parsePullCommentUrl(record.notificationUrl)
    const pullTarget = record.prUrl ? new URL(record.prUrl) : null
    if (
      !target ||
      target.kind !== 'issue_comment' ||
      !['pull', 'issues'].includes(target.surface) ||
      (target.surface === 'issues' && target.number !== record.issueNumber) ||
      (target.surface === 'pull' &&
        (!pullTarget || !pullTarget.pathname.endsWith(`/pull/${target.number}`)))
    ) {
      throw new Error('terminal notification URL is not bound to the run issue or PR')
    }
    const { channel } = await journalConfiguration(loopRoot)
    const comment = await githubApi(
      `repos/${target.owner}/${target.repo}/issues/comments/${target.commentId}`,
    )
    const expectedType = record.status === 'failed' ? 'loop_failed' : 'blocked'
    if (
      !sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin) ||
      !comment.body?.includes(`**${expectedType}**`) ||
      !comment.body?.includes(`Run: \`${record.runId}\``)
    ) {
      throw new Error('terminal notification lacks durable automation-authored proof')
    }
  }
  if (record.status === 'cancelled') {
    const target = new URL(record.prUrl)
    const match = target.pathname.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)$/)
    if (!match) throw new Error('cancelled finalization requires a GitHub PR')
    const pull = await githubApi(`repos/${match[1]}/${match[2]}/pulls/${match[3]}`)
    if (pull.state !== 'closed' || pull.merged === true || pull.head?.sha !== record.headSha) {
      throw new Error('cancelled finalization requires the recorded PR closed without merge')
    }
  }
}

export async function prepareFinalizationRecord({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  status,
  mergeSha = null,
  failureFingerprint = null,
  finishedAt = new Date(),
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (run.finishedAt !== null) throw new Error('cannot prepare finalization for a finished run')
  const events = await readEvents(loopRoot, normalizedRunId)
  assertLatestDurableCheckpoint(events, 'prepare-finalization')
  const notificationType =
    status === 'failed' ? 'loop_failed' : status === 'blocked' ? 'blocked' : null
  const notificationUrl = notificationType
    ? (events.findLast(
        (event) =>
          event.type === 'owner_notified' &&
          event.status === 'delivered' &&
          event.payload?.notificationType === notificationType,
      )?.payload?.deliveryUrl ?? null)
    : null
  const resultPath = path.join(runDirectory(loopRoot, normalizedRunId), 'finalization-result.json')
  if (await pathExists(resultPath)) {
    const existing = validateRecord(await readJson(resultPath), run)
    if (
      existing.status !== status ||
      existing.mergeSha !== mergeSha ||
      existing.failureFingerprint !== failureFingerprint
    ) {
      throw new Error('a different finalization record is already prepared for this run')
    }
    await verifyTerminalExternalProof({ loopRoot, record: existing, githubApi })
    const { channel, owner, repo } = await journalConfiguration(loopRoot)
    const digest = recordDigest(existing)
    return {
      record: existing,
      resultPath,
      digest,
      body: [
        `<!-- issue-dev-loop:finalization:${normalizedRunId}:sha256:${digest} -->`,
        '```json',
        canonicalRecord(existing),
        '```',
      ].join('\n'),
      journalIssueUrl: `https://github.com/${owner}/${repo}/issues/${channel.stateIssueNumber}`,
    }
  }
  const record = validateRecord(
    {
      schemaVersion: 1,
      runId: normalizedRunId,
      issueNumber: run.issueNumber,
      status,
      startedAt: run.startedAt,
      finishedAt: finishedAt.toISOString(),
      prUrl: run.prUrl,
      headSha: run.headSha,
      mergeSha,
      failureFingerprint,
      notificationUrl,
    },
    run,
  )
  await verifyTerminalExternalProof({ loopRoot, record, githubApi })
  const { channel, owner, repo } = await journalConfiguration(loopRoot)
  const digest = recordDigest(record)
  const body = [
    `<!-- issue-dev-loop:finalization:${normalizedRunId}:sha256:${digest} -->`,
    '```json',
    canonicalRecord(record),
    '```',
  ].join('\n')
  await writeJson(resultPath, record)
  return {
    record,
    resultPath,
    digest,
    body,
    journalIssueUrl: `https://github.com/${owner}/${repo}/issues/${channel.stateIssueNumber}`,
  }
}

export async function recordFinalizationPublication({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  resultPath,
  commentUrl,
  now = new Date(),
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (run.finishedAt !== null) throw new Error('cannot publish finalization for a finished run')
  const resolvedResultPath = path.resolve(assertNonEmpty(resultPath, 'resultPath'))
  const runRoot = runDirectory(loopRoot, normalizedRunId)
  if (!resolvedResultPath.startsWith(`${runRoot}${path.sep}`)) {
    throw new Error('finalization result must be inside the current run directory')
  }
  const record = validateRecord(await readJson(resolvedResultPath), run)
  await verifyTerminalExternalProof({ loopRoot, record, githubApi })
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
    throw new Error('finalization comment must be on the configured state journal issue')
  }
  const comment = await githubApi(
    `repos/${target.owner}/${target.repo}/issues/comments/${target.commentId}`,
  )
  const digest = recordDigest(record)
  const marker = `<!-- issue-dev-loop:finalization:${normalizedRunId}:sha256:${digest} -->`
  if (
    !sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin) ||
    !comment.body?.includes(marker) ||
    !comment.body?.includes(canonicalRecord(record))
  ) {
    throw new Error('published finalization comment does not attest the exact record')
  }
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'finalization_published',
    status: record.status,
    payload: {
      commentUrl,
      digest,
      finishedAt: record.finishedAt,
      mergeSha: record.mergeSha,
      failureFingerprint: record.failureFingerprint,
      notificationUrl: record.notificationUrl,
    },
    now,
  })
  return { record, digest, commentUrl }
}

export async function reconcileFinalizationJournal({
  loopRoot = DEFAULT_LOOP_ROOT,
  now = new Date(),
  githubPaginatedApi = defaultGitHubPaginatedApi,
  githubApi = defaultGitHubApi,
} = {}) {
  const { channel, owner, repo } = await journalConfiguration(loopRoot)
  const comments = await githubPaginatedApi(
    `repos/${owner}/${repo}/issues/${channel.stateIssueNumber}/comments?per_page=100`,
  )
  const records = []
  for (const comment of comments) {
    if (!sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin)) continue
    const marker = comment.body?.match(
      /<!-- issue-dev-loop:finalization:([^:]+):sha256:([0-9a-f]{64}) -->/,
    )
    const serialized = comment.body?.match(/```json\s*([^\n]+)\s*```/)?.[1]
    if (!marker || !serialized) continue
    const record = validateRecord(JSON.parse(serialized))
    if (record.runId !== marker[1] || recordDigest(record) !== marker[2]) {
      throw new Error(`invalid durable finalization record for ${marker[1]}`)
    }
    await verifyTerminalExternalProof({ loopRoot, record, githubApi })
    records.push(record)
  }
  records.sort((left, right) => Date.parse(left.finishedAt) - Date.parse(right.finishedAt))

  const indexPath = path.join(loopRoot, 'logs', 'index.jsonl')
  const existing = (await readFile(indexPath, 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  const byRunId = new Map(
    existing
      .filter((entry) => entry.event === 'run_finalized')
      .map((entry) => [entry.runId, entry]),
  )
  for (const record of records) {
    const prior = byRunId.get(record.runId)
    if (prior) {
      if (canonicalRecord(prior) !== canonicalRecord(record)) {
        throw new Error(`local finalization conflicts with durable journal: ${record.runId}`)
      }
      continue
    }
    await appendJsonLine(indexPath, { event: 'run_finalized', ...record })
    byRunId.set(record.runId, record)
  }
  await updateEvolveMetrics({ loopRoot, now })
  return { reconciled: records.length, durableRunIds: records.map((record) => record.runId) }
}

export { canonicalRecord, recordDigest }
