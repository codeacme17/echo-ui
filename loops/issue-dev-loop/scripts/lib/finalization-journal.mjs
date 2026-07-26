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
  validateTerminalPauseCheckpoint,
  verifyFailedOrBlockedNotification,
  verifyPullNotificationComment,
  verifyPublishedFinalization,
  verifyTerminalExternalProof,
} from './finalization-proof.mjs'
import {
  checkpointRecordDigest,
  verifyLatestDurableCheckpoint,
} from './checkpoint-proof.mjs'
import { appendValidatedEvent, readEvents, readRun } from './run-store.mjs'
import { createNotification } from './notifications.mjs'
import { observeOwnerApprovedMerge } from './owner-gate.mjs'
import { TERMINAL_STATUSES } from './lifecycle-status.mjs'
import { validateFinalizationHistory } from './validation.mjs'

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
  notifyOwner = createNotification,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (run.finishedAt !== null) throw new Error('cannot prepare finalization for a finished run')
  const events = await readEvents(loopRoot, normalizedRunId)
  const predecessorCheckpoint = await checkpointVerifier({
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
  let pauseProof = {
    predecessorCheckpointUrl: null,
    predecessorCheckpointDigest: null,
    pauseStartedAt: null,
    notificationNotifiedAt: null,
  }
  if (notificationType) {
    if (
      !predecessorCheckpoint?.record ||
      !predecessorCheckpoint?.commentUrl ||
      !predecessorCheckpoint?.digest
    ) {
      throw new Error(
        'failed or blocked finalization requires the current durable predecessor checkpoint',
      )
    }
    const pause = validateTerminalPauseCheckpoint({
      checkpoint: predecessorCheckpoint.record,
      status,
      runId: normalizedRunId,
      issueNumber: run.issueNumber,
      prUrl: run.prUrl,
      headSha: run.headSha,
      notificationUrl,
    })
    const notification = await verifyFailedOrBlockedNotification({
      loopRoot,
      status,
      runId: normalizedRunId,
      issueNumber: run.issueNumber,
      prUrl: run.prUrl,
      notificationUrl,
      githubApi,
    })
    pauseProof = {
      predecessorCheckpointUrl: predecessorCheckpoint.commentUrl,
      predecessorCheckpointDigest: predecessorCheckpoint.digest,
      pauseStartedAt: pause.pauseStartedAt,
      notificationNotifiedAt: notification.created_at,
    }
  }
  const resultPath = path.join(runDirectory(loopRoot, normalizedRunId), 'finalization-result.json')
  if (await pathExists(resultPath)) {
    const existing = validateFinalizationRecord(await readJson(resultPath), run)
    if (
      existing.status !== status ||
      existing.mergeSha !== mergeSha ||
      existing.failureFingerprint !== failureFingerprint ||
      existing.predecessorCheckpointUrl !== pauseProof.predecessorCheckpointUrl ||
      existing.predecessorCheckpointDigest !== pauseProof.predecessorCheckpointDigest ||
      existing.pauseStartedAt !== pauseProof.pauseStartedAt ||
      existing.notificationNotifiedAt !== pauseProof.notificationNotifiedAt
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
  let completionProof = {
    notificationUrl,
    readyNotificationUrl: null,
    readyNotifiedAt: null,
    completionNotifiedAt: null,
    notificationWebhookStatus: null,
    ...pauseProof,
  }
  let recordFinishedAt = finishedAt
  if (status === 'completed') {
    const channel = await readJson(
      path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
    )
    const readyEvent = events.findLast(
      (event) =>
        event.type === 'owner_notified' &&
        event.status === 'delivered' &&
        ['pr_ready_for_review', 'pr_updated_for_review'].includes(
          event.payload?.notificationType,
        ) &&
        event.payload?.targetUrl === run.prUrl &&
        event.payload?.headSha === run.headSha &&
        event.payload?.deliveryUrl,
    )
    if (!readyEvent) {
      throw new Error('completed finalization requires the delivered exact-head Ready notification')
    }
    const readyNotification = await verifyPullNotificationComment({
      url: readyEvent.payload.deliveryUrl,
      allowedTypes: ['pr_ready_for_review', 'pr_updated_for_review'],
      runId: normalizedRunId,
      prUrl: run.prUrl,
      channel,
      githubApi,
    })
    const merge = await observeOwnerApprovedMerge({
      loopRoot,
      prUrl: run.prUrl,
      expectedHeadSha: run.headSha,
      expectedHeadBranch: run.branch,
      readyAfter: readyNotification.comment.created_at,
      githubApi,
    })
    if (merge.mergeSha !== mergeSha) {
      throw new Error('completed mergeSha does not match the remote owner merge')
    }
    const completionNotification = await notifyOwner({
      loopRoot,
      runId: normalizedRunId,
      type: 'pr_completed',
      summary: `PR merged by the owner at ${merge.mergeSha}.`,
      requestedAction: 'No action is required; the completed run is being finalized.',
      targetUrl: run.prUrl,
      evidenceUrl: run.prUrl,
      blocking: false,
      now: finishedAt,
      githubApi,
      checkpointVerifier,
      recordEvent: false,
    })
    if (
      completionNotification.delivery.github !== 'delivered' ||
      !completionNotification.delivery.githubUrl ||
      ['pending', 'dry_run'].includes(completionNotification.delivery.webhook)
    ) {
      throw new Error(
        'completed finalization requires durable GitHub delivery and a settled webhook attempt',
      )
    }
    const publishedCompletion = await verifyPullNotificationComment({
      url: completionNotification.delivery.githubUrl,
      allowedTypes: ['pr_completed'],
      runId: normalizedRunId,
      prUrl: run.prUrl,
      channel,
      githubApi,
    })
    completionProof = {
      notificationUrl: completionNotification.delivery.githubUrl,
      readyNotificationUrl: readyEvent.payload.deliveryUrl,
      readyNotifiedAt: readyNotification.comment.created_at,
      completionNotifiedAt: publishedCompletion.comment.created_at,
      notificationWebhookStatus: completionNotification.delivery.webhook,
      ...pauseProof,
    }
    recordFinishedAt = new Date(
      Math.max(finishedAt.getTime(), Date.parse(publishedCompletion.comment.created_at)),
    )
  }
  const record = validateFinalizationRecord(
    {
      schemaVersion: 1,
      runId: normalizedRunId,
      issueNumber: run.issueNumber,
      status,
      startedAt: run.startedAt,
      finishedAt: recordFinishedAt.toISOString(),
      prUrl: run.prUrl,
      headSha: run.headSha,
      mergeSha,
      failureFingerprint,
      ...completionProof,
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
  const resultSource = await readFile(resolvedResultPath, 'utf8')
  const record = validateFinalizationRecord(JSON.parse(resultSource), run)
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
      resultPath: path.relative(loopRoot, resolvedResultPath),
      resultDigest: createHash('sha256').update(resultSource).digest('hex'),
      finishedAt: record.finishedAt,
      mergeSha: record.mergeSha,
      failureFingerprint: record.failureFingerprint,
      notificationUrl: record.notificationUrl,
      readyNotificationUrl: record.readyNotificationUrl,
      readyNotifiedAt: record.readyNotifiedAt,
      completionNotifiedAt: record.completionNotifiedAt,
      notificationWebhookStatus: record.notificationWebhookStatus,
      predecessorCheckpointUrl: record.predecessorCheckpointUrl,
      predecessorCheckpointDigest: record.predecessorCheckpointDigest,
      pauseStartedAt: record.pauseStartedAt,
      notificationNotifiedAt: record.notificationNotifiedAt,
    },
    now,
  })
  return { record, digest, commentUrl }
}

export async function loadDurableFinalizationRecords({
  loopRoot = DEFAULT_LOOP_ROOT,
  githubPaginatedApi = defaultGitHubPaginatedApi,
  githubApi = defaultGitHubApi,
  latestActiveCheckpoints = null,
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
  const recordsByRunId = new Map()
  for (const record of records) {
    const existing = recordsByRunId.get(record.runId)
    if (existing && canonicalRecord(existing) !== canonicalRecord(record)) {
      throw new Error(`conflicting durable finalization records for ${record.runId}`)
    }
    if (!existing) recordsByRunId.set(record.runId, record)
  }
  const latestActiveByRunId = Array.isArray(latestActiveCheckpoints)
    ? new Map(
        latestActiveCheckpoints.map((checkpoint) => [
          checkpoint.record.run.runId,
          checkpoint,
        ]),
      )
    : null
  const effectiveRecords = [...recordsByRunId.values()].filter((record) => {
    if (!latestActiveByRunId || !['failed', 'blocked'].includes(record.status)) {
      return true
    }
    const latest = latestActiveByRunId.get(record.runId)
    return (
      latest &&
      checkpointRecordDigest(latest.record) === record.predecessorCheckpointDigest
    )
  })
  effectiveRecords.sort(
    (left, right) => Date.parse(left.finishedAt) - Date.parse(right.finishedAt),
  )
  return effectiveRecords
}

export async function reconcileFinalizationJournal({
  loopRoot = DEFAULT_LOOP_ROOT,
  now = new Date(),
  githubPaginatedApi = defaultGitHubPaginatedApi,
  githubApi = defaultGitHubApi,
  latestActiveCheckpoints = null,
} = {}) {
  const effectiveRecords = await loadDurableFinalizationRecords({
    loopRoot,
    githubPaginatedApi,
    githubApi,
    latestActiveCheckpoints,
  })

  const indexPath = path.join(loopRoot, 'logs', 'index.jsonl')
  const existing = (await readFile(indexPath, 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  validateFinalizationHistory(existing)
  const byRunId = new Map(
    existing
      .filter((entry) => entry.event === 'run_finalized')
      .map((entry) => [entry.runId, entry]),
  )
  const latestLocalState = new Map()
  for (const entry of existing) {
    if (['run_finalized', 'run_finalization_unverified'].includes(entry.event)) {
      latestLocalState.set(entry.runId, entry.event)
    }
  }
  for (const record of effectiveRecords) {
    const prior = byRunId.get(record.runId)
    if (prior) {
      if (canonicalRecord(prior) !== canonicalRecord(record)) {
        throw new Error(`local finalization conflicts with durable journal: ${record.runId}`)
      }
      if (latestLocalState.get(record.runId) === 'run_finalization_unverified') {
        await appendJsonLine(indexPath, { event: 'run_finalized', ...record })
        latestLocalState.set(record.runId, 'run_finalized')
      }
      continue
    }
    await appendJsonLine(indexPath, { event: 'run_finalized', ...record })
    byRunId.set(record.runId, record)
    latestLocalState.set(record.runId, 'run_finalized')
  }
  const durableRunIds = new Set(effectiveRecords.map((record) => record.runId))
  for (const runId of byRunId.keys()) {
    if (
      !durableRunIds.has(runId) &&
      latestLocalState.get(runId) !== 'run_finalization_unverified'
    ) {
      await appendJsonLine(indexPath, {
        schemaVersion: 1,
        event: 'run_finalization_unverified',
        runId,
        timestamp: now.toISOString(),
      })
    }
  }
  await updateEvolveMetrics({ loopRoot, now })
  return {
    reconciled: effectiveRecords.length,
    durableRunIds: effectiveRecords.map((record) => record.runId),
    durableRecords: effectiveRecords,
  }
}
