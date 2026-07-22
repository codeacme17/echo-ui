import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import {
  appendEvent,
  assertAutomationIdentity,
  canonicalCheckpoint,
  canonicalRecord,
  checkpointDigest,
  completeEvolve,
  createNotification,
  defaultClaimIssue,
  detectWork,
  finalizeRun,
  freezeBrief,
  getEvolveStatus,
  observeOwnerMerge,
  prepareActiveCheckpoint,
  prepareFinalizationRecord,
  reconcileActiveJournal,
  reconcileFinalizationJournal,
  recordEvidence,
  recordDigest,
  recordFinalizationPublication,
  recordActiveCheckpointPublication,
  recordImplementation,
  recordOwnerResponse,
  recordPullRequest,
  recordReview,
  restoreActiveCheckpoint,
  selectIssue,
  startRun,
  transitionRun,
  validateLoop,
} from '../scripts/runtime.mjs'

const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryLoopRoot = path.resolve(testDirectory, '..')
const execFileAsync = promisify(execFile)

async function createFixture() {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-loop-test-'))
  const loopRoot = path.join(parent, 'issue-dev-loop')
  const channelRoot = path.join(parent, '_shared', 'owner-channel')
  await Promise.all([
    mkdir(path.join(loopRoot, 'templates'), { recursive: true }),
    mkdir(path.join(loopRoot, 'logs', 'runs'), { recursive: true }),
    mkdir(path.join(loopRoot, 'evidence'), { recursive: true }),
    mkdir(path.join(loopRoot, 'evolve', 'requests'), { recursive: true }),
    mkdir(path.join(channelRoot, 'outbox'), { recursive: true }),
  ])
  for (const name of ['implementation-brief.md', 'run-summary.md']) {
    const contents = await readFile(path.join(repositoryLoopRoot, 'templates', name), 'utf8')
    await writeFile(path.join(loopRoot, 'templates', name), contents, 'utf8')
  }
  await writeFile(
    path.join(loopRoot, 'logs', 'index.jsonl'),
    '{"schemaVersion":1,"event":"loop_initialized"}\n',
    'utf8',
  )
  await writeFile(
    path.join(loopRoot, 'logs', 'triggers.jsonl'),
    '{"schemaVersion":1,"event":"trigger_log_initialized"}\n',
    'utf8',
  )
  await writeFile(
    path.join(loopRoot, 'evolve', 'metrics.json'),
    `${JSON.stringify({
      schemaVersion: 1,
      finalizedRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      noWorkChecks: 0,
      ownerRequestedChanges: 0,
      revertedPullRequests: 0,
      reviewFindings: { accepted: 0, rejected: 0, needsHuman: 0 },
      recentFailureFingerprints: [],
      evolveDue: false,
      pendingRequestId: null,
      lastEvolvedAt: null,
      lastEvolvedRunCount: 0,
      completedEvolveSessions: 0,
    })}\n`,
    'utf8',
  )
  await writeFile(
    path.join(channelRoot, 'channel.json'),
    `${JSON.stringify({
      schemaVersion: 1,
      ownerGitHubLogin: 'codeacme17',
      automationGitHubLogin: 'echo-ui-loop[bot]',
      reviewerGitHubLogin: 'echo-ui-reviewer[bot]',
      stateIssueNumber: 999,
      repository: 'codeacme17/echo-ui',
      webhookEnvironmentVariable: 'TEST_LOOP_WEBHOOK_URL',
      immediateTypes: [
        'approval_required',
        'clarification_required',
        'blocked',
        'review_dispute',
        'pr_ready_for_review',
        'pr_updated_for_review',
        'loop_failed',
      ],
    })}\n`,
    'utf8',
  )
  return { loopRoot, channelRoot }
}

async function startFixtureRun(options) {
  return startRun({
    ...options,
    baseSha: options.baseSha ?? '0'.repeat(40),
    claimIssue: async () => ({
      number: options.issueNumber,
      title: options.issueTitle,
      body: 'Authoritative issue body and acceptance context.',
      html_url: options.issueUrl,
      labels: [{ name: 'codex-ready' }],
    }),
  })
}

async function publishFixtureCheckpoint({ loopRoot, runId }) {
  const prepared = await prepareActiveCheckpoint({ loopRoot, runId })
  const commentUrl = `https://github.com/codeacme17/echo-ui/issues/999#issuecomment-${Math.abs(
    prepared.digest
      .slice(0, 8)
      .split('')
      .reduce((total, value) => total + value.charCodeAt(0), 0),
  )}`
  await recordActiveCheckpointPublication({
    loopRoot,
    runId,
    resultPath: prepared.resultPath,
    commentUrl,
    githubApi: async () => ({
      user: { login: 'echo-ui-loop[bot]' },
      body: prepared.body,
    }),
  })
  return prepared
}

function pullRequestFixture(run, headSha, { draft = true, merged = false } = {}) {
  return {
    state: merged ? 'closed' : 'open',
    draft,
    merged,
    merged_by: merged ? { login: 'codeacme17' } : null,
    merge_commit_sha: merged ? '9'.repeat(40) : null,
    base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } },
    head: { ref: run.branch, sha: headSha, repo: { full_name: 'codeacme17/echo-ui' } },
    body: [
      `Closes #${run.issueNumber}`,
      `<!-- issue-dev-loop:run:${run.runId} -->`,
      `Run ID: \`${run.runId}\``,
      `Base SHA: \`${run.baseSha}\``,
      `Head SHA: \`${headSha}\``,
      '- Risk: low and isolated',
      '## Changes',
      'Implements the frozen issue scope.',
      '## Acceptance criteria',
      'All frozen acceptance criteria are covered.',
      '## Verification',
      'Targeted regression test and pnpm verify passed.',
      '## Evidence',
      'Exact-head workflow evidence is attached or pending for this draft.',
      '## Independent review',
      'Fresh-context review is attached or pending for this draft.',
      '## Known limitations',
      'None known.',
      'This PR must be reviewed and merged by `@codeacme17`',
    ].join('\n'),
  }
}

async function recordFixturePr({
  loopRoot,
  run,
  headSha,
  number = 200,
  uiEvidenceRequired = false,
}) {
  const briefPath = path.join(loopRoot, 'handoffs', run.runId, 'implementation-brief.md')
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const brief = await readFile(briefPath, 'utf8')
  await writeFile(
    briefPath,
    brief
      .replace(
        'UI evidence required: UNSET',
        `UI evidence required: ${uiEvidenceRequired ? 'yes' : 'no'}`,
      )
      .replace(
        '<!-- Freeze concrete, testable criteria before invoking $implement. -->',
        'Keyboard behavior is covered by a deterministic regression test.',
      )
      .replace('## In scope\n', '## In scope\n\nKeyboard behavior in the issue scope.\n')
      .replace('## Out of scope\n', '## Out of scope\n\nUnrelated public API changes.\n')
      .replace(
        '## Pre-agreed TDD seams\n',
        '## Pre-agreed TDD seams\n\nKeyboard regression behavior at the component boundary.\n',
      )
      .replace(
        '## Required targeted checks\n',
        '## Required targeted checks\n\n- pnpm test -- keyboard\n',
      )
      .replace(
        '## Required UI evidence\n',
        `## Required UI evidence\n\n${uiEvidenceRequired ? 'Paired before and after captures.' : 'Not required for this non-UI fixture.'}\n`,
      )
      .replace(
        '## Risks and owner-confirmation boundaries\n',
        '## Risks and owner-confirmation boundaries\n\nNo public API or dependency changes.\n',
      ),
    'utf8',
  )
  const frozen = await freezeBrief({ loopRoot, runId: run.runId })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const implementationCommit = '1'.repeat(40)
  const resultPath = path.join(loopRoot, 'logs', 'runs', run.runId, 'implementation-result.json')
  await writeFile(
    resultPath,
    `${JSON.stringify({
      schemaVersion: 1,
      runId: run.runId,
      agent: '$implement',
      invocationId: `impl-${run.runId}`,
      startedAt: '2026-07-22T15:00:00.000Z',
      finishedAt: '2026-07-22T15:30:00.000Z',
      briefDigest: frozen.briefDigest,
      commitSha: implementationCommit,
      checks: [
        { command: 'pnpm test -- keyboard', status: 'passed' },
        { command: 'pnpm verify', status: 'passed' },
      ],
    })}\n`,
    'utf8',
  )
  await recordImplementation({
    loopRoot,
    runId: run.runId,
    resultPath,
    commitRangeValidator: async () => {},
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const prUrl = `https://github.com/codeacme17/echo-ui/pull/${number}`
  await recordPullRequest({
    loopRoot,
    runId: run.runId,
    prUrl,
    headSha,
    githubApi: async (endpoint) =>
      endpoint.includes('/compare/')
        ? { status: 'ahead', base_commit: { sha: implementationCommit } }
        : pullRequestFixture(run, headSha),
    trailingPathValidator: async () => {},
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  return prUrl
}

function successfulWorkflowRun(run, headSha, prNumber, runId) {
  return {
    id: Number(runId),
    status: 'completed',
    conclusion: 'success',
    event: 'pull_request',
    head_sha: headSha,
    head_branch: run.branch,
    path: '.github/workflows/issue-dev-loop-evidence.yml',
    pull_requests: [
      { number: prNumber, base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } } },
    ],
  }
}

async function writePassingEvidence({ loopRoot, run, headSha }) {
  const manifestPath = path.join(loopRoot, 'evidence', run.runId, 'manifest.json')
  await mkdir(path.dirname(manifestPath), { recursive: true })
  const timestamp = '2026-07-22T16:30:00.000Z'
  await writeFile(
    manifestPath,
    `${JSON.stringify({
      schemaVersion: 1,
      runId: run.runId,
      issueNumber: run.issueNumber,
      baseSha: run.baseSha,
      headSha,
      verdict: 'passed',
      checks: [
        {
          command: 'pnpm test -- keyboard',
          status: 'passed',
          exitCode: 0,
          startedAt: timestamp,
          finishedAt: timestamp,
          artifactUrl: null,
        },
        {
          command: 'pnpm verify',
          status: 'passed',
          exitCode: 0,
          startedAt: timestamp,
          finishedAt: timestamp,
          artifactUrl: null,
        },
      ],
      screenshots: [],
      limitations: [],
    })}\n`,
    'utf8',
  )
  return manifestPath
}

async function writePassingReview({ loopRoot, run, headSha, prNumber = 200, reviewId = 300 }) {
  const resultPath = path.join(loopRoot, 'logs', 'runs', run.runId, 'review-result.json')
  await writeFile(
    resultPath,
    `${JSON.stringify({
      schemaVersion: 1,
      runId: run.runId,
      reviewerAgent: 'echo_ui_pr_reviewer',
      freshContext: true,
      headSha,
      verdict: 'PASS',
      rounds: [
        {
          round: 1,
          headSha,
          reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/302#pullrequestreview-500',
          reviewUrl: `https://github.com/codeacme17/echo-ui/pull/${prNumber}#pullrequestreview-${reviewId}`,
          verdict: 'PASS',
          findings: [],
        },
      ],
    })}\n`,
    'utf8',
  )
  return resultPath
}

async function writeFixtureFinalization({
  loopRoot,
  runId,
  status,
  finishedAt,
  mergeSha = null,
  failureFingerprint = null,
}) {
  const run = JSON.parse(
    await readFile(path.join(loopRoot, 'logs', 'runs', runId, 'run.json'), 'utf8'),
  )
  const record = {
    schemaVersion: 1,
    runId,
    issueNumber: run.issueNumber,
    status,
    startedAt: run.startedAt,
    finishedAt,
    prUrl: run.prUrl,
    headSha: run.headSha,
    mergeSha,
    failureFingerprint,
    notificationUrl: ['failed', 'blocked'].includes(status)
      ? `${run.issueUrl}#issuecomment-8800`
      : null,
  }
  const resultPath = path.join(loopRoot, 'logs', 'runs', runId, 'finalization-result.json')
  await writeFile(resultPath, `${canonicalRecord(record)}\n`, 'utf8')
  const digest = recordDigest(record)
  const commentUrl = 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9900'
  const githubApi = async (endpoint) => {
    if (endpoint.includes('/reviews')) {
      return [{ user: { login: 'codeacme17' }, state: 'APPROVED', commit_id: record.headSha }]
    }
    if (endpoint.includes('/pulls/')) {
      return {
        merged: true,
        merged_by: { login: 'codeacme17' },
        merge_commit_sha: record.mergeSha,
        base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } },
        head: {
          ref: `codex/issue-${record.issueNumber}`,
          sha: record.headSha,
          repo: { full_name: 'codeacme17/echo-ui' },
        },
      }
    }
    if (endpoint.endsWith('/issues/comments/8800')) {
      const notificationType = record.status === 'failed' ? 'loop_failed' : 'blocked'
      return {
        user: { login: 'echo-ui-loop[bot]' },
        body: `@codeacme17 **${notificationType}**\n\nRun: \`${runId}\``,
      }
    }
    return {
      user: { login: 'echo-ui-loop[bot]' },
      body: [
        `<!-- issue-dev-loop:finalization:${runId}:sha256:${digest} -->`,
        '```json',
        canonicalRecord(record),
        '```',
      ].join('\n'),
    }
  }
  return { record, resultPath, commentUrl, githubApi }
}

async function publishFixtureFinalization(options) {
  const fixture = await writeFixtureFinalization(options)
  await recordFinalizationPublication({
    loopRoot: options.loopRoot,
    runId: options.runId,
    resultPath: fixture.resultPath,
    commentUrl: fixture.commentUrl,
    githubApi: fixture.githubApi,
    now: new Date(fixture.record.finishedAt),
  })
  return fixture
}

test('selectIssue chooses the highest-priority eligible unclaimed issue', () => {
  const result = selectIssue({
    issues: [
      {
        number: 11,
        title: 'Already claimed',
        createdAt: '2026-01-01T00:00:00Z',
        labels: [{ name: 'codex-ready' }, { name: 'loop:claimed' }],
      },
      {
        number: 12,
        title: 'Medium',
        createdAt: '2026-01-01T00:00:00Z',
        labels: [{ name: 'codex-ready' }, { name: 'priority:medium' }],
      },
      {
        number: 13,
        title: 'Critical',
        createdAt: '2026-02-01T00:00:00Z',
        labels: [{ name: 'codex-ready' }, { name: 'priority:critical' }],
      },
      {
        number: 14,
        title: 'Critical with open PR',
        createdAt: '2025-01-01T00:00:00Z',
        labels: [{ name: 'codex-ready' }, { name: 'priority:critical' }],
      },
    ],
    pullRequests: [{ headRefName: 'codex/issue-14', title: 'Fix issue', body: '' }],
  })

  assert.equal(result.hasWork, true)
  assert.equal(result.issue.number, 13)
})

test('detectWork records a durable no-work trigger check without waking an executor', async () => {
  const { loopRoot } = await createFixture()
  const issuesFile = path.join(loopRoot, 'issues.json')
  const pullsFile = path.join(loopRoot, 'pulls.json')
  await Promise.all([writeFile(issuesFile, '[]\n', 'utf8'), writeFile(pullsFile, '[]\n', 'utf8')])
  const result = await detectWork({
    loopRoot,
    issuesFile,
    pullRequestsFile: pullsFile,
    now: new Date('2026-07-22T14:00:00.000Z'),
  })
  assert.equal(result.hasWork, false)
  const triggerLog = await readFile(path.join(loopRoot, 'logs', 'triggers.jsonl'), 'utf8')
  assert.match(triggerLog, /"event":"trigger_checked"/)
  assert.match(triggerLog, /"hasWork":false/)
})

test('authoritative claim rejects any paginated open PR that references the issue', async () => {
  let labelAdded = false
  await assert.rejects(
    defaultClaimIssue({
      issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
      issueNumber: 128,
      githubApi: async () => ({
        number: 128,
        title: 'Issue',
        state: 'open',
        labels: [{ name: 'codex-ready' }],
      }),
      githubPaginatedApi: async () => [
        { head: { ref: 'feature/other' }, title: 'Existing fix', body: 'Closes #128' },
      ],
      addLabel: async () => {
        labelAdded = true
      },
    }),
    /already claims issue 128/,
  )
  assert.equal(labelAdded, false)
})

test('startRun creates one correlated run, handoff, and evidence directories', async () => {
  const { loopRoot } = await createFixture()
  const result = await startFixtureRun({
    loopRoot,
    issueNumber: 128,
    issueTitle: 'Improve Player focus behavior',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
    now: new Date('2026-07-22T15:30:12Z'),
    entropy: 'a1b2c3',
  })

  assert.equal(result.run.runId, '20260722T153012Z-issue-128-a1b2c3')
  assert.equal(result.run.baseBranch, 'dev')
  assert.equal(result.run.branch, 'codex/issue-128')
  const brief = await readFile(result.briefPath, 'utf8')
  assert.match(brief, /Issue: #128/)
  assert.match(brief, /Stop after committing/)
  const events = await readFile(path.join(result.runPath, 'events.jsonl'), 'utf8')
  assert.match(events, /"type":"loop_started"/)
})

test('startRun refuses a second active run for the same issue', async () => {
  const { loopRoot } = await createFixture()
  await startFixtureRun({
    loopRoot,
    issueNumber: 128,
    issueTitle: 'First claim',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
    entropy: 'first1',
  })
  await assert.rejects(
    startFixtureRun({
      loopRoot,
      issueNumber: 128,
      issueTitle: 'Duplicate claim',
      issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
      entropy: 'second2',
    }),
    /already has an active run/,
  )
})

test('phase advancement requires the latest durable checkpoint', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 146,
    issueTitle: 'Checkpoint gate',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/146',
    entropy: 'check146',
  })
  await assert.rejects(freezeBrief({ loopRoot, runId: run.runId }), /requires a durable checkpoint/)
})

test('frozen brief rejects empty scope, TDD, checks, evidence, risk, and stop sections', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 147,
    issueTitle: 'Complete brief gate',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/147',
    entropy: 'brief147',
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const briefPath = path.join(loopRoot, 'handoffs', run.runId, 'implementation-brief.md')
  const brief = await readFile(briefPath, 'utf8')
  await writeFile(
    briefPath,
    brief
      .replace('UI evidence required: UNSET', 'UI evidence required: no')
      .replace(
        '<!-- Freeze concrete, testable criteria before invoking $implement. -->',
        'The requested behavior has a deterministic regression assertion.',
      ),
    'utf8',
  )
  await assert.rejects(
    freezeBrief({ loopRoot, runId: run.runId }),
    /requires a concrete In scope section/,
  )
})

test('automation identity cannot overlap the repository owner', async () => {
  const { loopRoot, channelRoot } = await createFixture()
  const channelPath = path.join(channelRoot, 'channel.json')
  const channel = JSON.parse(await readFile(channelPath, 'utf8'))
  await writeFile(
    channelPath,
    `${JSON.stringify({ ...channel, automationGitHubLogin: 'codeacme17' })}\n`,
    'utf8',
  )
  await assert.rejects(
    assertAutomationIdentity({ loopRoot, githubApi: async () => ({ login: 'codeacme17' }) }),
    /identities must be distinct/,
  )
})

test('startRun rolls back a remote claim when the authoritative snapshot is invalid', async () => {
  const { loopRoot } = await createFixture()
  let released = false
  await assert.rejects(
    startRun({
      loopRoot,
      issueNumber: 128,
      issueTitle: 'Selected title',
      issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
      baseSha: '0'.repeat(40),
      entropy: 'rollback1',
      claimIssue: async () => ({
        number: 999,
        title: 'Wrong issue',
        labels: [{ name: 'codex-ready' }],
      }),
      releaseIssueClaim: async () => {
        released = true
      },
    }),
    /snapshot does not match/,
  )
  assert.equal(released, true)
})

test('frozen brief and $implement invocation history cannot be rewritten or reused', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 138,
    issueTitle: 'Immutable implementation handoff',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/138',
    entropy: 'impl138',
  })
  const firstHead = '3'.repeat(40)
  const prUrl = await recordFixturePr({ loopRoot, run, headSha: firstHead, number: 308 })
  const currentRun = JSON.parse(
    await readFile(path.join(loopRoot, 'logs', 'runs', run.runId, 'run.json'), 'utf8'),
  )
  const secondCommit = '2'.repeat(40)
  const secondResultPath = path.join(
    loopRoot,
    'logs',
    'runs',
    run.runId,
    'implementation-result-2.json',
  )
  const secondResult = {
    schemaVersion: 1,
    runId: run.runId,
    agent: '$implement',
    invocationId: 'impl-second',
    startedAt: '2026-07-22T16:00:00.000Z',
    finishedAt: '2026-07-22T16:30:00.000Z',
    briefDigest: currentRun.briefDigest,
    commitSha: secondCommit,
    checks: [
      { command: 'pnpm test -- keyboard', status: 'passed' },
      { command: 'pnpm verify', status: 'passed' },
    ],
  }
  await writeFile(secondResultPath, `${JSON.stringify(secondResult)}\n`, 'utf8')
  let checkedRange
  await recordImplementation({
    loopRoot,
    runId: run.runId,
    resultPath: secondResultPath,
    commitRangeValidator: async (range) => {
      checkedRange = range
    },
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  assert.equal(checkedRange.ancestor, '1'.repeat(40))
  assert.equal(checkedRange.descendant, secondCommit)

  const duplicateInvocationPath = path.join(
    loopRoot,
    'logs',
    'runs',
    run.runId,
    'implementation-result-3.json',
  )
  await writeFile(
    duplicateInvocationPath,
    `${JSON.stringify({ ...secondResult, commitSha: '4'.repeat(40) })}\n`,
    'utf8',
  )
  await assert.rejects(
    recordImplementation({
      loopRoot,
      runId: run.runId,
      resultPath: duplicateInvocationPath,
      commitRangeValidator: async () => {},
    }),
    /must be unique/,
  )

  const updatedHead = '5'.repeat(40)
  let checkedTrailingRange
  const rebound = await recordPullRequest({
    loopRoot,
    runId: run.runId,
    prUrl,
    headSha: updatedHead,
    githubApi: async (endpoint) =>
      endpoint.includes('/compare/')
        ? { status: 'ahead', base_commit: { sha: secondCommit } }
        : pullRequestFixture(run, updatedHead, { draft: false }),
    trailingPathValidator: async (range) => {
      checkedTrailingRange = range
    },
  })
  assert.equal(rebound.headSha, updatedHead)
  assert.equal(checkedTrailingRange.ancestor, secondCommit)
  assert.equal(checkedTrailingRange.descendant, updatedHead)
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })

  await assert.rejects(
    recordPullRequest({
      loopRoot,
      runId: run.runId,
      prUrl,
      headSha: '6'.repeat(40),
      githubApi: async (endpoint) =>
        endpoint.includes('/compare/')
          ? { status: 'ahead', base_commit: { sha: secondCommit } }
          : pullRequestFixture(run, '6'.repeat(40), { draft: false }),
      trailingPathValidator: async () => {
        throw new Error('product changes after the recorded $implement commit are forbidden')
      },
    }),
    /product changes after the recorded \$implement commit are forbidden/,
  )

  const briefPath = path.join(loopRoot, 'handoffs', run.runId, 'implementation-brief.md')
  await writeFile(
    briefPath,
    `${await readFile(briefPath, 'utf8')}\nMutated after freeze.\n`,
    'utf8',
  )
  await assert.rejects(
    recordPullRequest({
      loopRoot,
      runId: run.runId,
      prUrl,
      headSha: '6'.repeat(40),
      githubApi: async () => pullRequestFixture(run, '6'.repeat(40), { draft: false }),
    }),
    /brief changed after freeze-brief/,
  )
})

test('recordEvidence rejects failed workflow runs and mismatched artifact manifests', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 134,
    issueTitle: 'Artifact attestation',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/134',
    entropy: 'art134',
  })
  const headSha = 'a'.repeat(40)
  await recordFixturePr({ loopRoot, run, headSha, number: 301 })
  const manifestPath = await writePassingEvidence({ loopRoot, run, headSha })
  const manifestSource = await readFile(manifestPath, 'utf8')
  const artifact = {
    id: 900,
    name: `issue-dev-loop-${run.runId}-${headSha}`,
    expired: false,
    workflow_run: { id: 800, head_sha: headSha },
  }
  const githubApi = async (endpoint) =>
    endpoint.includes('/actions/artifacts/')
      ? artifact
      : { ...successfulWorkflowRun(run, headSha, 301, 800), conclusion: 'failure' }

  await assert.rejects(
    recordEvidence({
      loopRoot,
      runId: run.runId,
      manifestPath,
      publicationUrl: 'https://github.com/codeacme17/echo-ui/actions/runs/800/artifacts/900',
      githubApi,
      artifactManifestLoader: async () => manifestSource,
    }),
    /artifact metadata does not match/,
  )
  await assert.rejects(
    recordEvidence({
      loopRoot,
      runId: run.runId,
      manifestPath,
      publicationUrl: 'https://github.com/codeacme17/echo-ui/actions/runs/800/artifacts/900',
      githubApi: async (endpoint) =>
        endpoint.includes('/actions/artifacts/')
          ? artifact
          : successfulWorkflowRun(run, headSha, 301, 800),
      artifactManifestLoader: async () => `${manifestSource} `,
    }),
    /does not match the published artifact manifest/,
  )
})

test('recordPullRequest rejects empty review sections even when metadata markers exist', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 149,
    issueTitle: 'PR content gate',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/149',
    entropy: 'pr149',
  })
  const originalHead = '3'.repeat(40)
  const prUrl = await recordFixturePr({ loopRoot, run, headSha: originalHead, number: 349 })
  const nextHead = '4'.repeat(40)
  const incomplete = pullRequestFixture(run, nextHead, { draft: false })
  incomplete.body = incomplete.body.replace(
    '## Evidence\nExact-head workflow evidence is attached or pending for this draft.',
    '## Evidence\n',
  )
  await assert.rejects(
    recordPullRequest({
      loopRoot,
      runId: run.runId,
      prUrl,
      headSha: nextHead,
      githubApi: async (endpoint) =>
        endpoint.includes('/compare/')
          ? { status: 'ahead', base_commit: { sha: '1'.repeat(40) } }
          : incomplete,
      trailingPathValidator: async () => {},
    }),
    /requires a non-empty Evidence section/,
  )
})

test('CI helpers resolve a run and generate exact-head screenshot evidence', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 128,
    issueTitle: 'Capture Player UI',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
    entropy: 'c1e2e3',
  })
  const headSha = 'b'.repeat(40)
  await recordFixturePr({
    loopRoot,
    run,
    headSha,
    number: 303,
    uiEvidenceRequired: true,
  })
  const beforePath = `screen-shots/${run.runId}/before/player.png`
  const screenshotRelativePath = `screen-shots/${run.runId}/after/player.png`
  const meaningfulPng = await readFile(
    path.resolve(repositoryLoopRoot, '..', '..', 'docs', 'public', 'temp.png'),
  )
  await Promise.all([
    writeFile(path.join(loopRoot, beforePath), meaningfulPng),
    writeFile(path.join(loopRoot, screenshotRelativePath), meaningfulPng),
  ])
  const capturedAt = '2026-07-22T16:05:00.000Z'
  await writeFile(
    path.join(loopRoot, 'screen-shots', run.runId, 'manifest.json'),
    `${JSON.stringify({
      screenshots: [
        {
          name: 'Player before',
          phase: 'before',
          scenario: 'Keyboard focus',
          route: '/player',
          viewport: '1280x720',
          path: beforePath,
          capturedAt,
          sourceSha: run.baseSha,
        },
        {
          name: 'Player after',
          phase: 'after',
          scenario: 'Keyboard focus',
          route: '/player',
          viewport: '1280x720',
          path: screenshotRelativePath,
          capturedAt,
          sourceSha: '1'.repeat(40),
        },
      ],
    })}\n`,
    'utf8',
  )

  const resolveResult = await execFileAsync(process.execPath, [
    path.join(repositoryLoopRoot, 'scripts', 'resolve-run.mjs'),
    '--loop-root',
    loopRoot,
    '--branch',
    run.branch,
  ])
  assert.equal(JSON.parse(resolveResult.stdout).runId, run.runId)

  const output = path.join(loopRoot, 'evidence', run.runId, 'manifest.json')
  await execFileAsync(process.execPath, [
    path.join(repositoryLoopRoot, 'scripts', 'generate-evidence.mjs'),
    '--loop-root',
    loopRoot,
    '--run-id',
    run.runId,
    '--head-sha',
    headSha,
    '--status',
    'passed',
    '--started-at',
    '2026-07-22T16:00:00Z',
    '--finished-at',
    '2026-07-22T16:10:00Z',
    '--output',
    output,
  ])
  const evidence = JSON.parse(await readFile(output, 'utf8'))
  assert.equal(evidence.headSha, headSha)
  assert.equal(evidence.screenshots[1].path, screenshotRelativePath)
  assert.equal(evidence.screenshots[1].width, 937)
  assert.equal(evidence.screenshots[1].height, 569)
  assert.match(evidence.screenshots[1].sha256, /^[0-9a-f]{64}$/)
})

test('owner-ready transition requires verification and review but remains resumable', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 129,
    issueTitle: 'Add keyboard test',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/129',
    now: new Date('2026-07-22T16:00:00Z'),
    entropy: 'abc123',
  })
  const headSha = 'c'.repeat(40)
  const prUrl = await recordFixturePr({ loopRoot, run, headSha, number: 200 })
  const manifestPath = await writePassingEvidence({
    loopRoot,
    run,
    headSha,
  })
  const manifestSource = await readFile(manifestPath, 'utf8')
  await recordEvidence({
    loopRoot,
    runId: run.runId,
    manifestPath,
    publicationUrl: 'https://github.com/codeacme17/echo-ui/actions/runs/101/artifacts/201',
    githubApi: async (endpoint) =>
      endpoint.includes('/actions/artifacts/')
        ? {
            id: 201,
            name: `issue-dev-loop-${run.runId}-${headSha}`,
            expired: false,
            workflow_run: { id: 101, head_sha: headSha },
          }
        : successfulWorkflowRun(run, headSha, 200, 101),
    artifactManifestLoader: async () => manifestSource,
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const reviewPath = await writePassingReview({
    loopRoot,
    run,
    headSha,
  })
  const reviewDigest = createHash('sha256')
    .update(await readFile(reviewPath, 'utf8'))
    .digest('hex')
  await recordReview({
    loopRoot,
    runId: run.runId,
    resultPath: reviewPath,
    reviewUrl: `${prUrl}#pullrequestreview-300`,
    githubApi: async (endpoint) => {
      if (endpoint.includes('/comments?')) return []
      if (endpoint.endsWith('/pulls/200')) return pullRequestFixture(run, headSha)
      return {
        commit_id: headSha,
        state: 'COMMENTED',
        submitted_at: '2026-07-22T17:00:00.000Z',
        user: { login: 'echo-ui-reviewer[bot]' },
        body: [
          'PASS',
          `<!-- issue-dev-loop:${run.runId}:review-round:1:head:${headSha} -->`,
          `<!-- issue-dev-loop:${run.runId}:review-result-sha256:${reviewDigest} -->`,
        ].join('\n'),
      }
    },
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })

  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
    }),
    /invalid run status transition/,
  )
  await createNotification({
    loopRoot,
    runId: run.runId,
    type: 'pr_ready_for_review',
    summary: 'Exact-head checks and independent review passed',
    requestedAction: 'Review and merge or request changes',
    targetUrl: prUrl,
    evidenceUrl: 'https://github.com/codeacme17/echo-ui/actions/runs/101/artifacts/201',
    blocking: true,
    githubComment: async () => {},
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })

  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
      githubApi: async () => ({
        state: 'open',
        draft: false,
        base: { ref: 'main' },
        head: { ref: run.branch, sha: headSha, repo: { full_name: 'codeacme17/echo-ui' } },
      }),
    }),
    /live ready PR to dev/,
  )

  const paused = await transitionRun({
    loopRoot,
    runId: run.runId,
    status: 'awaiting_owner_review',
    prUrl,
    headSha,
    now: new Date('2026-07-22T17:00:00Z'),
    githubApi: async () => ({
      state: 'open',
      draft: false,
      base: { ref: 'dev' },
      head: { ref: run.branch, sha: headSha, repo: { full_name: 'codeacme17/echo-ui' } },
    }),
  })
  assert.equal(paused.status, 'awaiting_owner_review')
  assert.equal(paused.finishedAt, null)

  await assert.rejects(
    appendEvent({
      loopRoot,
      runId: run.runId,
      type: 'pr_merged',
      status: 'observed',
      payload: { actor: 'codeacme17', mergeSha: '9'.repeat(40) },
    }),
    /reserved/,
  )

  await assert.rejects(
    observeOwnerMerge({
      loopRoot,
      runId: run.runId,
      githubApi: async (endpoint) =>
        endpoint.includes('/reviews')
          ? [
              {
                user: { login: 'codeacme17' },
                state: 'APPROVED',
                commit_id: headSha,
              },
            ]
          : {
              merged: true,
              merged_by: { login: 'someone-else' },
              ...pullRequestFixture(run, headSha, { draft: false, merged: true }),
              merged_by: { login: 'someone-else' },
              merge_commit_sha: '9'.repeat(40),
            },
    }),
    /not approved and merged by the configured owner/,
  )

  await assert.rejects(
    observeOwnerMerge({
      loopRoot,
      runId: run.runId,
      githubApi: async (endpoint) =>
        endpoint.includes('/reviews')
          ? [{ user: { login: 'codeacme17' }, state: 'APPROVED', commit_id: headSha }]
          : {
              ...pullRequestFixture(run, headSha, { draft: false, merged: true }),
              base: { ref: 'main', repo: { full_name: 'codeacme17/echo-ui' } },
            },
    }),
    /not approved and merged by the configured owner/,
  )

  const completionJournal = await writeFixtureFinalization({
    loopRoot,
    runId: run.runId,
    status: 'completed',
    finishedAt: '2026-07-23T09:00:00.000Z',
    mergeSha: '9'.repeat(40),
  })
  const finalized = await observeOwnerMerge({
    loopRoot,
    runId: run.runId,
    now: new Date('2026-07-23T09:00:00Z'),
    githubApi: async (endpoint) =>
      endpoint.includes('/reviews')
        ? [
            {
              user: { login: 'codeacme17' },
              state: 'APPROVED',
              commit_id: headSha,
            },
          ]
        : {
            ...pullRequestFixture(run, headSha, { draft: false, merged: true }),
          },
    releaseIssueClaim: async () => {},
    finalizationResultPath: completionJournal.resultPath,
    finalizationCommentUrl: completionJournal.commentUrl,
    recordFinalization: (options) =>
      recordFinalizationPublication({ ...options, githubApi: completionJournal.githubApi }),
  })
  assert.equal(finalized.status, 'completed')
  assert.equal(finalized.mergeSha, '9'.repeat(40))
  assert.equal(finalized.finishedAt, '2026-07-23T09:00:00.000Z')
})

test('completed finalization cannot bypass the owner-ready gate', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 130,
    issueTitle: 'Owner gate',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/130',
    entropy: 'deaf01',
  })
  await assert.rejects(
    finalizeRun({
      loopRoot,
      runId: run.runId,
      status: 'completed',
      mergeSha: '9'.repeat(40),
    }),
    /invalid run status transition/,
  )
})

test('forged local owner events cannot bypass the remote completion gate', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 148,
    issueTitle: 'Remote completion proof',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/148',
    entropy: 'merge148',
  })
  const headSha = '8'.repeat(40)
  await recordFixturePr({ loopRoot, run, headSha, number: 348 })
  const runPath = path.join(loopRoot, 'logs', 'runs', run.runId)
  const runFile = path.join(runPath, 'run.json')
  const current = JSON.parse(await readFile(runFile, 'utf8'))
  await writeFile(
    runFile,
    `${JSON.stringify({ ...current, status: 'awaiting_owner_review' })}\n`,
    'utf8',
  )
  const eventsFile = path.join(runPath, 'events.jsonl')
  const existingEvents = await readFile(eventsFile, 'utf8')
  const mergeSha = '9'.repeat(40)
  const forged = [
    {
      schemaVersion: 1,
      runId: run.runId,
      type: 'owner_review_approved',
      timestamp: '2030-01-01T00:00:00.000Z',
      status: 'observed',
      payload: { actor: 'codeacme17', headSha },
    },
    {
      schemaVersion: 1,
      runId: run.runId,
      type: 'pr_merged',
      timestamp: '2030-01-01T00:00:01.000Z',
      status: 'observed',
      payload: { actor: 'codeacme17', headSha, mergeSha },
    },
    {
      schemaVersion: 1,
      runId: run.runId,
      type: 'finalization_published',
      timestamp: '2030-01-01T00:00:02.000Z',
      status: 'completed',
      payload: {
        mergeSha,
        failureFingerprint: null,
        finishedAt: '2030-01-01T00:00:02.000Z',
      },
    },
  ]
  await writeFile(
    eventsFile,
    `${existingEvents}${forged.map((event) => JSON.stringify(event)).join('\n')}\n`,
    'utf8',
  )
  let released = false
  await assert.rejects(
    finalizeRun({
      loopRoot,
      runId: run.runId,
      status: 'completed',
      mergeSha,
      githubApi: async (endpoint) =>
        endpoint.includes('/reviews')
          ? [{ user: { login: 'codeacme17' }, state: 'APPROVED', commit_id: headSha }]
          : {
              ...pullRequestFixture(run, headSha, { draft: false }),
              merged: false,
              merged_by: null,
              merge_commit_sha: null,
            },
      releaseIssueClaim: async () => {
        released = true
      },
    }),
    /not approved and merged by the configured owner/,
  )
  assert.equal(released, false)

  await writeFile(
    runFile,
    `${JSON.stringify({
      ...current,
      status: 'completed',
      finishedAt: '2030-01-01T00:00:02.000Z',
      mergeSha,
    })}\n`,
    'utf8',
  )
  await writeFile(
    eventsFile,
    `${existingEvents}${[
      ...forged,
      {
        schemaVersion: 1,
        runId: run.runId,
        type: 'run_finalization_authorized',
        timestamp: '2030-01-01T00:00:03.000Z',
        status: 'completed',
        payload: {
          previousStatus: 'awaiting_owner_review',
          finishedAt: '2030-01-01T00:00:02.000Z',
          failureFingerprint: null,
        },
      },
    ]
      .map((event) => JSON.stringify(event))
      .join('\n')}\n`,
    'utf8',
  )
  await assert.rejects(
    finalizeRun({
      loopRoot,
      runId: run.runId,
      status: 'completed',
      mergeSha,
      githubApi: async (endpoint) =>
        endpoint.includes('/reviews')
          ? [{ user: { login: 'codeacme17' }, state: 'APPROVED', commit_id: headSha }]
          : {
              ...pullRequestFixture(run, headSha, { draft: false }),
              merged: false,
              merged_by: null,
              merge_commit_sha: null,
            },
      releaseIssueClaim: async () => {
        released = true
      },
    }),
    /not approved and merged by the configured owner/,
  )
  assert.equal(released, false)
})

test('review gate verifies published findings and classified replies', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 133,
    issueTitle: 'Review response proof',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/133',
    entropy: 'rev133',
  })
  const headSha = 'd'.repeat(40)
  await recordFixturePr({ loopRoot, run, headSha, number: 300 })
  const resultPath = path.join(loopRoot, 'logs', 'runs', run.runId, 'review-result.json')
  await writeFile(
    resultPath,
    `${JSON.stringify({
      schemaVersion: 1,
      runId: run.runId,
      reviewerAgent: 'echo_ui_pr_reviewer',
      freshContext: true,
      headSha,
      verdict: 'PASS',
      rounds: [
        {
          round: 1,
          headSha: 'e'.repeat(40),
          reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/300#pullrequestreview-499',
          verdict: 'CHANGES_REQUESTED',
          findings: [
            {
              findingId: 'RVW-1-1',
              severity: 'P2',
              confidence: 'high',
              headSha: 'e'.repeat(40),
              path: 'src/keyboard.ts',
              line: 12,
              problem: 'Incorrect assertion',
              evidence: 'The runtime check already guarantees this invariant.',
              expectedResolution: 'Prove or fix the assertion.',
              resolution: {
                classification: 'rejected',
                responseUrl: 'https://github.com/codeacme17/echo-ui/pull/300#issuecomment-400',
                evidence: 'Reproduction command exits successfully.',
              },
            },
          ],
        },
        {
          round: 2,
          headSha,
          reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/300#pullrequestreview-500',
          verdict: 'PASS',
          findings: [],
        },
      ],
    })}\n`,
    'utf8',
  )
  const digest = createHash('sha256')
    .update(await readFile(resultPath, 'utf8'))
    .digest('hex')
  const recorded = await recordReview({
    loopRoot,
    runId: run.runId,
    resultPath,
    reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/300#pullrequestreview-500',
    githubApi: async (endpoint) => {
      if (endpoint.endsWith('/reviews/499/comments?per_page=100')) {
        return [
          {
            path: 'src/keyboard.ts',
            line: 12,
            body: [
              'RVW-1-1',
              'P2',
              'high',
              'Incorrect assertion',
              'The runtime check already guarantees this invariant.',
              'Prove or fix the assertion.',
              `<!-- issue-dev-loop:${run.runId}:RVW-1-1 -->`,
            ].join('\n'),
          },
        ]
      }
      if (endpoint.endsWith('/comments?per_page=100')) return []
      if (endpoint.includes('/issues/comments/400')) {
        return {
          user: { login: 'echo-ui-loop[bot]' },
          created_at: '2026-07-22T17:00:00.000Z',
          body: `Rejected with proof. Reproduction command exits successfully.\n<!-- issue-dev-loop:${run.runId}:RVW-1-1:rejected -->`,
        }
      }
      if (endpoint.endsWith('/pulls/300')) return pullRequestFixture(run, headSha)
      const firstRound = endpoint.includes('/reviews/499')
      return {
        commit_id: firstRound ? 'e'.repeat(40) : headSha,
        state: 'COMMENTED',
        submitted_at: firstRound ? '2026-07-22T16:00:00.000Z' : '2026-07-22T18:00:00.000Z',
        user: { login: 'echo-ui-reviewer[bot]' },
        body: firstRound
          ? [
              'RVW-1-1',
              'P2',
              'high',
              'Incorrect assertion',
              'The runtime check already guarantees this invariant.',
              'Prove or fix the assertion.',
              `<!-- issue-dev-loop:${run.runId}:RVW-1-1 -->`,
              `<!-- issue-dev-loop:${run.runId}:review-round:1:head:${'e'.repeat(40)} -->`,
            ].join('\n')
          : [
              'PASS',
              `<!-- issue-dev-loop:${run.runId}:review-round:2:head:${headSha} -->`,
              `<!-- issue-dev-loop:${run.runId}:review-result-sha256:${digest} -->`,
            ].join('\n'),
      }
    },
  })
  assert.equal(recorded.findingCount, 1)
  assert.equal(recorded.rounds, 2)
})

test('accepted review fix must be after the finding head and inside the final head', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 136,
    issueTitle: 'Accepted review repair',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/136',
    entropy: 'rev136',
  })
  const findingHead = 'a'.repeat(40)
  const fixCommit = 'b'.repeat(40)
  const headSha = 'c'.repeat(40)
  await recordFixturePr({ loopRoot, run, headSha, number: 304 })
  const recordedRun = JSON.parse(
    await readFile(path.join(loopRoot, 'logs', 'runs', run.runId, 'run.json'), 'utf8'),
  )
  const repairResultPath = path.join(
    loopRoot,
    'logs',
    'runs',
    run.runId,
    'implementation-result-review-fix.json',
  )
  await writeFile(
    repairResultPath,
    `${JSON.stringify({
      schemaVersion: 1,
      runId: run.runId,
      agent: '$implement',
      invocationId: 'impl-review-fix',
      startedAt: '2026-07-22T17:00:00.000Z',
      finishedAt: '2026-07-22T17:30:00.000Z',
      briefDigest: recordedRun.briefDigest,
      commitSha: fixCommit,
      checks: [
        { command: 'pnpm test -- keyboard', status: 'passed' },
        { command: 'pnpm verify', status: 'passed' },
      ],
    })}\n`,
    'utf8',
  )
  await recordImplementation({
    loopRoot,
    runId: run.runId,
    resultPath: repairResultPath,
    commitRangeValidator: async () => {},
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const resultPath = path.join(loopRoot, 'logs', 'runs', run.runId, 'review-result.json')
  const result = {
    schemaVersion: 1,
    runId: run.runId,
    reviewerAgent: 'echo_ui_pr_reviewer',
    freshContext: true,
    headSha,
    verdict: 'PASS',
    rounds: [
      {
        round: 1,
        headSha: findingHead,
        reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/304#pullrequestreview-509',
        verdict: 'CHANGES_REQUESTED',
        findings: [
          {
            findingId: 'RVW-1-1',
            severity: 'P2',
            confidence: 'high',
            headSha: findingHead,
            problem: 'Missing guard',
            evidence: 'The failure is reproducible.',
            expectedResolution: 'Add the guard.',
            resolution: {
              classification: 'accepted',
              responseUrl: 'https://github.com/codeacme17/echo-ui/pull/304#issuecomment-410',
              evidence: 'pnpm verify passes after the guard.',
              fixCommit,
            },
          },
        ],
      },
      {
        round: 2,
        headSha,
        reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/304#pullrequestreview-510',
        verdict: 'PASS',
        findings: [],
      },
    ],
  }
  await writeFile(resultPath, `${JSON.stringify(result)}\n`, 'utf8')
  const digest = createHash('sha256')
    .update(await readFile(resultPath, 'utf8'))
    .digest('hex')
  const recorded = await recordReview({
    loopRoot,
    runId: run.runId,
    resultPath,
    reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/304#pullrequestreview-510',
    githubApi: async (endpoint) => {
      if (endpoint.endsWith('/comments?per_page=100')) return []
      if (endpoint.includes('/issues/comments/410')) {
        return {
          user: { login: 'echo-ui-loop[bot]' },
          created_at: '2026-07-22T17:40:00.000Z',
          body: `pnpm verify passes after the guard. ${fixCommit}\n<!-- issue-dev-loop:${run.runId}:RVW-1-1:accepted -->`,
        }
      }
      if (endpoint.endsWith(`/compare/${findingHead}...${fixCommit}`)) {
        return { status: 'ahead', base_commit: { sha: findingHead } }
      }
      if (endpoint.endsWith(`/compare/${fixCommit}...${headSha}`)) {
        return { status: 'ahead', base_commit: { sha: fixCommit } }
      }
      if (endpoint.endsWith('/pulls/304')) return pullRequestFixture(run, headSha)
      const firstRound = endpoint.includes('/reviews/509')
      return {
        commit_id: firstRound ? findingHead : headSha,
        state: 'COMMENTED',
        submitted_at: firstRound ? '2026-07-22T16:00:00.000Z' : '2026-07-22T18:00:00.000Z',
        user: { login: 'echo-ui-reviewer[bot]' },
        body: firstRound
          ? [
              'RVW-1-1',
              'P2',
              'high',
              'Missing guard',
              'The failure is reproducible.',
              'Add the guard.',
              `<!-- issue-dev-loop:${run.runId}:RVW-1-1 -->`,
              `<!-- issue-dev-loop:${run.runId}:review-round:1:head:${findingHead} -->`,
            ].join('\n')
          : [
              'PASS',
              `<!-- issue-dev-loop:${run.runId}:review-round:2:head:${headSha} -->`,
              `<!-- issue-dev-loop:${run.runId}:review-result-sha256:${digest} -->`,
            ].join('\n'),
      }
    },
  })
  assert.equal(recorded.findingCount, 1)
})

test('review gate binds high-severity adjudication verdict to the correct identity', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 135,
    issueTitle: 'High severity review dispute',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/135',
    entropy: 'rev135',
  })
  const headSha = 'f'.repeat(40)
  await recordFixturePr({ loopRoot, run, headSha, number: 302 })
  const resultPath = path.join(loopRoot, 'logs', 'runs', run.runId, 'review-result.json')
  await writeFile(
    resultPath,
    `${JSON.stringify({
      schemaVersion: 1,
      runId: run.runId,
      reviewerAgent: 'echo_ui_pr_reviewer',
      freshContext: true,
      headSha,
      verdict: 'PASS',
      rounds: [
        {
          round: 1,
          headSha,
          reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/302#pullrequestreview-500',
          verdict: 'CHANGES_REQUESTED',
          findings: [
            {
              findingId: 'RVW-1-1',
              severity: 'P1',
              confidence: 'high',
              headSha,
              problem: 'Potential public API break',
              evidence: 'The export changed.',
              expectedResolution: 'Restore compatibility or adjudicate.',
              resolution: {
                classification: 'rejected',
                responseUrl: 'https://github.com/codeacme17/echo-ui/pull/302#issuecomment-401',
                evidence: 'Executor disagrees.',
                adjudicationUrl: 'https://github.com/codeacme17/echo-ui/pull/302#issuecomment-402',
                adjudicationVerdict: 'OWNER_REJECTED_FINDING',
              },
            },
          ],
        },
        {
          round: 2,
          headSha,
          reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/302#pullrequestreview-501',
          verdict: 'PASS',
          findings: [],
        },
      ],
    })}\n`,
    'utf8',
  )
  const digest = createHash('sha256')
    .update(await readFile(resultPath, 'utf8'))
    .digest('hex')
  await assert.rejects(
    recordReview({
      loopRoot,
      runId: run.runId,
      resultPath,
      reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/302#pullrequestreview-501',
      githubApi: async (endpoint) => {
        if (endpoint.endsWith('/comments?per_page=100')) return []
        if (endpoint.includes('/issues/comments/401')) {
          return {
            user: { login: 'echo-ui-loop[bot]' },
            created_at: '2026-07-22T17:00:00.000Z',
            body: `Executor disagrees.\n<!-- issue-dev-loop:${run.runId}:RVW-1-1:rejected -->`,
          }
        }
        if (endpoint.includes('/issues/comments/402')) {
          return {
            user: { login: 'echo-ui-reviewer[bot]' },
            created_at: '2026-07-22T17:10:00.000Z',
            body: `<!-- issue-dev-loop:${run.runId}:RVW-1-1:adjudication:OWNER_REJECTED_FINDING -->`,
          }
        }
        if (endpoint.endsWith('/pulls/302')) return pullRequestFixture(run, headSha)
        const firstRound = endpoint.includes('/reviews/500')
        return {
          commit_id: headSha,
          state: 'COMMENTED',
          submitted_at: firstRound ? '2026-07-22T16:00:00.000Z' : '2026-07-22T18:00:00.000Z',
          user: { login: 'echo-ui-reviewer[bot]' },
          body: firstRound
            ? [
                'RVW-1-1',
                'P1',
                'high',
                'Potential public API break',
                'The export changed.',
                'Restore compatibility or adjudicate.',
                `<!-- issue-dev-loop:${run.runId}:RVW-1-1 -->`,
                `<!-- issue-dev-loop:${run.runId}:review-round:1:head:${headSha} -->`,
              ].join('\n')
            : [
                'PASS',
                `<!-- issue-dev-loop:${run.runId}:review-round:2:head:${headSha} -->`,
                `<!-- issue-dev-loop:${run.runId}:review-result-sha256:${digest} -->`,
              ].join('\n'),
        }
      },
    }),
    /lacks independent published adjudication/,
  )
})

test('notification dry-run is auditable but never counts as owner delivery', async () => {
  const { loopRoot, channelRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 131,
    issueTitle: 'Notify owner',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/131',
    entropy: 'b00b1e',
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const notification = await createNotification({
    loopRoot,
    runId: run.runId,
    type: 'clarification_required',
    summary: 'Acceptance criterion is ambiguous',
    requestedAction: 'Clarify expected keyboard behavior',
    targetUrl: run.issueUrl,
    blocking: true,
    dryRun: true,
    now: new Date('2026-07-22T18:00:00Z'),
    entropy: 'c0ffee',
    environment: {},
  })

  assert.equal(notification.notificationId, 'NTF-20260722T180000-C0FFEE')
  assert.equal(notification.delivery.github, 'dry_run')
  const staged = JSON.parse(
    await readFile(path.join(channelRoot, 'outbox', `${notification.notificationId}.json`), 'utf8'),
  )
  assert.equal(staged.runId, run.runId)
  const paused = JSON.parse(
    await readFile(path.join(loopRoot, 'logs', 'runs', run.runId, 'run.json'), 'utf8'),
  )
  assert.equal(paused.status, 'running')
  const events = await readFile(
    path.join(loopRoot, 'logs', 'runs', run.runId, 'events.jsonl'),
    'utf8',
  )
  assert.match(events, /"type":"notification_dry_run"/)
  assert.doesNotMatch(events, /"type":"owner_notified"/)
})

test('failed blocking delivery still pauses for the owner', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 132,
    issueTitle: 'Needs clarification',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/132',
    entropy: 'badbee',
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  await assert.rejects(
    createNotification({
      loopRoot,
      runId: run.runId,
      type: 'clarification_required',
      summary: 'Acceptance criterion is ambiguous',
      requestedAction: 'Clarify expected keyboard behavior',
      targetUrl: run.issueUrl,
      blocking: true,
      environment: {},
      githubComment: async () => {
        throw new Error('offline')
      },
    }),
    /blocking notification was not delivered/,
  )
  const paused = JSON.parse(
    await readFile(path.join(loopRoot, 'logs', 'runs', run.runId, 'run.json'), 'utf8'),
  )
  assert.equal(paused.status, 'waiting_for_owner')
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  await assert.rejects(
    transitionRun({ loopRoot, runId: run.runId, status: 'running' }),
    /observed owner response/,
  )
  const responseUrl = `${run.issueUrl}#issuecomment-500`
  await assert.rejects(
    recordOwnerResponse({
      loopRoot,
      runId: run.runId,
      responseUrl,
      githubApi: async () => ({
        user: { login: 'someone-else' },
        body: `Proceed with option A. RESUME ${run.runId}`,
        created_at: '2030-01-01T00:00:00.000Z',
      }),
    }),
    /configured owner/,
  )
  await assert.rejects(
    recordOwnerResponse({
      loopRoot,
      runId: run.runId,
      responseUrl,
      githubApi: async () => ({
        user: { login: 'codeacme17' },
        body: `Proceed with option A. RESUME ${run.runId}`,
        created_at: '2030-01-01T00:00:00.000Z',
      }),
    }),
    /after successful delivery/,
  )
  await createNotification({
    loopRoot,
    runId: run.runId,
    type: 'clarification_required',
    summary: 'Acceptance criterion is still ambiguous',
    requestedAction: 'Clarify expected keyboard behavior',
    targetUrl: run.issueUrl,
    blocking: true,
    now: new Date('2030-01-01T00:01:00.000Z'),
    githubComment: async () => {},
  })
  await assert.rejects(
    recordOwnerResponse({
      loopRoot,
      runId: run.runId,
      responseUrl,
      githubApi: async () => ({
        user: { login: 'codeacme17' },
        body: 'Proceed with option A.',
        created_at: '2030-01-01T00:02:00.000Z',
      }),
    }),
    /run-bound decision/,
  )
  await recordOwnerResponse({
    loopRoot,
    runId: run.runId,
    responseUrl,
    githubApi: async () => ({
      user: { login: 'codeacme17' },
      body: `Proceed with option A. RESUME ${run.runId}`,
      created_at: '2030-01-01T00:02:00.000Z',
    }),
    now: new Date('2030-01-01T00:02:30.000Z'),
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const resumed = await transitionRun({
    loopRoot,
    runId: run.runId,
    status: 'running',
    now: new Date('2030-01-01T00:03:00.000Z'),
  })
  assert.equal(resumed.status, 'running')
})

test('a new blocker moves an owner-review run back to the decision pause', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 144,
    issueTitle: 'Owner-review blocker',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/144',
    entropy: 'block144',
  })
  const runPath = path.join(loopRoot, 'logs', 'runs', run.runId, 'run.json')
  await writeFile(
    runPath,
    `${JSON.stringify({ ...run, status: 'awaiting_owner_review' })}\n`,
    'utf8',
  )
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  await createNotification({
    loopRoot,
    runId: run.runId,
    type: 'loop_failed',
    summary: 'The owner-review observer cannot reach GitHub',
    requestedAction: 'Restore access or cancel the run',
    targetUrl: run.issueUrl,
    blocking: true,
    githubComment: async () => {},
  })
  const paused = JSON.parse(await readFile(runPath, 'utf8'))
  assert.equal(paused.status, 'waiting_for_owner')
})

test('preparing the same terminal journal record is idempotent', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 145,
    issueTitle: 'Retry finalization prepare',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/145',
    entropy: 'final145',
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  await createNotification({
    loopRoot,
    runId: run.runId,
    type: 'blocked',
    summary: 'The deterministic fixture is blocked',
    requestedAction: 'Resolve the fixture blocker',
    targetUrl: run.issueUrl,
    blocking: true,
    githubComment: async () => ({
      html_url: `${run.issueUrl}#issuecomment-8801`,
    }),
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const first = await prepareFinalizationRecord({
    loopRoot,
    runId: run.runId,
    status: 'blocked',
    failureFingerprint: 'same-terminal-cause',
    finishedAt: new Date('2026-07-22T19:00:00.000Z'),
    githubApi: async () => ({
      user: { login: 'echo-ui-loop[bot]' },
      body: `@codeacme17 **blocked**\n\nRun: \`${run.runId}\``,
    }),
  })
  const retried = await prepareFinalizationRecord({
    loopRoot,
    runId: run.runId,
    status: 'blocked',
    failureFingerprint: 'same-terminal-cause',
    finishedAt: new Date('2026-07-22T20:00:00.000Z'),
    githubApi: async () => ({
      user: { login: 'echo-ui-loop[bot]' },
      body: `@codeacme17 **blocked**\n\nRun: \`${run.runId}\``,
    }),
  })
  assert.equal(retried.digest, first.digest)
  assert.equal(retried.record.finishedAt, '2026-07-22T19:00:00.000Z')
})

test('three matching failures make a fresh evolve session due', async () => {
  const { loopRoot } = await createFixture()
  for (let issueNumber = 201; issueNumber <= 203; issueNumber += 1) {
    const { run } = await startFixtureRun({
      loopRoot,
      issueNumber,
      issueTitle: `Failure ${issueNumber}`,
      issueUrl: `https://github.com/codeacme17/echo-ui/issues/${issueNumber}`,
      entropy: `fail${issueNumber}`,
    })
    await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
    await createNotification({
      loopRoot,
      runId: run.runId,
      type: 'blocked',
      summary: 'Browser verification environment is unavailable',
      requestedAction: 'Restore the verification environment',
      targetUrl: run.issueUrl,
      blocking: true,
      githubComment: async () => {},
    })
    const finalizationOptions = {
      loopRoot,
      runId: run.runId,
      status: 'blocked',
      failureFingerprint: 'browser-environment-unavailable',
      releaseIssueClaim: async () => {
        const persisted = JSON.parse(
          await readFile(path.join(loopRoot, 'logs', 'runs', run.runId, 'run.json'), 'utf8'),
        )
        assert.equal(persisted.status, 'blocked')
        assert.notEqual(persisted.finishedAt, null)
      },
    }
    await publishFixtureFinalization({
      loopRoot,
      runId: run.runId,
      status: 'blocked',
      finishedAt: `2030-01-01T00:0${issueNumber - 200}:00.000Z`,
      failureFingerprint: 'browser-environment-unavailable',
    })
    await finalizeRun(finalizationOptions)
    if (issueNumber === 201) await finalizeRun(finalizationOptions)
  }
  const metrics = await getEvolveStatus({ loopRoot })
  assert.equal(metrics.evolveDue, true)
  assert.equal(metrics.failedRuns, 3)
  const history = (await readFile(path.join(loopRoot, 'logs', 'index.jsonl'), 'utf8'))
    .split('\n')
    .filter((line) => line.includes('run_finalized'))
  assert.equal(history.length, 3)
  assert.match(metrics.pendingRequestId, /^EVL-/)
  await assert.rejects(
    startFixtureRun({
      loopRoot,
      issueNumber: 204,
      issueTitle: 'Must wait for evolve',
      issueUrl: 'https://github.com/codeacme17/echo-ui/issues/204',
      entropy: 'fail204',
    }),
    /evolve request must run before issue work/,
  )
})

test('fresh worktrees rebuild finalization history and evolve metrics from GitHub journal', async () => {
  const { loopRoot } = await createFixture()
  const record = {
    schemaVersion: 1,
    runId: '20260722T120000Z-issue-205-journal',
    issueNumber: 205,
    status: 'blocked',
    startedAt: '2026-07-22T12:00:00.000Z',
    finishedAt: '2026-07-22T13:00:00.000Z',
    prUrl: null,
    headSha: null,
    mergeSha: null,
    failureFingerprint: 'persistent-browser-failure',
    notificationUrl: 'https://github.com/codeacme17/echo-ui/issues/205#issuecomment-8802',
  }
  const digest = recordDigest(record)
  const result = await reconcileFinalizationJournal({
    loopRoot,
    now: new Date('2026-07-22T14:00:00.000Z'),
    githubPaginatedApi: async () => [
      {
        user: { login: 'echo-ui-loop[bot]' },
        body: [
          `<!-- issue-dev-loop:finalization:${record.runId}:sha256:${digest} -->`,
          '```json',
          canonicalRecord(record),
          '```',
        ].join('\n'),
      },
    ],
    githubApi: async () => ({
      user: { login: 'echo-ui-loop[bot]' },
      body: `@codeacme17 **blocked**\n\nRun: \`${record.runId}\``,
    }),
  })
  assert.deepEqual(result.durableRunIds, [record.runId])
  const history = await readFile(path.join(loopRoot, 'logs', 'index.jsonl'), 'utf8')
  assert.match(history, new RegExp(record.runId))
  const metrics = await getEvolveStatus({ loopRoot })
  assert.equal(metrics.finalizedRuns, 1)
  assert.equal(metrics.failedRuns, 1)
})

test('fresh worktrees restore active checkpoints and trigger resumable work', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 206,
    issueTitle: 'Resume durable work',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/206',
    now: new Date('2026-07-22T12:00:00.000Z'),
    entropy: 'resume1',
  })
  const prepared = await prepareActiveCheckpoint({ loopRoot, runId: run.runId })
  const commentUrl = 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9910'
  await recordActiveCheckpointPublication({
    loopRoot,
    runId: run.runId,
    resultPath: prepared.resultPath,
    commentUrl,
    now: new Date('2026-07-22T12:01:00.000Z'),
    githubApi: async () => ({
      user: { login: 'echo-ui-loop[bot]' },
      body: prepared.body,
    }),
  })
  assert.equal(checkpointDigest(prepared.record), prepared.digest)
  assert.equal(JSON.parse(canonicalCheckpoint(prepared.record)).run.runId, run.runId)

  await rm(path.join(loopRoot, 'logs', 'runs', run.runId), { recursive: true, force: true })
  await rm(path.join(loopRoot, 'handoffs', run.runId), { recursive: true, force: true })
  const durableComment = {
    user: { login: 'echo-ui-loop[bot]' },
    body: prepared.body,
    html_url: commentUrl,
    created_at: '2026-07-22T12:01:00.000Z',
  }
  const reconciled = await reconcileActiveJournal({
    loopRoot,
    githubPaginatedApi: async () => [durableComment],
  })
  assert.equal(reconciled.activeCheckpoints[0].record.run.runId, run.runId)
  await restoreActiveCheckpoint({
    loopRoot,
    checkpoint: reconciled.activeCheckpoints[0],
    workspaceValidator: async () => {},
  })
  const restored = JSON.parse(
    await readFile(path.join(loopRoot, 'logs', 'runs', run.runId, 'run.json'), 'utf8'),
  )
  assert.equal(restored.issueNumber, 206)

  const detected = await detectWork({
    loopRoot,
    now: new Date('2026-07-22T12:02:00.000Z'),
    reconcileJournal: async () => ({
      activeCheckpoints: [
        {
          record: prepared.record,
          commentUrl,
          createdAt: '2026-07-22T12:01:00.000Z',
        },
      ],
    }),
  })
  assert.equal(detected.hasWork, true)
  assert.equal(detected.workType, 'resume')
  assert.equal(detected.runId, run.runId)
})

test('evolve completion rejects an unrelated historical owner-merged PR', async () => {
  const { loopRoot } = await createFixture()
  const requestId = 'EVL-20260722T120000-ABC123'
  const metricsPath = path.join(loopRoot, 'evolve', 'metrics.json')
  const metrics = JSON.parse(await readFile(metricsPath, 'utf8'))
  await writeFile(
    metricsPath,
    `${JSON.stringify({ ...metrics, evolveDue: true, pendingRequestId: requestId })}\n`,
    'utf8',
  )
  await writeFile(
    path.join(loopRoot, 'evolve', 'requests', `${requestId}.json`),
    `${JSON.stringify({
      schemaVersion: 1,
      requestId,
      status: 'pending',
      reason: 'ten_finalized_runs',
      requestedAt: '2026-07-22T12:00:00.000Z',
      finalizedRunCount: 10,
    })}\n`,
    'utf8',
  )
  await assert.rejects(
    completeEvolve({
      loopRoot,
      requestId,
      summary: 'Improve trigger batching',
      prUrl: 'https://github.com/codeacme17/echo-ui/pull/99',
      githubApi: async (endpoint) =>
        endpoint.includes('/reviews')
          ? [
              {
                user: { login: 'codeacme17' },
                state: 'APPROVED',
                commit_id: 'a'.repeat(40),
              },
            ]
          : {
              merged: true,
              merged_by: { login: 'codeacme17' },
              merge_commit_sha: '9'.repeat(40),
              created_at: '2026-07-20T00:00:00.000Z',
              body: 'Unrelated change',
              base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } },
              head: { ref: 'feature/unrelated', sha: 'a'.repeat(40) },
            },
    }),
    /not approved and merged by the configured owner/,
  )
})

test('repository loop package satisfies its structural invariants', async () => {
  const result = await validateLoop({ loopRoot: repositoryLoopRoot })
  assert.equal(result.valid, true)
})

test('repository activation remains blocked until distinct bot identities are configured', async () => {
  await assert.rejects(
    validateLoop({ loopRoot: repositoryLoopRoot, activation: true }),
    /activation requires configured owner, automation, and reviewer identities/,
  )
})
