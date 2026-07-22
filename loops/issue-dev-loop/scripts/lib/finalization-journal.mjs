import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  appendJsonLine,
  assertNonEmpty,
  assertRunId,
  defaultGitHubApi,
  defaultGitHubPaginatedApi,
  pathExists,
  readJson,
  runDirectory,
  sameGitHubLogin,
  writeJson,
} from './common.mjs'
import { updateEvolveMetrics } from './evolve.mjs'
import {
  canonicalFinalizationRecord,
  finalizationJournalConfiguration,
  finalizationRecordDigest,
  validateFinalizationRecord,
  verifyPublishedFinalization,
  verifyTerminalExternalProof,
} from './finalization-proof.mjs'
import { verifyLatestDurableCheckpoint } from './checkpoint-proof.mjs'
import { appendValidatedEvent, readEvents, readRun } from './run-store.mjs'

const TERMINAL_STATUSES = new Set(['completed', 'failed', 'blocked', 'cancelled'])

export const canonicalRecord = canonicalFinalizationRecord
export const recordDigest = finalizationRecordDigest

export async function prepareFinalizationRecord({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  status,
  mergeSha = null,
  failureFingerprint = null,
  finishedAt = new Date(),
  githubApi = defaultGitHubApi,
  checkpointVerifier = verifyLatestDurableCheckpoint,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (run.finishedAt !== null) throw new Error('cannot prepare finalization for a finished run')
  const events = await readEvents(loopRoot, normalizedRunId)
  await checkpointVerifier({
    loopRoot,
    runId: normalizedRunId,
    events,
    operation: 'prepare-finalization',
    githubApi,
  })
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
    const existing = validateFinalizationRecord(await readJson(resultPath), run)
    if (
      existing.status !== status ||
      existing.mergeSha !== mergeSha ||
      existing.failureFingerprint !== failureFingerprint
    ) {
      throw new Error('a different finalization record is already prepared for this run')
    }
    await verifyTerminalExternalProof({ loopRoot, record: existing, githubApi })
    const { channel, owner, repo } = await finalizationJournalConfiguration(loopRoot)
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
  const record = validateFinalizationRecord(
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
  const { channel, owner, repo } = await finalizationJournalConfiguration(loopRoot)
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
  const record = validateFinalizationRecord(await readJson(resolvedResultPath), run)
  const { digest } = await verifyPublishedFinalization({
    loopRoot,
    record,
    commentUrl: assertNonEmpty(commentUrl, 'commentUrl'),
    expectedHeadBranch: run.branch,
    githubApi,
  })
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
  const { channel, owner, repo } = await finalizationJournalConfiguration(loopRoot)
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
    const record = validateFinalizationRecord(JSON.parse(serialized))
    if (record.runId !== marker[1] || recordDigest(record) !== marker[2]) {
      throw new Error(`invalid durable finalization record for ${marker[1]}`)
    }
    await verifyPublishedFinalization({
      loopRoot,
      record,
      commentUrl: comment.html_url,
      githubApi,
    })
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
