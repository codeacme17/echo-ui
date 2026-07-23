import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  appendJsonLine,
  assertNonEmpty,
  assertRunId,
  defaultGitHubApi,
  execFileAsync,
  labelNames,
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
import { defaultReleaseIssueClaim } from './issue-claim.mjs'
import { appendValidatedEvent, finalizeRun, readEvents, readRun } from './run-store.mjs'
import { verifyLatestDurableCheckpoint } from './checkpoint-proof.mjs'

const PRIORITY = new Map([
  ['priority:critical', 0],
  ['priority:high', 1],
  ['priority:medium', 2],
  ['priority:low', 3],
])

function issuePriority(issue) {
  const labels = labelNames(issue)
  let rank = 4
  for (const [label, value] of PRIORITY) {
    if (labels.has(label)) rank = Math.min(rank, value)
  }
  return rank
}

export function selectIssue({ issues = [], pullRequests = [], branchNames = [] } = {}) {
  const branches = new Set(branchNames)
  const eligible = issues.filter((issue) => {
    const labels = labelNames(issue)
    return (
      labels.has('codex-ready') &&
      !labels.has('loop:claimed') &&
      !branches.has(`codex/issue-${issue.number}`) &&
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
  const active = await reconcileActiveJournal({
    loopRoot,
    terminalRunIds: finalization.durableRunIds,
  })
  return { ...finalization, ...active }
}

async function loadJsonFile(target) {
  return JSON.parse(await readFile(path.resolve(target), 'utf8'))
}

export async function loadPaginatedGitHubCollection(
  endpoint,
  { execute = execFileAsync } = {},
) {
  const result = await execute('gh', ['api', '--paginate', '--slurp', endpoint], {
    maxBuffer: 16 * 1024 * 1024,
  })
  const pages = JSON.parse(result.stdout)
  if (!Array.isArray(pages) || pages.some((page) => !Array.isArray(page))) {
    throw new Error('GitHub pagination did not return an array of pages')
  }
  return pages.flat()
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
      runId: resumable.record.run.runId,
      branch: resumable.record.run.branch,
      expectedHeadSha:
        resumable.record.run.headSha ??
        resumable.record.run.implementationCommit ??
        resumable.record.run.baseSha,
      issue: {
        number: resumable.record.run.issueNumber,
        title: resumable.record.run.issueTitle,
        url: resumable.record.run.issueUrl,
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
  let branchNames = []
  const configuredRepository =
    repo ??
    (await readJson(path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json')))
      .repository
  if (issuesFile) {
    issues = await loadJsonFile(issuesFile)
  } else {
    const candidates = await loadPaginatedGitHubCollection(
      `repos/${configuredRepository}/issues?state=open&labels=codex-ready&per_page=100`,
    )
    issues = candidates
      .filter((issue) => !issue.pull_request)
      .map((issue) => ({
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        labels: issue.labels,
        createdAt: issue.created_at,
      }))
  }
  if (pullRequestsFile) {
    pullRequests = await loadJsonFile(pullRequestsFile)
  } else {
    pullRequests = (
      await loadPaginatedGitHubCollection(
        `repos/${configuredRepository}/pulls?state=open&per_page=100`,
      )
    ).map((pullRequest) => ({
      number: pullRequest.number,
      title: pullRequest.title,
      url: pullRequest.html_url,
      headRefName: pullRequest.head?.ref,
      body: pullRequest.body,
    }))
  }
  if (!issuesFile && !pullRequestsFile) {
    const result = await execFileAsync(
      'git',
      ['ls-remote', '--heads', 'origin', 'refs/heads/codex/issue-*'],
      { cwd: path.resolve(loopRoot, '..', '..'), maxBuffer: 1024 * 1024 },
    )
    branchNames = result.stdout
      .split('\n')
      .filter(Boolean)
      .map((line) => line.split('\t')[1]?.replace('refs/heads/', ''))
      .filter(Boolean)
  }
  return recordTriggerCheck({
    workType: 'issue',
    ...selectIssue({ issues, pullRequests, branchNames }),
  })
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
  const publication = await recordFinalization({
    loopRoot,
    runId: normalizedRunId,
    resultPath: finalizationResultPath,
    commentUrl: finalizationCommentUrl,
    now,
    githubApi,
  })
  const merge = publication.record
  if (merge.status !== 'completed' || merge.headSha !== run.headSha || !merge.notificationUrl) {
    throw new Error('owner merge observation requires completed durable finalization proof')
  }
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const events = await readEvents(loopRoot, normalizedRunId)
  if (
    !events.some(
      (event) =>
        event.type === 'owner_notified' &&
        event.status === 'delivered' &&
        event.payload?.notificationType === 'pr_completed' &&
        event.payload?.deliveryUrl === merge.notificationUrl,
    )
  ) {
    await appendValidatedEvent({
      loopRoot,
      runId: normalizedRunId,
      type: 'owner_notified',
      status: 'delivered',
      payload: {
        notificationType: 'pr_completed',
        delivery: {
          github: 'delivered',
          githubUrl: merge.notificationUrl,
          webhook: merge.notificationWebhookStatus,
        },
        deliveryUrl: merge.notificationUrl,
        targetUrl: run.prUrl,
        evidenceUrl: run.prUrl,
        headSha: run.headSha,
      },
      now,
    })
  }
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'owner_review_approved',
    status: 'observed',
    payload: { actor: channel.ownerGitHubLogin, headSha: run.headSha, prUrl: run.prUrl },
    now,
  })
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'pr_merged',
    status: 'observed',
    payload: {
      actor: channel.ownerGitHubLogin,
      headSha: run.headSha,
      mergeSha: merge.mergeSha,
      prUrl: run.prUrl,
    },
    now,
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
  checkpointVerifier = verifyLatestDurableCheckpoint,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (!['waiting_for_owner', 'awaiting_owner_review'].includes(run.status)) {
    throw new Error('owner response can only resume a paused run')
  }
  const events = await readEvents(loopRoot, normalizedRunId)
  await checkpointVerifier({
    loopRoot,
    runId: normalizedRunId,
    events,
    operation: 'record-owner-response',
    githubApi,
  })
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
    (reviewTarget && response.commit_id !== run.headSha) ||
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
