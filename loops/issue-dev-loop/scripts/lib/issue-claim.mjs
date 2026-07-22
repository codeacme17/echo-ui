import { defaultGitHubApi, execFileAsync, parseGitHubTarget } from './common.mjs'

function labelNames(issue) {
  return new Set((issue.labels ?? []).map((label) => label.name ?? label))
}

export async function defaultClaimIssue({ issueUrl, issueNumber, branch, githubApi }) {
  const target = parseGitHubTarget(issueUrl)
  if (!target || target.kind !== 'issues' || target.number !== issueNumber) {
    throw new Error('issueUrl must identify the issue being claimed')
  }
  const issue = await githubApi(`repos/${target.owner}/${target.repo}/issues/${issueNumber}`)
  const labels = labelNames(issue)
  if (issue.state !== 'open' || !labels.has('codex-ready') || labels.has('loop:claimed')) {
    throw new Error('issue is no longer an open, unclaimed codex-ready issue')
  }
  const pulls = await githubApi(
    `repos/${target.owner}/${target.repo}/pulls?state=open&per_page=100`,
  )
  if (pulls.some((pullRequest) => pullRequest.head?.ref === branch)) {
    throw new Error(`an open pull request already claims ${branch}`)
  }
  await execFileAsync(
    'gh',
    [
      'api',
      `repos/${target.owner}/${target.repo}/issues/${issueNumber}/labels`,
      '--method',
      'POST',
      '-f',
      'labels[]=loop:claimed',
    ],
    { maxBuffer: 1024 * 1024 },
  )
}

export async function defaultReleaseIssueClaim({
  issueUrl,
  issueNumber,
  githubApi = defaultGitHubApi,
}) {
  const target = parseGitHubTarget(issueUrl)
  if (!target || target.kind !== 'issues' || target.number !== issueNumber) {
    throw new Error('issueUrl must identify the issue claim being released')
  }
  const issue = await githubApi(`repos/${target.owner}/${target.repo}/issues/${issueNumber}`)
  if (!labelNames(issue).has('loop:claimed')) return
  await execFileAsync(
    'gh',
    [
      'api',
      `repos/${target.owner}/${target.repo}/issues/${issueNumber}/labels/loop%3Aclaimed`,
      '--method',
      'DELETE',
    ],
    { maxBuffer: 1024 * 1024 },
  )
}
