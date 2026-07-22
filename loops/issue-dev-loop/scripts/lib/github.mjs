import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  appendJsonLine,
  assertNonEmpty,
  assertRunId,
  defaultGitHubApi,
  execFileAsync,
  parseGitHubTarget,
  parsePullCommentUrl,
  parseReviewUrl,
  pullRequestClaimsIssue,
  readJson,
  sameGitHubLogin,
  sameRepository,
} from './common.mjs'
import {
  reconcileFinalizationJournal,
  recordFinalizationPublication,
} from './finalization-journal.mjs'
import { reconcileActiveJournal } from './active-journal.mjs'
import { observeOwnerApprovedMerge } from './owner-gate.mjs'
import { defaultReleaseIssueClaim } from './issue-claim.mjs'
import { appendValidatedEvent, finalizeRun, readEvents, readRun } from './run-store.mjs'

const PRIORITY = new Map([
  ['priority:critical', 0],
  ['priority:high', 1],
  ['priority:medium', 2],
  ['priority:low', 3],
])

function labelNames(issue) {
  return new Set(
    (issue.labels ?? []).map((label) => (typeof label === 'string' ? label : label.name)),
  )
}

function issuePriority(issue) {
  const labels = labelNames(issue)
  let rank = 4
  for (const [label, value] of PRIORITY) {
    if (labels.has(label)) rank = Math.min(rank, value)
  }
  return rank
}

export function selectIssue({ issues = [], pullRequests = [] } = {}) {
  const eligible = issues.filter((issue) => {
    const labels = labelNames(issue)
    return (
      labels.has('codex-ready') &&
      !labels.has('loop:claimed') &&
      !pullRequests.some((pullRequest) => pullRequestClaimsIssue(pullRequest, issue.number))
    )
  })
  eligible.sort((left, right) => {
    const priorityDifference = issuePriority(left) - issuePriority(right)
    if (priorityDifference !== 0) return priorityDifference
    const leftCreated = Date.parse(left.createdAt ?? 0)
    const rightCreated = Date.parse(right.createdAt ?? 0)
    if (leftCreated !== rightCreated) return leftCreated - rightCreated
    return left.number - right.number
  })
  const issue = eligible[0]
  return issue ? { hasWork: true, issue } : { hasWork: false, issue: null }
}

export async function reconcileLoopJournal({
  loopRoot = DEFAULT_LOOP_ROOT,
  now = new Date(),
} = {}) {
  const finalization = await reconcileFinalizationJournal({ loopRoot, now })
  const active = await reconcileActiveJournal({ loopRoot })
  return { ...finalization, ...active }
}

async function loadJsonFile(target) {
  return JSON.parse(await readFile(path.resolve(target), 'utf8'))
}

export async function detectWork({
  loopRoot = DEFAULT_LOOP_ROOT,
  issuesFile,
  pullRequestsFile,
  repo,
  now = new Date(),
  reconcileJournal = reconcileLoopJournal,
} = {}) {
  const recordTriggerCheck = async (result) => {
    await appendJsonLine(path.join(loopRoot, 'logs', 'triggers.jsonl'), {
      schemaVersion: 1,
      event: 'trigger_checked',
      timestamp: now.toISOString(),
      hasWork: result.hasWork,
      workType: result.workType,
      runId: result.runId ?? null,
      issueNumber: result.issue?.number ?? null,
      requestId: result.requestId ?? null,
    })
    return result
  }
  const reconciliation =
    !issuesFile && !pullRequestsFile ? await reconcileJournal({ loopRoot, now }) : null
  const resumable = reconciliation?.activeCheckpoints?.[0]
  if (resumable) {
    return recordTriggerCheck({
      hasWork: true,
      workType: 'resume',
      runId: resumable.run.runId,
      issue: {
        number: resumable.run.issueNumber,
        title: resumable.run.issueTitle,
        url: resumable.run.issueUrl,
      },
    })
  }
  const evolve = await readJson(path.join(loopRoot, 'evolve', 'metrics.json'))
  if (evolve.evolveDue) {
    return recordTriggerCheck({
      hasWork: true,
      workType: 'evolve',
      requestId: evolve.pendingRequestId,
      issue: null,
    })
  }
  let issues
  let pullRequests
  if (issuesFile) {
    issues = await loadJsonFile(issuesFile)
  } else {
    const argumentsList = [
      'issue',
      'list',
      '--state',
      'open',
      '--label',
      'codex-ready',
      '--limit',
      '100',
      '--json',
      'number,title,url,labels,createdAt',
    ]
    if (repo) argumentsList.push('--repo', repo)
    const result = await execFileAsync('gh', argumentsList, { maxBuffer: 1024 * 1024 })
    issues = JSON.parse(result.stdout)
  }
  if (pullRequestsFile) {
    pullRequests = await loadJsonFile(pullRequestsFile)
  } else {
    const argumentsList = [
      'pr',
      'list',
      '--state',
      'open',
      '--limit',
      '100',
      '--json',
      'number,title,url,headRefName,body',
    ]
    if (repo) argumentsList.push('--repo', repo)
    const result = await execFileAsync('gh', argumentsList, { maxBuffer: 1024 * 1024 })
    pullRequests = JSON.parse(result.stdout)
  }
  return recordTriggerCheck({ workType: 'issue', ...selectIssue({ issues, pullRequests }) })
}

export async function observeOwnerMerge({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  now = new Date(),
  githubApi = defaultGitHubApi,
  releaseIssueClaim = defaultReleaseIssueClaim,
  finalizationResultPath,
  finalizationCommentUrl,
  recordFinalization = recordFinalizationPublication,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (run.status !== 'awaiting_owner_review' || !run.prUrl || !run.headSha) {
    throw new Error('owner merge observation requires an awaiting_owner_review run')
  }
  const merge = await observeOwnerApprovedMerge({
    loopRoot,
    prUrl: run.prUrl,
    expectedHeadSha: run.headSha,
    expectedHeadBranch: run.branch,
    githubApi,
  })
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'owner_review_approved',
    status: 'observed',
    payload: { actor: merge.owner, headSha: run.headSha, prUrl: run.prUrl },
    now,
  })
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'pr_merged',
    status: 'observed',
    payload: {
      actor: merge.owner,
      headSha: run.headSha,
      mergeSha: merge.mergeSha,
      prUrl: run.prUrl,
    },
    now,
  })
  await recordFinalization({
    loopRoot,
    runId: normalizedRunId,
    resultPath: finalizationResultPath,
    commentUrl: finalizationCommentUrl,
    now,
    githubApi,
  })
  return finalizeRun({
    loopRoot,
    runId: normalizedRunId,
    status: 'completed',
    mergeSha: merge.mergeSha,
    now,
    githubApi,
    releaseIssueClaim,
  })
}

export async function recordOwnerResponse({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  responseUrl,
  now = new Date(),
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (!['waiting_for_owner', 'awaiting_owner_review'].includes(run.status)) {
    throw new Error('owner response can only resume a paused run')
  }
  const publishedUrl = assertNonEmpty(responseUrl, 'responseUrl')
  const issueTarget = parseGitHubTarget(run.issueUrl)
  const pullTarget = parseGitHubTarget(run.prUrl)
  const reviewTarget = parseReviewUrl(publishedUrl)
  const commentTarget = parsePullCommentUrl(publishedUrl)
  let response
  let targetUrl
  if (reviewTarget) {
    if (
      !pullTarget ||
      !sameRepository(reviewTarget, pullTarget) ||
      reviewTarget.number !== pullTarget.number
    ) {
      throw new Error('owner review response must be on the recorded PR')
    }
    response = await githubApi(
      `repos/${reviewTarget.owner}/${reviewTarget.repo}/pulls/${reviewTarget.number}/reviews/${reviewTarget.reviewId}`,
    )
    if (!['CHANGES_REQUESTED', 'COMMENTED'].includes(response.state)) {
      throw new Error('owner review response must request changes or provide a comment')
    }
    targetUrl = run.prUrl
  } else if (commentTarget) {
    const expectedTarget = commentTarget.surface === 'pull' ? pullTarget : issueTarget
    if (
      !expectedTarget ||
      !sameRepository(commentTarget, expectedTarget) ||
      commentTarget.number !== expectedTarget.number
    ) {
      throw new Error('owner comment response is not on the paused run target')
    }
    const endpoint =
      commentTarget.kind === 'review_comment'
        ? `repos/${commentTarget.owner}/${commentTarget.repo}/pulls/comments/${commentTarget.commentId}`
        : `repos/${commentTarget.owner}/${commentTarget.repo}/issues/comments/${commentTarget.commentId}`
    response = await githubApi(endpoint)
    targetUrl =
      commentTarget.surface === 'pull'
        ? run.prUrl
        : `https://github.com/${issueTarget.owner}/${issueTarget.repo}/issues/${issueTarget.number}`
  } else {
    throw new Error('responseUrl must identify a GitHub owner comment or review')
  }
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const events = await readEvents(loopRoot, normalizedRunId)
  const pauseEvent = events.findLast(
    (event) => event.type === 'run_status_changed' && event.status === run.status,
  )
  const deliveredNotification = events.findLast((event) => {
    if (
      event.type !== 'owner_notified' ||
      event.status !== 'delivered' ||
      event.payload?.delivery?.github !== 'delivered'
    ) {
      return false
    }
    if (!pauseEvent) return false
    if (run.status === 'waiting_for_owner') {
      return Date.parse(event.timestamp) >= Date.parse(pauseEvent.timestamp)
    }
    return (
      ['pr_ready_for_review', 'pr_updated_for_review'].includes(event.payload?.notificationType) &&
      event.payload?.targetUrl === run.prUrl &&
      Date.parse(event.timestamp) <= Date.parse(pauseEvent.timestamp)
    )
  })
  const responseTimestamp = response.submitted_at ?? response.created_at
  const responseTime = Date.parse(responseTimestamp)
  const explicitResumeToken = `RESUME ${normalizedRunId}`
  const reviewRequestsChanges = reviewTarget && response.state === 'CHANGES_REQUESTED'
  if (
    !deliveredNotification ||
    deliveredNotification.payload?.targetUrl !== targetUrl ||
    !sameGitHubLogin(response.user?.login, channel.ownerGitHubLogin) ||
    !response.body?.trim() ||
    Number.isNaN(responseTime) ||
    (!reviewRequestsChanges && !response.body.includes(explicitResumeToken)) ||
    (pauseEvent && responseTime < Date.parse(pauseEvent.timestamp)) ||
    responseTime < Date.parse(deliveredNotification.timestamp)
  ) {
    throw new Error(
      'response is not a current, run-bound decision from the configured owner after successful delivery',
    )
  }
  return appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'owner_response_observed',
    status: 'observed',
    payload: {
      actor: channel.ownerGitHubLogin,
      responseUrl: publishedUrl,
      targetUrl,
      responseState: response.state ?? 'COMMENTED',
      notificationId: deliveredNotification.payload.notificationId,
    },
    now,
  })
}
