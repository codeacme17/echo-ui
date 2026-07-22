import { execFile } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { appendFile, mkdir, readFile, readdir, rename, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))

export const DEFAULT_LOOP_ROOT = path.resolve(moduleDirectory, '..')

const PAUSED_STATUSES = new Set(['awaiting_owner_review', 'waiting_for_owner'])

const TERMINAL_STATUSES = new Set(['completed', 'failed', 'blocked', 'cancelled'])

const RUN_STATUSES = new Set(['running', ...PAUSED_STATUSES, ...TERMINAL_STATUSES])

const PRIORITY = new Map([
  ['priority:critical', 0],
  ['priority:high', 1],
  ['priority:medium', 2],
  ['priority:low', 3],
])

function assertNonEmpty(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${name} must be a non-empty string`)
  }
  return value.trim()
}

function assertIssueNumber(value) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error('issueNumber must be a positive integer')
  }
  return parsed
}

function assertRunId(runId) {
  const normalized = assertNonEmpty(runId, 'runId')
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(normalized)) {
    throw new Error('runId contains unsafe characters')
  }
  return normalized
}

function timestampToken(now) {
  return now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
}

export function makeRunId({ issueNumber, now = new Date(), entropy } = {}) {
  const issue = assertIssueNumber(issueNumber)
  const suffix = entropy ?? randomBytes(3).toString('hex')
  if (!/^[A-Za-z0-9]+$/.test(suffix)) {
    throw new Error('entropy must be alphanumeric')
  }
  return `${timestampToken(now)}-issue-${issue}-${suffix.toLowerCase()}`
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

async function pathExists(target) {
  try {
    await stat(target)
    return true
  } catch (error) {
    if (error?.code === 'ENOENT') return false
    throw error
  }
}

async function readJson(target) {
  return JSON.parse(await readFile(target, 'utf8'))
}

async function writeJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true })
  const temporary = `${target}.tmp-${process.pid}-${randomBytes(3).toString('hex')}`
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  await rename(temporary, target)
}

async function appendJsonLine(target, value) {
  await mkdir(path.dirname(target), { recursive: true })
  await appendFile(target, `${JSON.stringify(value)}\n`, 'utf8')
}

function runDirectory(loopRoot, runId) {
  return path.join(loopRoot, 'logs', 'runs', assertRunId(runId))
}

function replaceTemplate(template, replacements) {
  let output = template
  for (const [key, value] of Object.entries(replacements)) {
    output = output.replaceAll(`{{${key}}}`, String(value ?? ''))
  }
  return output
}

export async function startRun({
  loopRoot = DEFAULT_LOOP_ROOT,
  issueNumber,
  issueTitle,
  issueUrl,
  now = new Date(),
  entropy,
} = {}) {
  const issue = assertIssueNumber(issueNumber)
  const title = assertNonEmpty(issueTitle, 'issueTitle')
  const url = assertNonEmpty(issueUrl, 'issueUrl')
  const runId = makeRunId({ issueNumber: issue, now, entropy })
  const runPath = runDirectory(loopRoot, runId)

  if (await pathExists(runPath)) {
    throw new Error(`run already exists: ${runId}`)
  }

  const directories = [
    runPath,
    path.join(loopRoot, 'handoffs', runId),
    path.join(loopRoot, 'screenshots', runId, 'before'),
    path.join(loopRoot, 'screenshots', runId, 'after'),
    path.join(loopRoot, 'evidence', runId, 'test-results'),
  ]
  await Promise.all(directories.map((directory) => mkdir(directory, { recursive: true })))

  const run = {
    schemaVersion: 1,
    runId,
    issueNumber: issue,
    issueTitle: title,
    issueUrl: url,
    baseBranch: 'dev',
    branch: `codex/issue-${issue}`,
    status: 'running',
    startedAt: now.toISOString(),
    finishedAt: null,
    prUrl: null,
    headSha: null,
    mergeSha: null,
  }

  await writeJson(path.join(runPath, 'run.json'), run)
  await appendEvent({
    loopRoot,
    runId,
    type: 'loop_started',
    status: 'running',
    payload: { issueNumber: issue, branch: run.branch },
    now,
  })

  const templatePath = path.join(loopRoot, 'templates', 'implementation-brief.md')
  const template = await readFile(templatePath, 'utf8')
  const brief = replaceTemplate(template, {
    RUN_ID: runId,
    ISSUE_NUMBER: issue,
    ISSUE_TITLE: title,
    ISSUE_URL: url,
  })
  const briefPath = path.join(loopRoot, 'handoffs', runId, 'implementation-brief.md')
  await writeFile(briefPath, brief, 'utf8')

  return { run, briefPath, runPath }
}

export async function appendEvent({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  type,
  status = null,
  payload = {},
  now = new Date(),
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const eventType = assertNonEmpty(type, 'type')
  const runPath = runDirectory(loopRoot, normalizedRunId)
  if (!(await pathExists(path.join(runPath, 'run.json')))) {
    throw new Error(`unknown run: ${normalizedRunId}`)
  }
  if (payload === null || Array.isArray(payload) || typeof payload !== 'object') {
    throw new Error('payload must be an object')
  }

  const event = {
    schemaVersion: 1,
    runId: normalizedRunId,
    type: eventType,
    timestamp: now.toISOString(),
    status,
    payload,
  }
  await appendJsonLine(path.join(runPath, 'events.jsonl'), event)
  return event
}

async function readEvents(loopRoot, runId) {
  const target = path.join(runDirectory(loopRoot, runId), 'events.jsonl')
  const contents = await readFile(target, 'utf8')
  return contents
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

function hasPassedEvent(events, type) {
  return events.some(
    (event) =>
      event.type === type &&
      (event.status === 'passed' ||
        event.payload?.verdict === 'passed' ||
        event.payload?.verdict === 'PASS'),
  )
}

export async function transitionRun({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  status,
  prUrl = null,
  headSha = null,
  mergeSha = null,
  now = new Date(),
} = {}) {
  const normalizedRunId = assertRunId(runId)
  if (!RUN_STATUSES.has(status)) {
    throw new Error(`invalid run status: ${status}`)
  }

  const runPath = runDirectory(loopRoot, normalizedRunId)
  const runFile = path.join(runPath, 'run.json')
  const run = await readJson(runFile)
  if (run.finishedAt !== null) {
    throw new Error(`run is already finalized: ${normalizedRunId}`)
  }
  if (run.status === status) {
    throw new Error(`run already has status: ${status}`)
  }
  const events = await readEvents(loopRoot, normalizedRunId)

  if (status === 'awaiting_owner_review') {
    if (!prUrl || !headSha) {
      throw new Error('awaiting_owner_review requires prUrl and headSha')
    }
    if (!hasPassedEvent(events, 'verification_completed')) {
      throw new Error('awaiting_owner_review requires passed verification_completed')
    }
    if (!hasPassedEvent(events, 'review_completed')) {
      throw new Error('awaiting_owner_review requires passed review_completed')
    }
  }

  if (status === 'completed') {
    if (!mergeSha || !events.some((event) => event.type === 'pr_merged')) {
      throw new Error('completed requires an observed pr_merged event and mergeSha')
    }
  }

  const transitioned = {
    ...run,
    status,
    finishedAt: TERMINAL_STATUSES.has(status) ? now.toISOString() : null,
    prUrl: prUrl ?? run.prUrl,
    headSha: headSha ?? run.headSha,
    mergeSha: mergeSha ?? run.mergeSha,
  }
  await writeJson(runFile, transitioned)

  await appendEvent({
    loopRoot,
    runId: normalizedRunId,
    type: TERMINAL_STATUSES.has(status) ? 'run_finalized' : 'run_status_changed',
    status,
    payload: { previousStatus: run.status },
    now,
  })

  if (!TERMINAL_STATUSES.has(status)) {
    return transitioned
  }

  const summaryTemplate = await readFile(path.join(loopRoot, 'templates', 'run-summary.md'), 'utf8')
  const summary = replaceTemplate(summaryTemplate, {
    RUN_ID: normalizedRunId,
    ISSUE_NUMBER: run.issueNumber,
    STATUS: status,
    STARTED_AT: run.startedAt,
    FINISHED_AT: transitioned.finishedAt,
    PR_URL: transitioned.prUrl ?? 'N/A',
    HEAD_SHA: transitioned.headSha ?? 'N/A',
    MERGE_SHA: transitioned.mergeSha ?? 'N/A',
  })
  await writeFile(path.join(runPath, 'summary.md'), summary, 'utf8')

  await appendJsonLine(path.join(loopRoot, 'logs', 'index.jsonl'), {
    schemaVersion: 1,
    event: 'run_finalized',
    runId: normalizedRunId,
    issueNumber: run.issueNumber,
    status,
    startedAt: run.startedAt,
    finishedAt: transitioned.finishedAt,
    prUrl: transitioned.prUrl,
    headSha: transitioned.headSha,
    mergeSha: transitioned.mergeSha,
  })

  return transitioned
}

export async function finalizeRun(options = {}) {
  if (!TERMINAL_STATUSES.has(options.status)) {
    throw new Error(`invalid final status: ${options.status}`)
  }
  return transitionRun(options)
}

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

function parseGitHubTarget(targetUrl) {
  if (!targetUrl) return null
  const parsed = new URL(targetUrl)
  if (parsed.hostname !== 'github.com') return null
  const match = parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/(?:issues|pull)\/(\d+)\/?$/)
  if (!match) return null
  return { owner: match[1], repo: match[2], number: Number(match[3]) }
}

function notificationBody(notification, owner) {
  const evidence = notification.evidenceUrl ? `\n\nEvidence: ${notification.evidenceUrl}` : ''
  return [
    `@${owner} **${notification.type}**`,
    '',
    notification.summary,
    '',
    `Requested action: ${notification.requestedAction}`,
    '',
    `Notification: \`${notification.notificationId}\` · Run: \`${notification.runId}\`${evidence}`,
  ].join('\n')
}

async function defaultGitHubComment(target, body) {
  await execFileAsync(
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
}

export async function createNotification({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  type,
  summary,
  requestedAction,
  targetUrl = null,
  evidenceUrl = null,
  blocking = false,
  now = new Date(),
  entropy,
  dryRun = false,
  environment = process.env,
  fetchImplementation = globalThis.fetch,
  githubComment = defaultGitHubComment,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const channelRoot = path.resolve(loopRoot, '..', '_shared', 'owner-channel')
  const channel = await readJson(path.join(channelRoot, 'channel.json'))
  const suffix = (entropy ?? randomBytes(3).toString('hex')).toUpperCase()
  const notificationId = `NTF-${timestampToken(now).replace('Z', '')}-${suffix}`
  const notification = {
    schemaVersion: 1,
    notificationId,
    loop: 'issue-dev-loop',
    runId: normalizedRunId,
    type: assertNonEmpty(type, 'type'),
    blocking: Boolean(blocking),
    summary: assertNonEmpty(summary, 'summary'),
    requestedAction: assertNonEmpty(requestedAction, 'requestedAction'),
    targetUrl,
    evidenceUrl,
    createdAt: now.toISOString(),
    delivery: {
      github: targetUrl ? 'pending' : 'not_requested',
      webhook: environment[channel.webhookEnvironmentVariable] ? 'pending' : 'not_configured',
    },
  }

  const outboxFile = path.join(channelRoot, 'outbox', `${notificationId}.json`)
  await writeJson(outboxFile, notification)

  if (dryRun) {
    notification.delivery.github = targetUrl ? 'dry_run' : 'not_requested'
    notification.delivery.webhook = environment[channel.webhookEnvironmentVariable]
      ? 'dry_run'
      : 'not_configured'
  } else {
    const target = parseGitHubTarget(targetUrl)
    if (target) {
      try {
        await githubComment(target, notificationBody(notification, channel.ownerGitHubLogin))
        notification.delivery.github = 'delivered'
      } catch (error) {
        notification.delivery.github = `failed: ${error.message}`
      }
    } else if (targetUrl) {
      notification.delivery.github = 'failed: target is not a GitHub issue or pull request URL'
    }

    const webhookUrl = environment[channel.webhookEnvironmentVariable]
    if (webhookUrl) {
      try {
        const response = await fetchImplementation(webhookUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(notification),
        })
        notification.delivery.webhook = response.ok
          ? 'delivered'
          : `failed: HTTP ${response.status}`
      } catch (error) {
        notification.delivery.webhook = `failed: ${error.message}`
      }
    }
  }

  await writeJson(outboxFile, notification)
  const delivered = Object.values(notification.delivery).some((value) =>
    ['delivered', 'dry_run'].includes(value),
  )
  await appendEvent({
    loopRoot,
    runId: normalizedRunId,
    type: delivered ? 'owner_notified' : 'notification_failed',
    status: delivered ? 'delivered' : 'failed',
    payload: { notificationId, notificationType: type, delivery: notification.delivery },
    now,
  })

  if (blocking && !delivered) {
    throw new Error(`blocking notification was not delivered: ${notificationId}`)
  }
  return notification
}

async function collectFiles(root, output = []) {
  const entries = await readdir(root, { withFileTypes: true })
  for (const entry of entries) {
    if (['node_modules', '.git'].includes(entry.name)) continue
    const target = path.join(root, entry.name)
    if (entry.isDirectory()) await collectFiles(target, output)
    else output.push(target)
  }
  return output
}

export async function validateLoop({ loopRoot = DEFAULT_LOOP_ROOT } = {}) {
  const required = [
    'SKILL.md',
    'LOOP.md',
    'state.md',
    'dependencies.md',
    'agents/openai.yaml',
    'review/REVIEW.md',
    'review/response-policy.md',
    'triggers/TRIGGER.md',
    'templates/implementation-brief.md',
    'templates/pr-body.md',
    'schemas/event.schema.json',
    'schemas/run.schema.json',
    'schemas/evidence.schema.json',
    'logs/index.jsonl',
  ]

  const missing = []
  for (const relative of required) {
    if (!(await pathExists(path.join(loopRoot, relative)))) missing.push(relative)
  }
  if (missing.length > 0) {
    throw new Error(`missing required loop files: ${missing.join(', ')}`)
  }

  const jsonFiles = (await collectFiles(loopRoot)).filter((target) => target.endsWith('.json'))
  const sharedChannel = path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json')
  jsonFiles.push(sharedChannel)
  for (const target of jsonFiles) await readJson(target)

  const contract = await readFile(path.join(loopRoot, 'LOOP.md'), 'utf8')
  const skill = await readFile(path.join(loopRoot, 'SKILL.md'), 'utf8')
  const requiredContractPhrases = [
    'draft PR targeting `dev`',
    'approve, auto-merge, or merge any PR',
    'Only an observed owner merge',
    'No eligible work is a successful no-op',
  ]
  for (const phrase of requiredContractPhrases) {
    if (!contract.includes(phrase)) throw new Error(`LOOP.md is missing invariant: ${phrase}`)
  }
  for (const phrase of ['$implement', 'echo_ui_pr_reviewer', 'pnpm verify']) {
    if (!skill.includes(phrase))
      throw new Error(`SKILL.md is missing runtime dependency: ${phrase}`)
  }

  const textualFiles = (await collectFiles(loopRoot)).filter((target) =>
    /\.(?:md|json|ya?ml|toml|mjs)$/.test(target),
  )
  const macUserRootMarker = ['', 'Users', ''].join('/')
  for (const target of textualFiles) {
    const contents = await readFile(target, 'utf8')
    if (contents.includes(macUserRootMarker)) {
      throw new Error(`machine-specific absolute path found in ${path.relative(loopRoot, target)}`)
    }
  }

  return { valid: true, checkedFiles: required.length + jsonFiles.length }
}
