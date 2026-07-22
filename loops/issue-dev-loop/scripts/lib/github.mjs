import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  assertRunId,
  defaultGitHubApi,
  execFileAsync,
  parseGitHubTarget,
  readJson,
  sameGitHubLogin,
} from './common.mjs'
import { appendValidatedEvent, finalizeRun, readRun } from './run-store.mjs'

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

function pullRequestClaimsIssue(pullRequest, issueNumber) {
  if (pullRequest.headRefName === `codex/issue-${issueNumber}`) return true
  const searchable = `${pullRequest.title ?? ''}\n${pullRequest.body ?? ''}`
  return new RegExp(
    `(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)?\\s*#${issueNumber}(?!\\d)`,
    'i',
  ).test(searchable)
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

async function loadJsonFile(target) {
  return JSON.parse(await readFile(path.resolve(target), 'utf8'))
}

export async function detectWork({ issuesFile, pullRequestsFile, repo } = {}) {
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
  return selectIssue({ issues, pullRequests })
}

export async function observeOwnerMerge({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  now = new Date(),
  githubApi = defaultGitHubApi,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (run.status !== 'awaiting_owner_review' || !run.prUrl || !run.headSha) {
    throw new Error('owner merge observation requires an awaiting_owner_review run')
  }
  const target = parseGitHubTarget(run.prUrl)
  if (!target || target.kind !== 'pull') throw new Error('run.prUrl must be a GitHub pull request')
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const [pullRequest, reviews] = await Promise.all([
    githubApi(`repos/${target.owner}/${target.repo}/pulls/${target.number}`),
    githubApi(`repos/${target.owner}/${target.repo}/pulls/${target.number}/reviews?per_page=100`),
  ])
  if (
    pullRequest.merged !== true ||
    !sameGitHubLogin(pullRequest.merged_by?.login, channel.ownerGitHubLogin) ||
    pullRequest.head?.sha !== run.headSha ||
    !pullRequest.merge_commit_sha
  ) {
    throw new Error('pull request is not merged by the configured owner at the reviewed headSha')
  }
  const ownerApproval = reviews.some(
    (review) =>
      sameGitHubLogin(review.user?.login, channel.ownerGitHubLogin) &&
      review.state === 'APPROVED' &&
      review.commit_id === run.headSha,
  )
  if (!ownerApproval) throw new Error('configured owner has not approved the reviewed headSha')

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
      mergeSha: pullRequest.merge_commit_sha,
      prUrl: run.prUrl,
    },
    now,
  })
  return finalizeRun({
    loopRoot,
    runId: normalizedRunId,
    status: 'completed',
    mergeSha: pullRequest.merge_commit_sha,
    now,
  })
}
