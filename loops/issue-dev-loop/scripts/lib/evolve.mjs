import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  assertAutomationIdentity,
  assertHttpUrl,
  assertNonEmpty,
  defaultGitHubApi,
  defaultGitHubPaginatedApi,
  execFileAsync,
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

function canonicalCompletedEvolve(record) {
  const normalized = {
    schemaVersion: record.schemaVersion,
    requestId: record.requestId,
    status: record.status,
    reason: record.reason,
    requestedAt: record.requestedAt,
    finalizedRunCount: record.finalizedRunCount,
    requestPublicationUrl: record.requestPublicationUrl,
    requestPublicationDigest: record.requestPublicationDigest,
    summary: record.summary,
    prUrl: record.prUrl,
    headSha: record.headSha,
    mergeSha: record.mergeSha,
    mergeAt: record.mergeAt,
  }
  if (
    normalized.schemaVersion !== 1 ||
    normalized.status !== 'completed' ||
    !/^[A-Z0-9-]+$/.test(normalized.requestId ?? '') ||
    !assertNonEmpty(normalized.reason, 'evolve.reason') ||
    Number.isNaN(Date.parse(normalized.requestedAt)) ||
    !Number.isInteger(normalized.finalizedRunCount) ||
    normalized.finalizedRunCount < 1 ||
    !assertHttpUrl(normalized.requestPublicationUrl, 'evolve.requestPublicationUrl') ||
    !/^[0-9a-f]{64}$/.test(normalized.requestPublicationDigest ?? '') ||
    !assertNonEmpty(normalized.summary, 'evolve.summary') ||
    !assertHttpUrl(normalized.prUrl, 'evolve.prUrl') ||
    !/^[0-9a-f]{40}$/i.test(normalized.headSha ?? '') ||
    !/^[0-9a-f]{40}$/i.test(normalized.mergeSha ?? '') ||
    Number.isNaN(Date.parse(normalized.mergeAt))
  ) {
    throw new Error('invalid completed evolve record')
  }
  return JSON.stringify(normalized)
}

function completedEvolveDigest(record) {
  return createHash('sha256').update(canonicalCompletedEvolve(record)).digest('hex')
}

function parseCompletedEvolveComment(comment, { requestId = null } = {}) {
  const marker = comment.body?.match(
    /<!-- issue-dev-loop:evolve-completion:([^:]+):sha256:([0-9a-f]{64}) -->/,
  )
  const serialized = comment.body?.match(/```json\s*([^\n]+)\s*```/)?.[1]
  if (!marker || !serialized || (requestId && marker[1] !== requestId)) return null
  const record = JSON.parse(serialized)
  const digest = completedEvolveDigest(record)
  if (record.requestId !== marker[1] || digest !== marker[2]) {
    throw new Error(`invalid durable evolve completion: ${marker[1]}`)
  }
  return { record, requestId: marker[1], digest, serialized }
}

function stateJournalTarget(channel) {
  const [owner, repo] = channel.repository.split('/')
  return { owner, repo, number: channel.stateIssueNumber }
}

function isStateJournalComment(url, channel) {
  const target = parsePullCommentUrl(url)
  const journal = stateJournalTarget(channel)
  return (
    target?.kind === 'issue_comment' &&
    target.surface === 'issues' &&
    target.number === journal.number &&
    sameRepository(target, journal)
  )
}

async function defaultGitHubComment(target, body) {
  const result = await execFileAsync(
    'gh',
    [
      'api',
      `repos/${target.owner}/${target.repo}/issues/${target.number}/comments`,
      '--method',
      'POST',
      '-f',
      `body=${body}`,
    ],
    { maxBuffer: 1024 * 1024 },
  )
  return JSON.parse(result.stdout)
}

async function verifyPendingRequestComment({ request, comment, channel }) {
  const digest = pendingRequestDigest(request)
  const marker = `<!-- issue-dev-loop:evolve-request:${request.requestId}:sha256:${digest} -->`
  if (
    !sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin) ||
    !comment.body?.includes(marker) ||
    !comment.body?.includes(canonicalPendingRequest(request))
  ) {
    throw new Error('evolve request lacks an exact automation-authored durable publication')
  }
  return digest
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
  if (!isStateJournalComment(publicationUrl, channel)) {
    throw new Error('evolve request publication must be on the configured state journal')
  }
  const comment = await githubApi(
    `repos/${target.owner}/${target.repo}/issues/comments/${target.commentId}`,
  )
  const digest = pendingRequestDigest(request)
  if (
    (await verifyPendingRequestComment({ request, comment, channel })) !== digest ||
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
  const indexEntries = (await readFile(path.join(loopRoot, 'logs', 'index.jsonl'), 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  const finalizations = new Map()
  for (const entry of indexEntries) {
    if (entry.event === 'run_finalized') finalizations.set(entry.runId, entry)
    if (entry.event === 'run_finalization_unverified') finalizations.delete(entry.runId)
  }
  const history = [...finalizations.values()]
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
  } else {
    const sinceLastEvolve = history.slice(metrics.lastEvolvedRunCount ?? 0)
    const recentSinceLastEvolve = sinceLastEvolve
      .slice(-3)
      .map((entry) => entry.failureFingerprint || null)
    if (
      recentSinceLastEvolve.length === 3 &&
      recentSinceLastEvolve[0] !== null &&
      new Set(recentSinceLastEvolve).size === 1
    ) {
      dueReason = 'repeated_failure_pattern'
    }
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
  githubPaginatedApi = defaultGitHubPaginatedApi,
  githubComment = defaultGitHubComment,
  verifyAutomationIdentity = assertAutomationIdentity,
} = {}) {
  const normalizedRequestId = assertNonEmpty(requestId, 'requestId')
  const metricsPath = path.join(loopRoot, 'evolve', 'metrics.json')
  const metrics = await readJson(metricsPath)
  if (!metrics.evolveDue || metrics.pendingRequestId !== normalizedRequestId) {
    throw new Error(`not the pending evolve request: ${normalizedRequestId}`)
  }
  const requestPath = path.join(loopRoot, 'evolve', 'requests', `${normalizedRequestId}.json`)
  const request = await readJson(requestPath)
  const publishedRequest = await verifyPublishedEvolveRequest({
    loopRoot,
    requestId: normalizedRequestId,
    githubApi,
  })
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
  if (Number.isNaN(Date.parse(merge.mergeAt))) {
    throw new Error('owner-merged evolve PR must expose a durable merge timestamp')
  }
  const record = {
    schemaVersion: 1,
    requestId: normalizedRequestId,
    status: 'completed',
    reason: request.reason,
    requestedAt: request.requestedAt,
    finalizedRunCount: request.finalizedRunCount,
    requestPublicationUrl: publishedRequest.publicationUrl,
    requestPublicationDigest: publishedRequest.digest,
    summary: assertNonEmpty(summary, 'summary'),
    prUrl: publishedPrUrl,
    headSha: merge.headSha,
    mergeSha: merge.mergeSha,
    mergeAt: merge.mergeAt,
  }
  const digest = completedEvolveDigest(record)
  const body = [
    `<!-- issue-dev-loop:evolve-completion:${normalizedRequestId}:sha256:${digest} -->`,
    '```json',
    canonicalCompletedEvolve(record),
    '```',
  ].join('\n')
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const journal = stateJournalTarget(channel)
  const comments = await githubPaginatedApi(
    `repos/${journal.owner}/${journal.repo}/issues/${journal.number}/comments?per_page=100`,
  )
  let verified = null
  for (const comment of comments) {
    if (!sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin)) continue
    const publication = parseCompletedEvolveComment(comment, {
      requestId: normalizedRequestId,
    })
    if (!publication) continue
    if (
      publication.digest !== digest ||
      publication.serialized !== canonicalCompletedEvolve(record)
    ) {
      throw new Error(`conflicting durable evolve completion: ${normalizedRequestId}`)
    }
    const candidate = await verifyPublishedEvolveCompletion({
      loopRoot,
      record,
      commentUrl: comment.html_url,
      githubApi,
    })
    verified ??= candidate
  }
  if (!verified) {
    if (githubComment === defaultGitHubComment) await verifyAutomationIdentity({ loopRoot })
    const comment = await githubComment(journal, body)
    const commentUrl = assertHttpUrl(comment?.html_url, 'evolve.completionPublicationUrl')
    verified = await verifyPublishedEvolveCompletion({
      loopRoot,
      record,
      commentUrl,
      githubApi,
    })
  }
  const commentUrl = verified.commentUrl
  const completed = {
    ...request,
    status: 'completed',
    completedAt: record.mergeAt,
    journaledAt: verified.journaledAt,
    summary: record.summary,
    prUrl: record.prUrl,
    headSha: record.headSha,
    mergeSha: record.mergeSha,
    mergeAt: record.mergeAt,
    completionPublicationUrl: commentUrl,
    completionPublicationDigest: digest,
  }
  await writeJson(requestPath, completed)
  metrics.evolveDue = false
  metrics.pendingRequestId = null
  metrics.lastEvolvedAt = record.mergeAt
  metrics.lastEvolvedRunCount = record.finalizedRunCount
  metrics.completedEvolveSessions = (metrics.completedEvolveSessions ?? 0) + 1
  await writeJson(metricsPath, metrics)
  await updateEvolveMetrics({ loopRoot, now })
  return completed
}

export async function verifyPublishedEvolveCompletion({
  loopRoot = DEFAULT_LOOP_ROOT,
  record,
  commentUrl,
  githubApi = defaultGitHubApi,
} = {}) {
  const serialized = canonicalCompletedEvolve(record)
  const digest = completedEvolveDigest(record)
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  if (!isStateJournalComment(commentUrl, channel)) {
    throw new Error('evolve completion publication must be on the configured state journal')
  }
  if (!isStateJournalComment(record.requestPublicationUrl, channel)) {
    throw new Error('evolve completion is not bound to its durable request')
  }
  const requestTarget = parsePullCommentUrl(record.requestPublicationUrl)
  const requestComment = await githubApi(
    `repos/${requestTarget.owner}/${requestTarget.repo}/issues/comments/${requestTarget.commentId}`,
  )
  const pendingRequest = {
    schemaVersion: 1,
    requestId: record.requestId,
    status: 'pending',
    reason: record.reason,
    requestedAt: record.requestedAt,
    finalizedRunCount: record.finalizedRunCount,
  }
  if (
    (await verifyPendingRequestComment({
      request: pendingRequest,
      comment: requestComment,
      channel,
    })) !== record.requestPublicationDigest
  ) {
    throw new Error('evolve completion is not bound to its durable request')
  }
  const merge = await observeOwnerApprovedMerge({
    loopRoot,
    prUrl: record.prUrl,
    expectedHeadSha: record.headSha,
    expectedHeadBranch: `codex/evolve-${record.requestId}`,
    expectedRepository: channel.repository,
    requiredBodyMarker: `<!-- issue-dev-loop:evolve-request:${record.requestId} -->`,
    createdAfter: record.requestedAt,
    githubApi,
  })
  if (merge.mergeSha !== record.mergeSha || merge.mergeAt !== record.mergeAt) {
    throw new Error('evolve completion does not match the remote owner merge')
  }
  const target = parsePullCommentUrl(commentUrl)
  const comment = await githubApi(
    `repos/${target.owner}/${target.repo}/issues/comments/${target.commentId}`,
  )
  const marker = `<!-- issue-dev-loop:evolve-completion:${record.requestId}:sha256:${digest} -->`
  if (
    !sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin) ||
    !comment.body?.includes(marker) ||
    !comment.body?.includes(serialized) ||
    Number.isNaN(Date.parse(comment.created_at)) ||
    Date.parse(comment.created_at) < Date.parse(record.mergeAt)
  ) {
    throw new Error('evolve completion lacks post-merge automation-authored durable proof')
  }
  return { record, digest, commentUrl, journaledAt: comment.created_at }
}

export async function reconcileEvolveJournal({
  loopRoot = DEFAULT_LOOP_ROOT,
  githubPaginatedApi = defaultGitHubPaginatedApi,
  githubApi = defaultGitHubApi,
} = {}) {
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const journal = stateJournalTarget(channel)
  const comments = await githubPaginatedApi(
    `repos/${journal.owner}/${journal.repo}/issues/${journal.number}/comments?per_page=100`,
  )
  const requests = new Map()
  for (const comment of comments) {
    if (!sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin)) continue
    const marker = comment.body?.match(
      /<!-- issue-dev-loop:evolve-request:([^:]+):sha256:([0-9a-f]{64}) -->/,
    )
    const serialized = comment.body?.match(/```json\s*([^\n]+)\s*```/)?.[1]
    if (!marker || !serialized) continue
    const request = JSON.parse(serialized)
    const digest = pendingRequestDigest(request)
    if (
      request.requestId !== marker[1] ||
      digest !== marker[2] ||
      (await verifyPendingRequestComment({ request, comment, channel })) !== digest
    ) {
      throw new Error(`invalid durable evolve request: ${marker[1]}`)
    }
    const existing = requests.get(request.requestId)
    if (existing) {
      if (
        existing.digest !== digest ||
        canonicalPendingRequest(existing.request) !== canonicalPendingRequest(request)
      ) {
        throw new Error(`conflicting durable evolve request: ${request.requestId}`)
      }
      existing.publicationUrls.add(comment.html_url)
      continue
    }
    requests.set(request.requestId, {
      request: {
        ...request,
        publicationUrl: comment.html_url,
        publicationDigest: digest,
      },
      digest,
      publicationUrls: new Set([comment.html_url]),
    })
  }

  const completions = new Map()
  for (const comment of comments) {
    if (!sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin)) continue
    const publication = parseCompletedEvolveComment(comment)
    if (!publication) continue
    const { record } = publication
    const requestEntry = requests.get(publication.requestId)
    if (
      !requestEntry ||
      !requestEntry.publicationUrls.has(record.requestPublicationUrl) ||
      record.requestPublicationDigest !== requestEntry.digest
    ) {
      throw new Error(`invalid durable evolve completion: ${publication.requestId}`)
    }
    const existing = completions.get(record.requestId)
    if (existing) {
      if (
        existing.digest !== publication.digest ||
        canonicalCompletedEvolve(existing.verified.record) !==
          canonicalCompletedEvolve(record)
      ) {
        throw new Error(`conflicting durable evolve completion: ${record.requestId}`)
      }
      await verifyPublishedEvolveCompletion({
        loopRoot,
        record,
        commentUrl: comment.html_url,
        githubApi,
      })
      continue
    }
    const verified = await verifyPublishedEvolveCompletion({
      loopRoot,
      record,
      commentUrl: comment.html_url,
      githubApi,
    })
    completions.set(record.requestId, { verified, digest: publication.digest })
  }

  const pending = [...requests.values()].filter(
    (entry) => !completions.has(entry.request.requestId),
  )
  if (pending.length > 1) {
    throw new Error('multiple durable pending evolve requests')
  }
  for (const entry of requests.values()) {
    const request = entry.request
    const verified = completions.get(request.requestId)?.verified
    await writeJson(
      path.join(loopRoot, 'evolve', 'requests', `${request.requestId}.json`),
      verified
        ? {
            ...request,
            status: 'completed',
            completedAt: verified.record.mergeAt,
            journaledAt: verified.journaledAt,
            summary: verified.record.summary,
            prUrl: verified.record.prUrl,
            headSha: verified.record.headSha,
            mergeSha: verified.record.mergeSha,
            mergeAt: verified.record.mergeAt,
            completionPublicationUrl: verified.commentUrl,
            completionPublicationDigest: verified.digest,
          }
        : request,
    )
  }
  const metricsPath = path.join(loopRoot, 'evolve', 'metrics.json')
  const metrics = await readJson(metricsPath)
  const orderedCompletions = [...completions.values()]
    .map((entry) => entry.verified)
    .sort(
      (left, right) => Date.parse(left.record.mergeAt) - Date.parse(right.record.mergeAt),
    )
  const latest = orderedCompletions.at(-1)
  metrics.evolveDue = pending.length === 1
  metrics.pendingRequestId = pending[0]?.request.requestId ?? null
  metrics.lastEvolvedAt = latest?.record.mergeAt ?? null
  metrics.lastEvolvedRunCount = latest?.record.finalizedRunCount ?? 0
  metrics.completedEvolveSessions = orderedCompletions.length
  await writeJson(metricsPath, metrics)
  return {
    durableEvolveRequestIds: [...requests.keys()],
    durableCompletedEvolveRequestIds: [...completions.keys()],
    pendingEvolveRequestId: pending[0]?.request.requestId ?? null,
  }
}
