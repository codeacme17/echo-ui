import { execFile } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { appendFile, mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

export const execFileAsync = promisify(execFile)
const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))
export const DEFAULT_LOOP_ROOT = path.resolve(moduleDirectory, '..', '..')

export function assertNonEmpty(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${name} must be a non-empty string`)
  }
  return value.trim()
}

export function assertIssueNumber(value) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1)
    throw new Error('issueNumber must be a positive integer')
  return parsed
}

export function assertRunId(runId) {
  const normalized = assertNonEmpty(runId, 'runId')
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(normalized)) {
    throw new Error('runId contains unsafe characters')
  }
  return normalized
}

export function timestampToken(now) {
  return now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
}

export function parseArguments(argv) {
  const values = { _: [] }
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) {
      values._.push(token)
      continue
    }
    const key = token.slice(2)
    const next = argv[index + 1]
    if (next === undefined || next.startsWith('--')) {
      values[key] = true
      continue
    }
    values[key] = next
    index += 1
  }
  return values
}

export async function pathExists(target) {
  try {
    await stat(target)
    return true
  } catch (error) {
    if (error?.code === 'ENOENT') return false
    throw error
  }
}

export async function readJson(target) {
  return JSON.parse(await readFile(target, 'utf8'))
}

export async function writeJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true })
  const temporary = `${target}.tmp-${process.pid}-${randomBytes(3).toString('hex')}`
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  await rename(temporary, target)
}

export async function appendJsonLine(target, value) {
  await mkdir(path.dirname(target), { recursive: true })
  await appendFile(target, `${JSON.stringify(value)}\n`, 'utf8')
}

export function runDirectory(loopRoot, runId) {
  return path.join(loopRoot, 'logs', 'runs', assertRunId(runId))
}

export function replaceTemplate(template, replacements) {
  let output = template
  for (const [key, value] of Object.entries(replacements)) {
    output = output.replaceAll(`{{${key}}}`, String(value ?? ''))
  }
  return output
}

export function assertArray(value, name) {
  if (!Array.isArray(value)) throw new Error(`${name} must be an array`)
  return value
}

export function assertHttpUrl(value, name) {
  const normalized = assertNonEmpty(value, name)
  const parsed = new URL(normalized)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`${name} must use http or https`)
  }
  return normalized
}

export function sameRepository(left, right) {
  return (
    left?.owner?.toLowerCase() === right?.owner?.toLowerCase() &&
    left?.repo?.toLowerCase() === right?.repo?.toLowerCase()
  )
}

export function sameGitHubLogin(left, right) {
  return (
    typeof left === 'string' &&
    typeof right === 'string' &&
    left.toLowerCase() === right.toLowerCase()
  )
}

export function labelNames(issue) {
  return new Set((issue.labels ?? []).map((label) => label.name ?? label))
}

export async function assertAutomationIdentity({ loopRoot, githubApi = defaultGitHubApi }) {
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const automation = assertNonEmpty(channel.automationGitHubLogin, 'channel.automationGitHubLogin')
  const reviewer = assertNonEmpty(channel.reviewerGitHubLogin, 'channel.reviewerGitHubLogin')
  if (
    sameGitHubLogin(automation, channel.ownerGitHubLogin) ||
    sameGitHubLogin(reviewer, channel.ownerGitHubLogin) ||
    sameGitHubLogin(automation, reviewer)
  ) {
    throw new Error('owner, automation, and reviewer GitHub identities must be distinct')
  }
  const actor = await githubApi('user')
  if (!sameGitHubLogin(actor.login, automation)) {
    throw new Error(`GitHub mutation requires configured automation identity ${automation}`)
  }
  return actor.login
}

export function pullRequestClaimsIssue(pullRequest, issueNumber) {
  const headRef = pullRequest.headRefName ?? pullRequest.head?.ref
  if (headRef === `codex/issue-${issueNumber}`) return true
  const searchable = `${pullRequest.title ?? ''}\n${pullRequest.body ?? ''}`
  return new RegExp(
    `(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)?\\s*#${issueNumber}(?!\\d)`,
    'i',
  ).test(searchable)
}

export function parseGitHubTarget(targetUrl) {
  if (!targetUrl) return null
  const parsed = new URL(targetUrl)
  if (parsed.hostname !== 'github.com') return null
  const match = parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)\/?$/)
  if (!match) return null
  return { owner: match[1], repo: match[2], kind: match[3], number: Number(match[4]) }
}

export function parseArtifactUrl(value) {
  const parsed = new URL(value)
  const match = parsed.pathname.match(
    /^\/([^/]+)\/([^/]+)\/actions\/runs\/(\d+)\/artifacts\/(\d+)\/?$/,
  )
  return parsed.hostname === 'github.com' && match
    ? { owner: match[1], repo: match[2], runId: match[3], artifactId: match[4] }
    : null
}

export function parseReviewUrl(value) {
  const parsed = new URL(value)
  const match = parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)\/?$/)
  const reviewMatch = parsed.hash.match(/^#pullrequestreview-(\d+)$/)
  return parsed.hostname === 'github.com' && match && reviewMatch
    ? { owner: match[1], repo: match[2], number: Number(match[3]), reviewId: reviewMatch[1] }
    : null
}

export function parsePullCommentUrl(value) {
  const parsed = new URL(value)
  const match = parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/(pull|issues)\/(\d+)\/?$/)
  const reviewComment = parsed.hash.match(/^#discussion_r(\d+)$/)
  const issueComment = parsed.hash.match(/^#issuecomment-(\d+)$/)
  if (parsed.hostname !== 'github.com' || !match || (!reviewComment && !issueComment)) return null
  return {
    owner: match[1],
    repo: match[2],
    surface: match[3],
    number: Number(match[4]),
    kind: reviewComment ? 'review_comment' : 'issue_comment',
    commentId: (reviewComment ?? issueComment)[1],
  }
}

export async function defaultGitHubApi(endpoint) {
  const result = await execFileAsync('gh', ['api', endpoint], { maxBuffer: 1024 * 1024 })
  return JSON.parse(result.stdout)
}

export async function postGitHubIssueComment(target, body) {
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

export async function paginateGitHubApi(
  githubApi,
  endpoint,
  { maxPages = 100 } = {},
) {
  if (!Number.isInteger(maxPages) || maxPages < 1) {
    throw new Error('GitHub pagination requires a positive page limit')
  }
  const separator = endpoint.includes('?') ? '&' : '?'
  const records = []
  for (let page = 1; page <= maxPages; page += 1) {
    const batch = await githubApi(`${endpoint}${separator}per_page=100&page=${page}`)
    if (!Array.isArray(batch)) {
      throw new Error('GitHub paginated response must be an array')
    }
    records.push(...batch)
    if (batch.length < 100) return records
  }
  throw new Error(`GitHub pagination exceeded the ${maxPages}-page safety limit`)
}

export async function defaultGitHubPaginatedApi(endpoint) {
  const result = await execFileAsync('gh', ['api', '--paginate', '--slurp', endpoint], {
    maxBuffer: 8 * 1024 * 1024,
  })
  const pages = JSON.parse(result.stdout)
  return pages.flat()
}
