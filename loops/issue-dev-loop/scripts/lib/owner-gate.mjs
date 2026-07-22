import path from 'node:path'

import { defaultGitHubApi, parseGitHubTarget, readJson, sameGitHubLogin } from './common.mjs'

export async function observeOwnerApprovedMerge({
  loopRoot,
  prUrl,
  expectedHeadSha = null,
  githubApi = defaultGitHubApi,
}) {
  const target = parseGitHubTarget(prUrl)
  if (!target || target.kind !== 'pull') throw new Error('prUrl must be a GitHub pull request')
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const [pullRequest, reviews] = await Promise.all([
    githubApi(`repos/${target.owner}/${target.repo}/pulls/${target.number}`),
    githubApi(`repos/${target.owner}/${target.repo}/pulls/${target.number}/reviews?per_page=100`),
  ])
  const headSha = pullRequest.head?.sha
  const ownerApproval = reviews.some(
    (review) =>
      sameGitHubLogin(review.user?.login, channel.ownerGitHubLogin) &&
      review.state === 'APPROVED' &&
      review.commit_id === headSha,
  )
  if (
    pullRequest.merged !== true ||
    !sameGitHubLogin(pullRequest.merged_by?.login, channel.ownerGitHubLogin) ||
    !pullRequest.merge_commit_sha ||
    !ownerApproval ||
    (expectedHeadSha !== null && headSha !== expectedHeadSha)
  ) {
    throw new Error('PR is not approved and merged by the configured owner at the expected headSha')
  }
  return {
    owner: channel.ownerGitHubLogin,
    headSha,
    mergeSha: pullRequest.merge_commit_sha,
    prUrl,
  }
}
