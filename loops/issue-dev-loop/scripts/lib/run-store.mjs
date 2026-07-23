import { createHash, randomBytes } from 'node:crypto'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  appendJsonLine,
  assertAutomationIdentity,
  assertIssueNumber,
  assertNonEmpty,
  assertRunId,
  defaultGitHubApi,
  execFileAsync,
  parseGitHubTarget,
  pathExists,
  readJson,
  replaceTemplate,
  runDirectory,
  sameGitHubLogin,
  sameRepository,
  timestampToken,
  writeJson,
} from './common.mjs'
import { defaultClaimIssue, defaultReleaseIssueClaim } from './issue-claim.mjs'
import { updateEvolveMetrics } from './evolve.mjs'
import { verifyLatestDurableCheckpoint } from './checkpoint-proof.mjs'
import {
  finalizationRecordDigest,
  validateFinalizationRecord,
  verifyPublishedFinalization,
} from './finalization-proof.mjs'
import { observeOwnerApprovedMerge } from './owner-gate.mjs'

export const PAUSED_STATUSES = new Set(['awaiting_owner_review', 'waiting_for_owner'])
const TERMINAL_STATUSES = new Set(['completed', 'failed', 'blocked', 'cancelled'])
const RUN_STATUSES = new Set(['running', ...PAUSED_STATUSES, ...TERMINAL_STATUSES])
const RESERVED_EVENT_TYPES = new Set([
  'loop_started',
  'verification_completed',
  'review_completed',
  'pr_published',
  'owner_notified',
  'notification_failed',
  'notification_dry_run',
  'owner_response_observed',
  'brief_frozen',
  'implementation_completed',
  'finalization_published',
  'owner_review_approved',
  'pr_merged',
  'run_status_changed',
  'run_finalization_authorized',
  'run_finalized',
  'checkpoint_published',
  'issue_claim_released',
])

const ALLOWED_TRANSITIONS = new Map([
  ['running', new Set(['waiting_for_owner', 'cancelled'])],
  [
    'waiting_for_owner',
    new Set(['running', 'awaiting_owner_review', 'blocked', 'failed', 'cancelled']),
  ],
  ['awaiting_owner_review', new Set(['running', 'waiting_for_owner', 'completed', 'cancelled'])],
])

export function makeRunId({ issueNumber, now = new Date(), entropy } = {}) {
  const issue = assertIssueNumber(issueNumber)
  const suffix = entropy ?? randomBytes(3).toString('hex')
  if (!/^[A-Za-z0-9]+$/.test(suffix)) throw new Error('entropy must be alphanumeric')
  return `${timestampToken(now)}-issue-${issue}-${suffix.toLowerCase()}`
}

export async function readRun(loopRoot, runId) {
  return readJson(path.join(runDirectory(loopRoot, runId), 'run.json'))
}

async function defaultStartWorkspaceValidator({ loopRoot, issueNumber, baseSha }) {
  const repositoryRoot = path.resolve(loopRoot, '..', '..')
  const [branch, head, originDev, status, gitDirectory, commonDirectory] = await Promise.all([
    execFileAsync('git', ['branch', '--show-current'], { cwd: repositoryRoot }),
    execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot }),
    execFileAsync('git', ['rev-parse', 'origin/dev'], { cwd: repositoryRoot }),
    execFileAsync('git', ['status', '--porcelain'], { cwd: repositoryRoot }),
    execFileAsync('git', ['rev-parse', '--path-format=absolute', '--git-dir'], {
      cwd: repositoryRoot,
    }),
    execFileAsync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], {
      cwd: repositoryRoot,
    }),
  ])
  if (gitDirectory.stdout.trim() === commonDirectory.stdout.trim()) {
    throw new Error('start requires an isolated linked Git worktree')
  }
  if (branch.stdout.trim() !== `codex/issue-${issueNumber}`) {
    throw new Error(`start requires branch codex/issue-${issueNumber}`)
  }
  if (head.stdout.trim() !== baseSha || originDev.stdout.trim() !== baseSha) {
    throw new Error('baseSha must equal the current origin/dev and worktree HEAD')
  }
  if (status.stdout.trim()) throw new Error('start requires a clean isolated worktree')
}

export async function startRun({
  loopRoot = DEFAULT_LOOP_ROOT,
  issueNumber,
  issueTitle,
  issueUrl,
  baseSha,
  now = new Date(),
  entropy,
  githubApi = defaultGitHubApi,
  claimIssue = defaultClaimIssue,
  releaseIssueClaim = defaultReleaseIssueClaim,
  verifyAutomationIdentity = assertAutomationIdentity,
  workspaceValidator = defaultStartWorkspaceValidator,
} = {}) {
  const evolve = await readJson(path.join(loopRoot, 'evolve', 'metrics.json'))
  if (evolve.evolveDue) {
    throw new Error(`evolve request must run before issue work: ${evolve.pendingRequestId}`)
  }
  const issue = assertIssueNumber(issueNumber)
  const title = assertNonEmpty(issueTitle, 'issueTitle')
  const url = assertNonEmpty(issueUrl, 'issueUrl')
  const normalizedBaseSha = assertNonEmpty(baseSha, 'baseSha')
  if (!/^[0-9a-f]{40}$/i.test(normalizedBaseSha)) {
    throw new Error('baseSha must be a full Git SHA')
  }
  await workspaceValidator({ loopRoot, issueNumber: issue, baseSha: normalizedBaseSha })
  const runId = makeRunId({ issueNumber: issue, now, entropy })
  const runPath = runDirectory(loopRoot, runId)
  if (await pathExists(runPath)) throw new Error(`run already exists: ${runId}`)

  const runsRoot = path.join(loopRoot, 'logs', 'runs')
  const activeRuns = []
  for (const entry of await readdir(runsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const runFile = path.join(runsRoot, entry.name, 'run.json')
    if (!(await pathExists(runFile))) continue
    const existing = await readJson(runFile)
    if (existing.finishedAt === null) activeRuns.push(existing)
  }
  if (activeRuns.some((existing) => existing.issueNumber === issue)) {
    throw new Error(`issue ${issue} already has an active run`)
  }

  const claimsRoot = path.join(loopRoot, 'logs', 'claims')
  const claimDirectory = path.join(claimsRoot, `issue-${issue}`)
  await mkdir(claimsRoot, { recursive: true })
  try {
    await mkdir(claimDirectory)
  } catch (error) {
    if (error?.code === 'EEXIST') throw new Error(`issue ${issue} is already locally claimed`)
    throw error
  }

  let issueSnapshot
  let remoteClaimCreated = false
  try {
    if (claimIssue === defaultClaimIssue) {
      await verifyAutomationIdentity({ loopRoot, githubApi })
    }
    const snapshot = await claimIssue({
      loopRoot,
      issueUrl: url,
      issueNumber: issue,
      branch: `codex/issue-${issue}`,
      githubApi,
    })
    remoteClaimCreated = true
    if (!snapshot || snapshot.number !== issue || !snapshot.title) {
      throw new Error('claimed GitHub issue snapshot does not match the selected issue')
    }
    const snapshotLabels = (snapshot.labels ?? []).map((label) => label.name ?? label).sort()
    if (!snapshotLabels.includes('codex-ready') || snapshotLabels.includes('loop:claimed')) {
      throw new Error('claimed issue snapshot must be captured before loop:claimed is applied')
    }
    issueSnapshot = {
      title: snapshot.title,
      body: snapshot.body ?? '',
      labels: snapshotLabels,
      url: snapshot.html_url ?? url,
      capturedAt: now.toISOString(),
    }
  } catch (error) {
    await rm(claimDirectory, { recursive: true, force: true })
    if (remoteClaimCreated) {
      try {
        await releaseIssueClaim({ loopRoot, issueUrl: url, issueNumber: issue, githubApi })
      } catch (rollbackError) {
        throw new AggregateError(
          [error, rollbackError],
          'issue claim validation failed and the remote claim rollback also failed',
        )
      }
    }
    throw error
  }

  await Promise.all(
    [
      runPath,
      path.join(loopRoot, 'handoffs', runId),
      path.join(loopRoot, 'screen-shots', runId, 'before'),
      path.join(loopRoot, 'screen-shots', runId, 'after'),
      path.join(loopRoot, 'evidence', runId, 'test-results'),
    ].map((directory) => mkdir(directory, { recursive: true })),
  )

  const run = {
    schemaVersion: 1,
    runId,
    issueNumber: issue,
    issueTitle: issueSnapshot.title,
    issueUrl: url,
    baseBranch: 'dev',
    baseSha: normalizedBaseSha,
    branch: `codex/issue-${issue}`,
    status: 'running',
    startedAt: now.toISOString(),
    finishedAt: null,
    prUrl: null,
    headSha: null,
    mergeSha: null,
    issueSnapshot,
    briefDigest: null,
    uiEvidenceRequired: null,
    implementationCommit: null,
  }
  await writeJson(path.join(runPath, 'run.json'), run)
  await appendValidatedEvent({
    loopRoot,
    runId,
    type: 'loop_started',
    status: 'running',
    payload: { issueNumber: issue, branch: run.branch },
    now,
  })

  const template = await readFile(
    path.join(loopRoot, 'templates', 'implementation-brief.md'),
    'utf8',
  )
  const briefPath = path.join(loopRoot, 'handoffs', runId, 'implementation-brief.md')
  await writeFile(
    briefPath,
    replaceTemplate(template, {
      RUN_ID: runId,
      ISSUE_NUMBER: issue,
      ISSUE_TITLE: issueSnapshot.title,
      ISSUE_URL: url,
      ISSUE_BODY: issueSnapshot.body,
      BASE_SHA: normalizedBaseSha,
      UI_EVIDENCE_REQUIRED: 'UNSET',
    }),
    'utf8',
  )
  return { run, briefPath, runPath }
}

async function assertFrozenBriefUnchanged(loopRoot, run) {
  const briefPath = path.join(loopRoot, 'handoffs', run.runId, 'implementation-brief.md')
  const source = await readFile(briefPath, 'utf8')
  const currentDigest = createHash('sha256').update(source).digest('hex')
  if (currentDigest !== run.briefDigest) {
    throw new Error('frozen implementation brief changed after freeze-brief')
  }
  return currentDigest
}

const REQUIRED_BRIEF_SECTIONS = [
  'Acceptance criteria',
  'In scope',
  'Out of scope',
  'Pre-agreed TDD seams',
  'Required targeted checks',
  'Required UI evidence',
  'Risks and owner-confirmation boundaries',
  'Stop conditions',
]

function briefSection(source, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return (
    source.match(new RegExp(`## ${escaped}[ \\t]*\\r?\\n([\\s\\S]*?)(?=\\n## |$)`))?.[1]?.trim() ??
    ''
  )
}

function withoutHtmlComments(source) {
  let visibleSource = ''
  let cursor = 0
  while (cursor < source.length) {
    const commentStart = source.indexOf('<!--', cursor)
    if (commentStart === -1) {
      visibleSource += source.slice(cursor)
      break
    }
    visibleSource += source.slice(cursor, commentStart)
    const commentEnd = source.indexOf('-->', commentStart + 4)
    if (commentEnd === -1) break
    cursor = commentEnd + 3
  }
  return visibleSource
}

function visibleMarkdownLines(source) {
  return withoutHtmlComments(source)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseFrozenBrief(source) {
  const sections = Object.fromEntries(
    REQUIRED_BRIEF_SECTIONS.map((heading) => [heading, briefSection(source, heading)]),
  )
  for (const [heading, contents] of Object.entries(sections)) {
    if (!contents || contents.includes('<!--')) {
      throw new Error(`implementation brief requires a concrete ${heading} section`)
    }
  }
  const requiredChecks = sections['Required targeted checks']
    .split('\n')
    .map((line) =>
      line
        .replace(/^\s*[-*]\s*/, '')
        .replaceAll('`', '')
        .trim(),
    )
    .filter(Boolean)
  if (requiredChecks.length === 0) {
    throw new Error('implementation brief requires at least one targeted check')
  }
  if (requiredChecks.every((command) => /^pnpm verify(?:\s|$)/.test(command))) {
    throw new Error('implementation brief requires a targeted check in addition to pnpm verify')
  }
  return { sections, requiredChecks }
}

export async function freezeBrief({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  now = new Date(),
  githubApi = defaultGitHubApi,
  checkpointVerifier = verifyLatestDurableCheckpoint,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const runFile = path.join(runDirectory(loopRoot, normalizedRunId), 'run.json')
  const run = await readJson(runFile)
  if (run.status !== 'running' || run.finishedAt !== null || run.briefDigest) {
    throw new Error('brief can only be frozen once for a running run')
  }
  await checkpointVerifier({
    loopRoot,
    runId: normalizedRunId,
    events: await readEvents(loopRoot, normalizedRunId),
    operation: 'freeze-brief',
    githubApi,
  })
  const briefPath = path.join(loopRoot, 'handoffs', normalizedRunId, 'implementation-brief.md')
  const source = await readFile(briefPath, 'utf8')
  const { sections } = parseFrozenBrief(source)
  const acceptance = sections['Acceptance criteria']
  const uiEvidence = source.match(/UI evidence required:\s*(yes|no)\b/i)?.[1]?.toLowerCase()
  if (!acceptance || acceptance.includes('<!--') || acceptance.length < 20) {
    throw new Error('implementation brief requires concrete frozen acceptance criteria')
  }
  if (!uiEvidence)
    throw new Error('implementation brief must set UI evidence required to yes or no')
  const briefDigest = createHash('sha256').update(source).digest('hex')
  const updated = {
    ...run,
    briefDigest,
    uiEvidenceRequired: uiEvidence === 'yes',
  }
  await writeJson(runFile, updated)
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'brief_frozen',
    status: 'frozen',
    payload: { briefDigest, uiEvidenceRequired: updated.uiEvidenceRequired },
    now,
  })
  return { briefPath, briefDigest, uiEvidenceRequired: updated.uiEvidenceRequired }
}

async function defaultCommitRangeValidator({ loopRoot, ancestor, descendant }) {
  await execFileAsync('git', ['merge-base', '--is-ancestor', ancestor, descendant], {
    cwd: path.resolve(loopRoot, '..', '..'),
    maxBuffer: 1024 * 1024,
  })
}

async function defaultTrailingPathValidator({ loopRoot, runId, ancestor, descendant }) {
  if (ancestor === descendant) return
  const repositoryRoot = path.resolve(loopRoot, '..', '..')
  const result = await execFileAsync(
    'git',
    ['diff', '--name-only', '--diff-filter=ACMR', `${ancestor}..${descendant}`],
    { cwd: repositoryRoot, maxBuffer: 1024 * 1024 },
  )
  const permittedPrefixes = [
    `loops/issue-dev-loop/logs/runs/${runId}/`,
    `loops/issue-dev-loop/handoffs/${runId}/`,
    `loops/issue-dev-loop/screen-shots/${runId}/`,
    `loops/issue-dev-loop/evidence/${runId}/`,
  ]
  const unexpected = result.stdout
    .split('\n')
    .filter(Boolean)
    .filter((file) => !permittedPrefixes.some((prefix) => file.startsWith(prefix)))
  if (unexpected.length > 0) {
    throw new Error(
      `product changes after the recorded $implement commit are forbidden: ${unexpected.join(', ')}`,
    )
  }
}

export async function recordImplementation({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  resultPath,
  now = new Date(),
  commitRangeValidator = defaultCommitRangeValidator,
  githubApi = defaultGitHubApi,
  checkpointVerifier = verifyLatestDurableCheckpoint,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const runFile = path.join(runDirectory(loopRoot, normalizedRunId), 'run.json')
  const run = await readJson(runFile)
  if (run.status !== 'running' || !run.briefDigest) {
    throw new Error('implementation recording requires a frozen running brief')
  }
  await assertFrozenBriefUnchanged(loopRoot, run)
  const resolvedResultPath = path.resolve(assertNonEmpty(resultPath, 'resultPath'))
  const runRoot = runDirectory(loopRoot, normalizedRunId)
  if (!resolvedResultPath.startsWith(`${runRoot}${path.sep}`)) {
    throw new Error('implementation result must be inside the current run directory')
  }
  const resultSource = await readFile(resolvedResultPath, 'utf8')
  const result = JSON.parse(resultSource)
  if (
    result.schemaVersion !== 1 ||
    result.runId !== normalizedRunId ||
    result.agent !== '$implement' ||
    result.briefDigest !== run.briefDigest ||
    !assertNonEmpty(result.invocationId, 'implementation.invocationId') ||
    !/^[0-9a-f]{40}$/i.test(result.commitSha)
  ) {
    throw new Error('implementation result does not attest $implement and the frozen brief')
  }
  const startedAt = Date.parse(result.startedAt)
  const finishedAt = Date.parse(result.finishedAt)
  if (Number.isNaN(startedAt) || Number.isNaN(finishedAt) || finishedAt < startedAt) {
    throw new Error('$implement result requires an ordered invocation time range')
  }
  const checks = Array.isArray(result.checks) ? result.checks : []
  const briefSource = await readFile(
    path.join(loopRoot, 'handoffs', normalizedRunId, 'implementation-brief.md'),
    'utf8',
  )
  const { requiredChecks } = parseFrozenBrief(briefSource)
  if (
    checks.length === 0 ||
    checks.some((check) => check.status !== 'passed') ||
    !checks.some((check) => /^pnpm verify(?:\s|$)/.test(check.command)) ||
    requiredChecks.some(
      (requiredCommand) => !checks.some((check) => check.command === requiredCommand),
    )
  ) {
    throw new Error('$implement result requires the frozen targeted checks and pnpm verify')
  }
  const previousCommit = run.implementationCommit ?? run.baseSha
  if (result.commitSha === previousCommit) {
    throw new Error('$implement must produce a new commit')
  }
  const events = await readEvents(loopRoot, normalizedRunId)
  await checkpointVerifier({
    loopRoot,
    runId: normalizedRunId,
    events,
    operation: 'record-implementation',
    githubApi,
  })
  const relativeResultPath = path.relative(loopRoot, resolvedResultPath)
  const resultDigest = createHash('sha256').update(resultSource).digest('hex')
  if (
    events.some(
      (event) =>
        event.type === 'implementation_completed' &&
        (event.payload?.invocationId === result.invocationId ||
          event.payload?.resultPath === relativeResultPath),
    )
  ) {
    throw new Error('$implement invocation IDs and result paths must be unique within a run')
  }
  await commitRangeValidator({
    loopRoot,
    ancestor: previousCommit,
    descendant: result.commitSha,
  })
  const updated = { ...run, implementationCommit: result.commitSha }
  await writeJson(runFile, updated)
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'implementation_completed',
    status: 'passed',
    payload: {
      agent: '$implement',
      invocationId: result.invocationId,
      startedAt: result.startedAt,
      finishedAt: result.finishedAt,
      briefDigest: run.briefDigest,
      commitSha: result.commitSha,
      resultPath: relativeResultPath,
      resultDigest,
    },
    now,
  })
  return updated
}

export async function recordPullRequest({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  prUrl,
  headSha,
  now = new Date(),
  githubApi = defaultGitHubApi,
  trailingPathValidator = defaultTrailingPathValidator,
  checkpointVerifier = verifyLatestDurableCheckpoint,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const runFile = path.join(runDirectory(loopRoot, normalizedRunId), 'run.json')
  const run = await readJson(runFile)
  if (run.finishedAt !== null || run.status !== 'running') {
    throw new Error('draft PR publication requires a running run')
  }
  if (!run.briefDigest || !run.implementationCommit) {
    throw new Error('record-pr requires a frozen brief and recorded $implement result')
  }
  await assertFrozenBriefUnchanged(loopRoot, run)
  await checkpointVerifier({
    loopRoot,
    runId: normalizedRunId,
    events: await readEvents(loopRoot, normalizedRunId),
    operation: 'record-pr',
    githubApi,
  })
  if (!/^[0-9a-f]{40}$/i.test(headSha)) {
    throw new Error('record-pr requires a full head SHA')
  }
  const issueTarget = parseGitHubTarget(run.issueUrl)
  const pullTarget = parseGitHubTarget(prUrl)
  if (!pullTarget || pullTarget.kind !== 'pull' || !sameRepository(issueTarget, pullTarget)) {
    throw new Error('prUrl must identify a pull request in the issue repository')
  }
  const livePullRequest = await githubApi(
    `repos/${pullTarget.owner}/${pullTarget.repo}/pulls/${pullTarget.number}`,
  )
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const isInitialBinding = run.prUrl === null
  if (
    livePullRequest.state !== 'open' ||
    !sameGitHubLogin(livePullRequest.user?.login, channel.automationGitHubLogin) ||
    (isInitialBinding && livePullRequest.draft !== true) ||
    livePullRequest.base?.ref !== 'dev' ||
    livePullRequest.head?.ref !== run.branch ||
    livePullRequest.head?.repo?.full_name?.toLowerCase() !==
      `${pullTarget.owner}/${pullTarget.repo}`.toLowerCase() ||
    livePullRequest.head?.sha !== headSha
  ) {
    throw new Error(
      'record-pr requires a live PR to dev at the exact run branch and headSha; first binding must be draft',
    )
  }
  if (run.prUrl !== null && run.prUrl !== prUrl) {
    throw new Error('record-pr cannot rebind an existing run to a different pull request')
  }
  const requiredBodyFragments = [
    `Closes #${run.issueNumber}`,
    `<!-- issue-dev-loop:run:${normalizedRunId} -->`,
    `Run ID: \`${normalizedRunId}\``,
    `Base SHA: \`${run.baseSha}\``,
    'This PR must be reviewed and merged by `@codeacme17`',
  ]
  if (isInitialBinding) requiredBodyFragments.push(`Head SHA: \`${headSha}\``)
  if (requiredBodyFragments.some((fragment) => !livePullRequest.body?.includes(fragment))) {
    throw new Error('draft PR body is missing immutable loop metadata or owner-only merge language')
  }
  for (const heading of [
    'Changes',
    'Acceptance criteria',
    'Verification',
    'Evidence',
    'Independent review',
    'Known limitations',
  ]) {
    const contents = briefSection(livePullRequest.body ?? '', heading)
    if (!contents || contents.includes('{{')) {
      throw new Error(`draft PR body requires a non-empty ${heading} section`)
    }
  }
  if (!/- Risk:\s*\S/.test(livePullRequest.body)) {
    throw new Error('draft PR body requires a concrete risk assessment')
  }
  const implementationComparison = await githubApi(
    `repos/${pullTarget.owner}/${pullTarget.repo}/compare/${run.implementationCommit}...${headSha}`,
  )
  if (
    !['ahead', 'identical'].includes(implementationComparison.status) ||
    implementationComparison.base_commit?.sha !== run.implementationCommit
  ) {
    throw new Error('recorded $implement commit is not contained in the draft PR head')
  }
  await trailingPathValidator({
    loopRoot,
    runId: normalizedRunId,
    ancestor: run.implementationCommit,
    descendant: headSha,
  })
  const updated = { ...run, prUrl, headSha }
  await writeJson(runFile, updated)
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'pr_published',
    status: 'draft',
    payload: { prUrl, headSha, baseBranch: 'dev', branch: run.branch },
    now,
  })
  return updated
}

export async function appendValidatedEvent({
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

export async function appendEvent(options = {}) {
  if (RESERVED_EVENT_TYPES.has(options.type)) {
    throw new Error(`event type is reserved for a validated runtime operation: ${options.type}`)
  }
  return appendValidatedEvent(options)
}

export async function readEvents(loopRoot, runId) {
  const contents = await readFile(path.join(runDirectory(loopRoot, runId), 'events.jsonl'), 'utf8')
  return contents
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

async function ensureFinalizationArtifacts({
  loopRoot,
  run,
  previousStatus,
  failureFingerprint,
  now,
}) {
  const runPath = runDirectory(loopRoot, run.runId)
  const events = await readEvents(loopRoot, run.runId)
  if (
    !events.some(
      (event) =>
        event.type === 'run_finalized' &&
        event.status === run.status &&
        event.payload?.previousStatus === previousStatus,
    )
  ) {
    await appendValidatedEvent({
      loopRoot,
      runId: run.runId,
      type: 'run_finalized',
      status: run.status,
      payload: { previousStatus },
      now,
    })
  }

  const summaryTemplate = await readFile(path.join(loopRoot, 'templates', 'run-summary.md'), 'utf8')
  await writeFile(
    path.join(runPath, 'summary.md'),
    replaceTemplate(summaryTemplate, {
      RUN_ID: run.runId,
      ISSUE_NUMBER: run.issueNumber,
      STATUS: run.status,
      STARTED_AT: run.startedAt,
      FINISHED_AT: run.finishedAt,
      PR_URL: run.prUrl ?? 'N/A',
      HEAD_SHA: run.headSha ?? 'N/A',
      MERGE_SHA: run.mergeSha ?? 'N/A',
    }),
    'utf8',
  )

  const indexPath = path.join(loopRoot, 'logs', 'index.jsonl')
  const indexEntries = (await readFile(indexPath, 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  if (!indexEntries.some((entry) => entry.event === 'run_finalized' && entry.runId === run.runId)) {
    await appendJsonLine(indexPath, {
      schemaVersion: 1,
      event: 'run_finalized',
      runId: run.runId,
      issueNumber: run.issueNumber,
      status: run.status,
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
      prUrl: run.prUrl,
      headSha: run.headSha,
      mergeSha: run.mergeSha,
      failureFingerprint,
      notificationUrl:
        events.findLast((event) => event.type === 'finalization_published')?.payload
          ?.notificationUrl ?? null,
    })
  }
  await updateEvolveMetrics({ loopRoot, now })
  return run
}

async function ensureIssueClaimReleased({ loopRoot, run, githubApi, releaseIssueClaim, now }) {
  const events = await readEvents(loopRoot, run.runId)
  const alreadyReleased = events.some(
    (event) => event.type === 'issue_claim_released' && event.status === 'released',
  )
  if (!alreadyReleased) {
    await releaseIssueClaim({
      loopRoot,
      issueUrl: run.issueUrl,
      issueNumber: run.issueNumber,
      githubApi,
    })
    await appendValidatedEvent({
      loopRoot,
      runId: run.runId,
      type: 'issue_claim_released',
      status: 'released',
      payload: { issueNumber: run.issueNumber },
      now,
    })
  }
  await rm(path.join(loopRoot, 'logs', 'claims', `issue-${run.issueNumber}`), {
    recursive: true,
    force: true,
  })
  return run
}

async function verifyRunFinalizationPublication({
  loopRoot,
  run,
  events,
  status,
  mergeSha,
  failureFingerprint,
  githubApi,
}) {
  const resultPath = path.join(runDirectory(loopRoot, run.runId), 'finalization-result.json')
  if (!(await pathExists(resultPath))) {
    throw new Error(`${status} requires a matching durable finalization record`)
  }
  const record = validateFinalizationRecord(await readJson(resultPath), run)
  if (
    record.status !== status ||
    record.mergeSha !== (mergeSha ?? run.mergeSha ?? null) ||
    record.failureFingerprint !== (failureFingerprint ?? null)
  ) {
    throw new Error(`${status} finalization record does not match the requested transition`)
  }
  const digest = finalizationRecordDigest(record)
  const publication = events.findLast(
    (event) =>
      event.type === 'finalization_published' &&
      event.status === status &&
      event.payload?.digest === digest &&
      event.payload?.finishedAt === record.finishedAt &&
      event.payload?.mergeSha === record.mergeSha &&
      event.payload?.failureFingerprint === record.failureFingerprint,
  )
  if (!publication?.payload?.commentUrl) {
    throw new Error(`${status} requires a matching durable finalization journal publication`)
  }
  await verifyPublishedFinalization({
    loopRoot,
    record,
    commentUrl: publication.payload.commentUrl,
    expectedHeadBranch: run.branch,
    githubApi,
  })
  return { record, publication }
}

export async function transitionRun({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  status,
  prUrl = null,
  headSha = null,
  mergeSha = null,
  failureFingerprint = null,
  now = new Date(),
  githubApi = defaultGitHubApi,
  releaseIssueClaim = defaultReleaseIssueClaim,
  skipCheckpointGate = false,
  checkpointVerifier = verifyLatestDurableCheckpoint,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  if (!RUN_STATUSES.has(status)) throw new Error(`invalid run status: ${status}`)

  const runPath = runDirectory(loopRoot, normalizedRunId)
  const runFile = path.join(runPath, 'run.json')
  const run = await readJson(runFile)
  if (run.finishedAt !== null) {
    const existingEvents = await readEvents(loopRoot, normalizedRunId)
    const authorization = existingEvents.findLast(
      (event) =>
        event.type === 'run_finalization_authorized' &&
        event.status === run.status &&
        event.payload?.finishedAt === run.finishedAt,
    )
    if (!TERMINAL_STATUSES.has(status) || status !== run.status || !authorization) {
      throw new Error(`run is already finalized: ${normalizedRunId}`)
    }
    await verifyRunFinalizationPublication({
      loopRoot,
      run,
      events: existingEvents,
      status,
      mergeSha: run.mergeSha,
      failureFingerprint: authorization.payload.failureFingerprint ?? null,
      githubApi,
    })
    const finalized = await ensureFinalizationArtifacts({
      loopRoot,
      run,
      previousStatus: authorization.payload.previousStatus,
      failureFingerprint: authorization.payload.failureFingerprint ?? null,
      now: new Date(run.finishedAt),
    })
    return ensureIssueClaimReleased({
      loopRoot,
      run: finalized,
      githubApi,
      releaseIssueClaim,
      now,
    })
  }
  if (run.status === status) throw new Error(`run already has status: ${status}`)
  const events = await readEvents(loopRoot, normalizedRunId)
  if (!skipCheckpointGate && !TERMINAL_STATUSES.has(status)) {
    await checkpointVerifier({
      loopRoot,
      runId: normalizedRunId,
      events,
      operation: `transition to ${status}`,
      githubApi,
    })
  }
  if (!ALLOWED_TRANSITIONS.get(run.status)?.has(status)) {
    throw new Error(`invalid run status transition: ${run.status} -> ${status}`)
  }
  if (status === 'running') {
    const pauseEvent = events.findLast(
      (event) => event.type === 'run_status_changed' && event.status === run.status,
    )
    const channel = await readJson(
      path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
    )
    const ownerResponse = events.findLast(
      (event) =>
        event.type === 'owner_response_observed' &&
        event.status === 'observed' &&
        sameGitHubLogin(event.payload?.actor, channel.ownerGitHubLogin) &&
        (!pauseEvent || Date.parse(event.timestamp) >= Date.parse(pauseEvent.timestamp)),
    )
    if (!ownerResponse) {
      throw new Error('resuming product work requires an observed owner response to this pause')
    }
  }

  if (status === 'awaiting_owner_review') {
    if (!prUrl || !headSha || run.prUrl !== prUrl || run.headSha !== headSha) {
      throw new Error('awaiting_owner_review requires the recorded PR URL and headSha')
    }
    const issueTarget = parseGitHubTarget(run.issueUrl)
    const pullRequestTarget = parseGitHubTarget(prUrl)
    if (
      !pullRequestTarget ||
      pullRequestTarget.kind !== 'pull' ||
      !sameRepository(issueTarget, pullRequestTarget)
    ) {
      throw new Error('awaiting_owner_review requires a PR in the issue repository')
    }
    const verificationEvent = events.findLast(
      (event) =>
        event.type === 'verification_completed' &&
        event.status === 'passed' &&
        event.payload?.headSha === headSha,
    )
    if (!verificationEvent) {
      throw new Error('awaiting_owner_review requires passed verification_completed for headSha')
    }
    const reviewEvent = events.findLast(
      (event) =>
        event.type === 'review_completed' &&
        event.status === 'passed' &&
        event.payload?.headSha === headSha,
    )
    if (!reviewEvent) {
      throw new Error('awaiting_owner_review requires passed review_completed for headSha')
    }
    const ownerNotification = events.findLast(
      (event) =>
        event.type === 'owner_notified' &&
        event.status === 'delivered' &&
        ['pr_ready_for_review', 'pr_updated_for_review'].includes(
          event.payload?.notificationType,
        ) &&
        event.payload?.delivery?.github === 'delivered' &&
        event.payload?.targetUrl === prUrl &&
        event.payload?.headSha === headSha,
    )
    if (!ownerNotification) {
      throw new Error('awaiting_owner_review requires a delivered GitHub owner notification')
    }
    const livePullRequest = await githubApi(
      `repos/${pullRequestTarget.owner}/${pullRequestTarget.repo}/pulls/${pullRequestTarget.number}`,
    )
    const channel = await readJson(
      path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
    )
    const verifiedManifestSource = await readFile(
      path.resolve(loopRoot, verificationEvent.payload.manifestPath),
      'utf8',
    )
    const verifiedManifestDigest = createHash('sha256').update(verifiedManifestSource).digest('hex')
    if (verifiedManifestDigest !== verificationEvent.payload.manifestDigest) {
      throw new Error('awaiting_owner_review evidence manifest no longer matches its digest')
    }
    const verifiedManifest = JSON.parse(verifiedManifestSource)
    const pullRequestBody = livePullRequest.body ?? ''
    const visiblePullRequestBody = withoutHtmlComments(pullRequestBody)
    const evidenceSection = briefSection(visiblePullRequestBody, 'Evidence')
    const reviewSection = briefSection(visiblePullRequestBody, 'Independent review')
    const verificationSection = briefSection(visiblePullRequestBody, 'Verification')
    const requiredVisibleMetadata = [
      `Closes #${run.issueNumber}`,
      `Run ID: \`${normalizedRunId}\``,
      `Base SHA: \`${run.baseSha}\``,
      `Head SHA: \`${headSha}\``,
      'This PR must be reviewed and merged by `@codeacme17`',
    ]
    const requiredSections = [
      'Changes',
      'Acceptance criteria',
      'Verification',
      'Evidence',
      'Independent review',
      'Known limitations',
    ]
    const verificationLines = visibleMarkdownLines(verificationSection)
    const hasExactVerificationResults = verifiedManifest.checks.every((check) => {
      const commandToken = `\`${check.command}\``
      const resultLines = verificationLines.filter(
        (line) => line.startsWith('- ') && line.includes(commandToken),
      )
      return (
        resultLines.length === 1 && resultLines[0] === `- ${commandToken}: passed (exit code 0)`
      )
    })
    const screenshotPaths = verifiedManifest.screenshots.map((screenshot) => screenshot.path)
    const bodyHasExactProof =
      pullRequestBody.includes(`<!-- issue-dev-loop:run:${normalizedRunId} -->`) &&
      requiredVisibleMetadata.every((fragment) => visiblePullRequestBody.includes(fragment)) &&
      requiredSections.every((heading) => briefSection(visiblePullRequestBody, heading)) &&
      evidenceSection.includes(verificationEvent.payload.manifestUrl) &&
      reviewSection.includes(reviewEvent.payload.reviewUrl) &&
      hasExactVerificationResults &&
      !/\bpending\b/i.test(`${verificationSection}\n${evidenceSection}\n${reviewSection}`) &&
      (!run.uiEvidenceRequired ||
        (screenshotPaths.length > 0 &&
          screenshotPaths.every((screenshotPath) =>
            visiblePullRequestBody.includes(screenshotPath),
          )))
    if (
      livePullRequest.state !== 'open' ||
      livePullRequest.draft !== false ||
      !sameGitHubLogin(livePullRequest.user?.login, channel.automationGitHubLogin) ||
      livePullRequest.base?.ref !== 'dev' ||
      livePullRequest.head?.ref !== run.branch ||
      livePullRequest.head?.repo?.full_name?.toLowerCase() !==
        `${pullRequestTarget.owner}/${pullRequestTarget.repo}`.toLowerCase() ||
      livePullRequest.head?.sha !== headSha ||
      !bodyHasExactProof
    ) {
      throw new Error(
        'awaiting_owner_review requires an automation-authored live PR with exact-head evidence and review links',
      )
    }
  }

  if (status === 'completed') {
    if (
      run.status !== 'awaiting_owner_review' ||
      !run.prUrl ||
      !run.headSha ||
      !/^[0-9a-f]{40}$/i.test(mergeSha)
    ) {
      throw new Error('completed requires an owner-ready PR and mergeSha')
    }
    const remoteMerge = await observeOwnerApprovedMerge({
      loopRoot,
      prUrl: run.prUrl,
      expectedHeadSha: run.headSha,
      expectedHeadBranch: run.branch,
      githubApi,
    })
    if (remoteMerge.mergeSha !== mergeSha) {
      throw new Error('completed mergeSha does not match the remote owner merge')
    }
    const channel = await readJson(
      path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
    )
    const ownerApproval = events.some(
      (event) =>
        event.type === 'owner_review_approved' &&
        event.status === 'observed' &&
        sameGitHubLogin(event.payload?.actor, channel.ownerGitHubLogin) &&
        event.payload?.headSha === run.headSha,
    )
    const ownerMerge = events.some(
      (event) =>
        event.type === 'pr_merged' &&
        event.status === 'observed' &&
        sameGitHubLogin(event.payload?.actor, channel.ownerGitHubLogin) &&
        event.payload?.headSha === run.headSha &&
        event.payload?.mergeSha === mergeSha,
    )
    if (!ownerApproval || !ownerMerge) {
      throw new Error(
        'completed requires observed owner approval and owner merge for the current head',
      )
    }
  }
  if (['failed', 'blocked'].includes(status)) {
    assertNonEmpty(failureFingerprint, 'failureFingerprint')
    const requiredType = status === 'failed' ? 'loop_failed' : 'blocked'
    const pauseEvent = events.findLast(
      (event) => event.type === 'run_status_changed' && event.status === 'waiting_for_owner',
    )
    if (
      !pauseEvent ||
      !events.some(
        (event) =>
          event.type === 'owner_notified' &&
          event.status === 'delivered' &&
          event.payload?.notificationType === requiredType &&
          event.payload?.delivery?.github === 'delivered' &&
          Date.parse(event.timestamp) >= Date.parse(pauseEvent.timestamp) &&
          [run.issueUrl, run.prUrl].filter(Boolean).includes(event.payload?.targetUrl),
      )
    ) {
      throw new Error(
        `${status} requires a delivered GitHub ${requiredType} notification for this pause`,
      )
    }
  }
  const finalizationProof = TERMINAL_STATUSES.has(status)
    ? await verifyRunFinalizationPublication({
        loopRoot,
        run,
        events,
        status,
        mergeSha,
        failureFingerprint,
        githubApi,
      })
    : null

  const transitioned = {
    ...run,
    status,
    finishedAt: TERMINAL_STATUSES.has(status) ? finalizationProof.record.finishedAt : null,
    prUrl: prUrl ?? run.prUrl,
    headSha: headSha ?? run.headSha,
    mergeSha: mergeSha ?? run.mergeSha,
  }
  if (TERMINAL_STATUSES.has(status)) {
    await appendValidatedEvent({
      loopRoot,
      runId: normalizedRunId,
      type: 'run_finalization_authorized',
      status,
      payload: {
        previousStatus: run.status,
        finishedAt: transitioned.finishedAt,
        failureFingerprint,
      },
      now,
    })
  }
  await writeJson(runFile, transitioned)
  if (!TERMINAL_STATUSES.has(status)) {
    await appendValidatedEvent({
      loopRoot,
      runId: normalizedRunId,
      type: 'run_status_changed',
      status,
      payload: { previousStatus: run.status },
      now,
    })
    return transitioned
  }
  const finalized = await ensureFinalizationArtifacts({
    loopRoot,
    run: transitioned,
    previousStatus: run.status,
    failureFingerprint,
    now,
  })
  return ensureIssueClaimReleased({
    loopRoot,
    run: finalized,
    githubApi,
    releaseIssueClaim,
    now,
  })
}

export async function finalizeRun(options = {}) {
  if (!TERMINAL_STATUSES.has(options.status)) {
    throw new Error(`invalid final status: ${options.status}`)
  }
  return transitionRun(options)
}
