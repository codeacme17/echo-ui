import { randomBytes } from 'node:crypto'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  assertHttpUrl,
  assertNonEmpty,
  defaultGitHubApi,
  readJson,
  timestampToken,
  writeJson,
} from './common.mjs'
import { observeOwnerApprovedMerge } from './owner-gate.mjs'

export async function updateEvolveMetrics({ loopRoot, status, failureFingerprint, now }) {
  const metricsPath = path.join(loopRoot, 'evolve', 'metrics.json')
  const metrics = await readJson(metricsPath)
  metrics.finalizedRuns += 1
  if (status === 'completed') metrics.successfulRuns += 1
  if (['failed', 'blocked'].includes(status)) metrics.failedRuns += 1

  const recentFailures = Array.isArray(metrics.recentFailureFingerprints)
    ? metrics.recentFailureFingerprints
    : []
  recentFailures.push(failureFingerprint || null)
  metrics.recentFailureFingerprints = recentFailures.slice(-3)

  let dueReason = null
  if (metrics.finalizedRuns - (metrics.lastEvolvedRunCount ?? 0) >= 10) {
    dueReason = 'ten_finalized_runs'
  } else if (
    metrics.recentFailureFingerprints.length === 3 &&
    metrics.recentFailureFingerprints[0] !== null &&
    new Set(metrics.recentFailureFingerprints).size === 1
  ) {
    dueReason = 'repeated_failure_pattern'
  }

  if (dueReason && !metrics.evolveDue) {
    const requestId = `EVL-${timestampToken(now).replace('Z', '')}-${randomBytes(3)
      .toString('hex')
      .toUpperCase()}`
    await writeJson(path.join(loopRoot, 'evolve', 'requests', `${requestId}.json`), {
      schemaVersion: 1,
      requestId,
      status: 'pending',
      reason: dueReason,
      requestedAt: now.toISOString(),
      finalizedRunCount: metrics.finalizedRuns,
    })
    metrics.evolveDue = true
    metrics.pendingRequestId = requestId
  }
  await writeJson(metricsPath, metrics)
  return metrics
}

export async function getEvolveStatus({ loopRoot = DEFAULT_LOOP_ROOT } = {}) {
  return readJson(path.join(loopRoot, 'evolve', 'metrics.json'))
}

export async function completeEvolve({
  loopRoot = DEFAULT_LOOP_ROOT,
  requestId,
  summary,
  prUrl,
  now = new Date(),
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRequestId = assertNonEmpty(requestId, 'requestId')
  const metricsPath = path.join(loopRoot, 'evolve', 'metrics.json')
  const metrics = await readJson(metricsPath)
  if (!metrics.evolveDue || metrics.pendingRequestId !== normalizedRequestId) {
    throw new Error(`not the pending evolve request: ${normalizedRequestId}`)
  }
  const requestPath = path.join(loopRoot, 'evolve', 'requests', `${normalizedRequestId}.json`)
  const request = await readJson(requestPath)
  const publishedPrUrl = assertHttpUrl(prUrl, 'prUrl')
  const merge = await observeOwnerApprovedMerge({
    loopRoot,
    prUrl: publishedPrUrl,
    githubApi,
  })

  const completed = {
    ...request,
    status: 'completed',
    completedAt: now.toISOString(),
    summary: assertNonEmpty(summary, 'summary'),
    prUrl: publishedPrUrl,
    headSha: merge.headSha,
    mergeSha: merge.mergeSha,
  }
  await writeJson(requestPath, completed)
  metrics.evolveDue = false
  metrics.pendingRequestId = null
  metrics.lastEvolvedAt = now.toISOString()
  metrics.lastEvolvedRunCount = metrics.finalizedRuns
  metrics.completedEvolveSessions = (metrics.completedEvolveSessions ?? 0) + 1
  await writeJson(metricsPath, metrics)
  return completed
}
