import {
  assertAutomationIdentity,
  DEFAULT_LOOP_ROOT,
  defaultGitHubApi,
  defaultGitHubPaginatedApi,
  execFileAsync,
  labelNames,
  parseGitHubTarget,
  pullRequestClaimsIssue,
} from './common.mjs'

async function defaultAddLabel({ target, issueNumber }) {
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

async function defaultRemoteBranchExists({ target, issueNumber }) {
  try {
    await execFileAsync(
      'gh',
      ['api', `repos/${target.owner}/${target.repo}/git/ref/heads/codex/issue-${issueNumber}`],
      { maxBuffer: 1024 * 1024 },
    )
    return true
  } catch (error) {
    if (error?.stderr?.includes('HTTP 404')) return false
    throw error
  }
}

async function defaultRemoveLabel({ target, issueNumber }) {
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

export async function defaultClaimIssue({
  loopRoot = DEFAULT_LOOP_ROOT,
  issueUrl,
  issueNumber,
  githubApi = defaultGitHubApi,
  githubPaginatedApi = defaultGitHubPaginatedApi,
  addLabel = defaultAddLabel,
  remoteBranchExists = defaultRemoteBranchExists,
}) {
  const target = parseGitHubTarget(issueUrl)
  if (!target || target.kind !== 'issues' || target.number !== issueNumber) {
    throw new Error('issueUrl must identify the issue being claimed')
  }
  const issue = await githubApi(`repos/${target.owner}/${target.repo}/issues/${issueNumber}`)
  const labels = labelNames(issue)
  if (issue.state !== 'open' || !labels.has('codex-ready') || labels.has('loop:claimed')) {
    throw new Error('issue is no longer an open, unclaimed codex-ready issue')
  }
  if (await remoteBranchExists({ target, issueNumber })) {
    throw new Error(`remote branch codex/issue-${issueNumber} already exists`)
  }
  const pulls = await githubPaginatedApi(
    `repos/${target.owner}/${target.repo}/pulls?state=open&per_page=100`,
  )
  if (pulls.some((pullRequest) => pullRequestClaimsIssue(pullRequest, issueNumber))) {
    throw new Error(`an open pull request already claims issue ${issueNumber}`)
  }
  if (addLabel === defaultAddLabel) {
    await assertAutomationIdentity({ loopRoot, githubApi })
  }
  await addLabel({ target, issueNumber })
  return issue
}

export async function defaultReleaseIssueClaim({
  loopRoot = DEFAULT_LOOP_ROOT,
  issueUrl,
  issueNumber,
  githubApi = defaultGitHubApi,
  removeLabel = defaultRemoveLabel,
}) {
  const target = parseGitHubTarget(issueUrl)
  if (!target || target.kind !== 'issues' || target.number !== issueNumber) {
    throw new Error('issueUrl must identify the issue claim being released')
  }
  const issue = await githubApi(`repos/${target.owner}/${target.repo}/issues/${issueNumber}`)
  if (!labelNames(issue).has('loop:claimed')) return
  if (removeLabel === defaultRemoveLabel) {
    await assertAutomationIdentity({ loopRoot, githubApi })
  }
  await removeLabel({ target, issueNumber })
}
