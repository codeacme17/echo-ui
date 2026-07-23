import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  assertHttpUrl,
  assertNonEmpty,
  defaultGitHubApi,
  parsePullCommentUrl,
  readJson,
  sameGitHubLogin,
  sameRepository,
  writeJson,
} from './common.mjs'
import { observeOwnerApprovedMerge } from './owner-gate.mjs'

function canonicalPendingRequest(request) {
  const normalized = {
    schemaVersion: request.schemaVersion,
    requestId: request.requestId,
    status: request.status,
    reason: request.reason,
    requestedAt: request.requestedAt,
    finalizedRunCount: request.finalizedRunCount,
  }
  if (
    normalized.schemaVersion !== 1 ||
    normalized.status !== 'pending' ||
    !/^[A-Z0-9-]+$/.test(normalized.requestId ?? '') ||
    !assertNonEmpty(normalized.reason, 'evolve.reason') ||
    Number.isNaN(Date.parse(normalized.requestedAt)) ||
    !Number.isInteger(normalized.finalizedRunCount) ||
    normalized.finalizedRunCount < 1
  ) {
    throw new Error('invalid pending evolve request')
  }
  return JSON.stringify(normalized)
}

function pendingRequestDigest(request) {
  return createHash('sha256').update(canonicalPendingRequest(request)).digest('hex')
}

export async function prepareEvolveRequestPublication({
  loopRoot = DEFAULT_LOOP_ROOT,
  requestId,
} = {}) {
  const normalizedRequestId = assertNonEmpty(requestId, 'requestId')
  const metrics = await readJson(path.join(loopRoot, 'evolve', 'metrics.json'))
  if (!metrics.evolveDue || metrics.pendingRequestId !== normalizedRequestId) {
    throw new Error(`not the pending evolve request: ${normalizedRequestId}`)
  }
  const request = await readJson(
    path.join(loopRoot, 'evolve', 'requests', `${normalizedRequestId}.json`),
  )
  const serialized = canonicalPendingRequest(request)
  const digest = pendingRequestDigest(request)
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  return {
    request,
    digest,
    body: [
      `<!-- issue-dev-loop:evolve-request:${normalizedRequestId}:sha256:${digest} -->`,
      '```json',
      serialized,
      '```',
    ].join('\n'),
    journalIssueUrl: `https://github.com/${channel.repository}/issues/${channel.stateIssueNumber}`,
  }
}

export async function verifyPublishedEvolveRequest({
  loopRoot = DEFAULT_LOOP_ROOT,
  requestId,
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRequestId = assertNonEmpty(requestId, 'requestId')
  const requestPath = path.join(
    loopRoot,
    'evolve',
    'requests',
    `${normalizedRequestId}.json`,
  )
  const request = await readJson(requestPath)
  const publicationUrl = assertHttpUrl(request.publicationUrl, 'evolve.publicationUrl')
  const target = parsePullCommentUrl(publicationUrl)
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const repositoryTarget = {
    owner: channel.repository.split('/')[0],
    repo: channel.repository.split('/')[1],
  }
  if (
    !target ||
    target.kind !== 'issue_comment' ||
    target.number !== channel.stateIssueNumber ||
    !sameRepository(target, repositoryTarget)
  ) {
    throw new Error('evolve request publication must be on the configured state journal')
  }
  const comment = await githubApi(
    `repos/${target.owner}/${target.repo}/issues/comments/${target.commentId}`,
  )
  const digest = pendingRequestDigest(request)
  const marker = `<!-- issue-dev-loop:evolve-request:${normalizedRequestId}:sha256:${digest} -->`
  if (
    !sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin) ||
    !comment.body?.includes(marker) ||
    !comment.body?.includes(canonicalPendingRequest(request)) ||
    request.publicationDigest !== digest
  ) {
    throw new Error('evolve request lacks an exact automation-authored durable publication')
  }
  return { request, digest, publicationUrl }
}

export async function recordEvolveRequestPublication({
  loopRoot = DEFAULT_LOOP_ROOT,
  requestId,
  commentUrl,
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRequestId = assertNonEmpty(requestId, 'requestId')
  const requestPath = path.join(
    loopRoot,
    'evolve',
    'requests',
    `${normalizedRequestId}.json`,
  )
  const request = await readJson(requestPath)
  const digest = pendingRequestDigest(request)
  await writeJson(requestPath, {
    ...request,
    publicationUrl: assertHttpUrl(commentUrl, 'commentUrl'),
    publicationDigest: digest,
  })
  try {
    return await verifyPublishedEvolveRequest({
      loopRoot,
      requestId: normalizedRequestId,
      githubApi,
    })
  } catch (error) {
    await writeJson(requestPath, request)
    throw error
  }
}

export async function updateEvolveMetrics({ loopRoot, now }) {
  const metricsPath = path.join(loopRoot, 'evolve', 'metrics.json')
  const metrics = await readJson(metricsPath)
  const history = (await readFile(path.join(loopRoot, 'logs', 'index.jsonl'), 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((entry) => entry.event === 'run_finalized')
    .sort((left, right) => Date.parse(left.finishedAt) - Date.parse(right.finishedAt))
  metrics.finalizedRuns = history.length
  metrics.successfulRuns = history.filter((entry) => entry.status === 'completed').length
  metrics.failedRuns = history.filter((entry) =>
    ['failed', 'blocked'].includes(entry.status),
  ).length
  metrics.recentFailureFingerprints = history
    .slice(-3)
    .map((entry) => entry.failureFingerprint || null)

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
    const requestId = `EVL-${String(metrics.finalizedRuns).padStart(6, '0')}-${dueReason
      .replaceAll('_', '-')
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
    expectedHeadBranch: `codex/evolve-${normalizedRequestId}`,
    expectedRepository: (
      await readJson(path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'))
    ).repository,
    requiredBodyMarker: `<!-- issue-dev-loop:evolve-request:${normalizedRequestId} -->`,
    createdAfter: request.requestedAt,
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
