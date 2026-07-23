import path from 'node:path'

import { defaultGitHubApi, parseGitHubTarget, readJson, sameGitHubLogin } from './common.mjs'

async function paginateGitHubApi(githubApi, endpoint) {
  const records = []
  for (let page = 1; ; page += 1) {
    const separator = endpoint.includes('?') ? '&' : '?'
    const batch = await githubApi(`${endpoint}${separator}per_page=100&page=${page}`)
    if (!Array.isArray(batch)) throw new Error('GitHub paginated response must be an array')
    records.push(...batch)
    if (batch.length < 100) return records
  }
}

export async function observeOwnerApprovedMerge({
  loopRoot,
  prUrl,
  expectedHeadSha = null,
  expectedHeadBranch,
  expectedRepository,
  expectedBaseBranch = 'dev',
  requiredBodyMarker = null,
  createdAfter = null,
  readyAfter = null,
  githubApi = defaultGitHubApi,
}) {
  const target = parseGitHubTarget(prUrl)
  if (!target || target.kind !== 'pull') throw new Error('prUrl must be a GitHub pull request')
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const [pullRequest, reviews, timeline] = await Promise.all([
    githubApi(`repos/${target.owner}/${target.repo}/pulls/${target.number}`),
    paginateGitHubApi(
      githubApi,
      `repos/${target.owner}/${target.repo}/pulls/${target.number}/reviews`,
    ),
    paginateGitHubApi(
      githubApi,
      `repos/${target.owner}/${target.repo}/issues/${target.number}/timeline`,
    ),
  ])
  const headSha = pullRequest.head?.sha
  const configuredRepository = expectedRepository ?? channel.repository
  const ownerApproval = reviews.some(
    (review) =>
      sameGitHubLogin(review.user?.login, channel.ownerGitHubLogin) &&
      review.state === 'APPROVED' &&
      review.commit_id === headSha,
  )
  const readinessTransitions = timeline.filter((event) =>
    ['ready_for_review', 'convert_to_draft'].includes(event.event),
  )
  const latestReadinessTransition = readinessTransitions.at(-1)
  const ownerReady =
    latestReadinessTransition?.event === 'ready_for_review' &&
    sameGitHubLogin(latestReadinessTransition.actor?.login, channel.ownerGitHubLogin) &&
    !Number.isNaN(Date.parse(latestReadinessTransition.created_at)) &&
    (!readyAfter ||
      Date.parse(latestReadinessTransition.created_at) >= Date.parse(readyAfter))
  if (
    pullRequest.merged !== true ||
    `${target.owner}/${target.repo}`.toLowerCase() !== configuredRepository.toLowerCase() ||
    pullRequest.base?.ref !== expectedBaseBranch ||
    pullRequest.base?.repo?.full_name?.toLowerCase() !== configuredRepository.toLowerCase() ||
    (expectedHeadBranch && pullRequest.head?.ref !== expectedHeadBranch) ||
    pullRequest.head?.repo?.full_name?.toLowerCase() !== configuredRepository.toLowerCase() ||
    (requiredBodyMarker && !pullRequest.body?.includes(requiredBodyMarker)) ||
    (createdAfter && Date.parse(pullRequest.created_at) < Date.parse(createdAfter)) ||
    !sameGitHubLogin(pullRequest.merged_by?.login, channel.ownerGitHubLogin) ||
    !/^[0-9a-f]{40}$/i.test(pullRequest.merge_commit_sha ?? '') ||
    !ownerReady ||
    !ownerApproval ||
    (expectedHeadSha !== null && headSha !== expectedHeadSha)
  ) {
    throw new Error(
      'PR is not approved and merged by the configured owner at the expected headSha with an owner-authored Ready transition',
    )
  }
  return {
    owner: channel.ownerGitHubLogin,
    headSha,
    mergeSha: pullRequest.merge_commit_sha,
    prUrl,
  }
}
