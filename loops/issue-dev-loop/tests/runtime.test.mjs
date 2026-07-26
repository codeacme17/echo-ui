import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  chmod,
  cp,
  mkdtemp,
  mkdir,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
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
  createNotification as runtimeCreateNotification,
  defaultClaimIssue,
  detectWork,
  finalizeRun,
  freezeBrief as runtimeFreezeBrief,
  getEvolveStatus,
  loadPaginatedGitHubCollection,
  observeOwnerMerge,
  prepareActiveCheckpoint,
  prepareEvolveRequestPublication,
  prepareFinalizationRecord as runtimePrepareFinalizationRecord,
  reconcileActiveJournal,
  reconcileEvolveJournal,
  reconcileFinalizationJournal,
  reconcileLoopJournal,
  recordEvidence as runtimeRecordEvidence,
  recordEvolveRequestPublication,
  recordDigest,
  recordFinalizationPublication,
  recordActiveCheckpointPublication,
  recordImplementation as runtimeRecordImplementation,
  recordOwnerResponse as runtimeRecordOwnerResponse,
  recordPullRequest as runtimeRecordPullRequest,
  recordReview as runtimeRecordReview,
  reviewPublicationDigest,
  restoreActiveCheckpoint,
  selectIssue,
  startRun,
  transitionRun as runtimeTransitionRun,
  validateLoop,
} from '../scripts/runtime.mjs'
import { observeOwnerApprovedMerge } from '../scripts/lib/owner-gate.mjs'
import {
  assertCredentialProfileIsolation,
} from '../scripts/lib/github-identity.mjs'
import { verifyTerminalExternalProof } from '../scripts/lib/finalization-proof.mjs'
import {
  historicalWorkflowIsLowPrivilege,
  validateFinalizationHistory,
} from '../scripts/lib/validation.mjs'
import {
  checkpointPublicationBody,
  checkpointWorktreeHead,
} from '../scripts/lib/checkpoint-proof.mjs'

const bypassCheckpointVerifier = async () => {}
const createNotification = (options) =>
  runtimeCreateNotification({ ...options, checkpointVerifier: bypassCheckpointVerifier })
const freezeBrief = (options) =>
  runtimeFreezeBrief({ ...options, checkpointVerifier: bypassCheckpointVerifier })
const prepareFinalizationRecord = (options) =>
  runtimePrepareFinalizationRecord({
    ...options,
    checkpointVerifier: options.checkpointVerifier ?? bypassCheckpointVerifier,
  })
const recordEvidence = (options) =>
  runtimeRecordEvidence({
    ...options,
    candidateControlPlaneVerifier: options.candidateControlPlaneVerifier ?? (async () => {}),
    checkpointVerifier: bypassCheckpointVerifier,
  })
const recordImplementation = (options) =>
  runtimeRecordImplementation({ ...options, checkpointVerifier: bypassCheckpointVerifier })
const recordOwnerResponse = (options) =>
  runtimeRecordOwnerResponse({ ...options, checkpointVerifier: bypassCheckpointVerifier })
const recordPullRequest = (options) =>
  runtimeRecordPullRequest({ ...options, checkpointVerifier: bypassCheckpointVerifier })
const recordReview = (options) =>
  runtimeRecordReview({ ...options, checkpointVerifier: bypassCheckpointVerifier })
const transitionRun = (options) =>
  runtimeTransitionRun({ ...options, checkpointVerifier: bypassCheckpointVerifier })

const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryLoopRoot = path.resolve(testDirectory, '..')
const execFileAsync = promisify(execFile)

test('owner merge observation paginates beyond one hundred reviews', async () => {
  const { loopRoot } = await createFixture()
  const headSha = 'a'.repeat(40)
  const mergeSha = 'b'.repeat(40)
  const result = await observeOwnerApprovedMerge({
    loopRoot,
    prUrl: 'https://github.com/codeacme17/echo-ui/pull/700',
    expectedHeadSha: headSha,
    expectedHeadBranch: 'codex/issue-700',
    githubApi: async (endpoint) => {
      if (endpoint.endsWith('/reviews?per_page=100&page=1')) {
        return Array.from({ length: 100 }, (_, index) => ({
          id: index + 1,
          user: { login: 'someone-else' },
          state: 'COMMENTED',
          commit_id: headSha,
        }))
      }
      if (endpoint.endsWith('/reviews?per_page=100&page=2')) {
        return [
          {
            id: 101,
            user: { login: 'codeacme17' },
            state: 'APPROVED',
            commit_id: headSha,
            submitted_at: '2026-07-23T08:01:00.000Z',
          },
        ]
      }
      if (endpoint.endsWith('/timeline?per_page=100&page=1')) {
        return Array.from({ length: 100 }, (_, index) => ({
          id: index + 1,
          event: 'commented',
        }))
      }
      if (endpoint.endsWith('/timeline?per_page=100&page=2')) {
        return [
          {
            id: 101,
            event: 'ready_for_review',
            actor: { login: 'codeacme17' },
            created_at: '2026-07-23T08:00:00.000Z',
          },
        ]
      }
      return {
        merged: true,
        merged_at: '2026-07-23T08:02:00.000Z',
        merged_by: { login: 'codeacme17' },
        merge_commit_sha: mergeSha,
        base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } },
        head: {
          ref: 'codex/issue-700',
          sha: headSha,
          repo: { full_name: 'codeacme17/echo-ui' },
        },
      }
    },
  })
  assert.equal(result.mergeSha, mergeSha)
})

test('owner merge observation requires the owner Ready transition after notification', async () => {
  const { loopRoot } = await createFixture()
  const headSha = 'a'.repeat(40)
  const pullRequest = {
    merged: true,
    merged_at: '2026-07-23T08:33:00.000Z',
    merged_by: { login: 'codeacme17' },
    merge_commit_sha: 'b'.repeat(40),
    base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } },
    head: {
      ref: 'codex/issue-701',
      sha: headSha,
      repo: { full_name: 'codeacme17/echo-ui' },
    },
  }
  const verify = (
    timeline,
    reviews = [
      {
        user: { login: 'codeacme17' },
        state: 'APPROVED',
        commit_id: headSha,
        submitted_at: '2026-07-23T08:31:00.000Z',
      },
    ],
    pull = pullRequest,
  ) =>
    observeOwnerApprovedMerge({
      loopRoot,
      prUrl: 'https://github.com/codeacme17/echo-ui/pull/701',
      expectedHeadSha: headSha,
      expectedHeadBranch: 'codex/issue-701',
      readyAfter: '2026-07-23T08:00:00.000Z',
      githubApi: async (endpoint) => {
        if (endpoint.includes('/reviews')) return reviews
        if (endpoint.includes('/timeline')) return timeline
        return pull
      },
    })
  await assert.rejects(
    verify([
      {
        event: 'ready_for_review',
        actor: { login: 'another-collaborator' },
        created_at: '2026-07-23T08:30:00.000Z',
      },
    ]),
    /owner-authored Ready transition/,
  )
  await assert.rejects(
    verify([
      {
        event: 'ready_for_review',
        actor: { login: 'codeacme17' },
        created_at: '2026-07-23T08:30:00.000Z',
      },
      {
        event: 'convert_to_draft',
        actor: { login: 'codeacme17' },
        created_at: '2026-07-23T08:40:00.000Z',
      },
    ]),
    /owner-authored Ready transition/,
  )
  await assert.rejects(
    verify([
      {
        event: 'ready_for_review',
        actor: { login: 'codeacme17' },
        created_at: '2026-07-23T07:30:00.000Z',
      },
    ]),
    /owner-authored Ready transition/,
  )
  await assert.rejects(
    verify([
      {
        event: 'ready_for_review',
        actor: { login: 'codeacme17' },
        created_at: '2026-07-23T08:00:00.000Z',
      },
    ]),
    /owner-authored Ready transition/,
  )
  await assert.rejects(
    verify(
      [
        {
          event: 'ready_for_review',
          actor: { login: 'codeacme17' },
          created_at: '2026-07-23T08:30:00.000Z',
        },
      ],
      [
        {
          user: { login: 'codeacme17' },
          state: 'APPROVED',
          commit_id: headSha,
          submitted_at: '2026-07-23T08:31:00.000Z',
        },
        {
          user: { login: 'codeacme17' },
          state: 'CHANGES_REQUESTED',
          commit_id: headSha,
          submitted_at: '2026-07-23T08:32:00.000Z',
        },
      ],
    ),
    /latest owner review/,
  )
  await assert.rejects(
    verify(
      [
        {
          event: 'ready_for_review',
          actor: { login: 'codeacme17' },
          created_at: '2026-07-23T08:30:00.000Z',
        },
      ],
      [
        {
          user: { login: 'codeacme17' },
          state: 'APPROVED',
          commit_id: headSha,
          submitted_at: '2026-07-23T08:29:00.000Z',
        },
      ],
    ),
    /latest owner review/,
  )
  const readyTimeline = [
    {
      event: 'ready_for_review',
      actor: { login: 'codeacme17' },
      created_at: '2026-07-23T08:30:00.000Z',
    },
  ]
  const afterMergeApproval = [
    {
      user: { login: 'codeacme17' },
      state: 'APPROVED',
      commit_id: headSha,
      submitted_at: '2026-07-23T08:34:00.000Z',
    },
  ]
  await assert.rejects(verify(readyTimeline, afterMergeApproval), /strict owner Ready/)
  await assert.rejects(
    verify(readyTimeline, [
      {
        ...afterMergeApproval[0],
        submitted_at: pullRequest.merged_at,
      },
    ]),
    /strict owner Ready/,
  )
  await assert.rejects(
    verify(readyTimeline, undefined, { ...pullRequest, merged_at: null }),
    /strict owner Ready/,
  )
  assert.equal((await verify(readyTimeline)).mergeSha, pullRequest.merge_commit_sha)
})

test('owner merge observation bounds repeated full pagination pages', async () => {
  const { loopRoot } = await createFixture()
  let reviewPages = 0
  await assert.rejects(
    observeOwnerApprovedMerge({
      loopRoot,
      prUrl: 'https://github.com/codeacme17/echo-ui/pull/702',
      expectedHeadBranch: 'codex/issue-702',
      githubApi: async (endpoint) => {
        if (endpoint.includes('/reviews')) {
          reviewPages += 1
          return Array.from({ length: 100 }, () => ({ state: 'COMMENTED' }))
        }
        if (endpoint.includes('/timeline')) return []
        return {
          merged: true,
          merged_at: '2026-07-23T08:33:00.000Z',
          merged_by: { login: 'codeacme17' },
          merge_commit_sha: 'b'.repeat(40),
          base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } },
          head: {
            ref: 'codex/issue-702',
            sha: 'a'.repeat(40),
            repo: { full_name: 'codeacme17/echo-ui' },
          },
        }
      },
    }),
    /100-page safety limit/,
  )
  assert.equal(reviewPages, 100)
})

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
      automationGitHubConfigEnvironmentVariable: 'ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR',
      reviewerGitHubConfigEnvironmentVariable: 'ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR',
      untrustedRootsEnvironmentVariable: 'ECHO_UI_LOOP_UNTRUSTED_ROOTS',
      stateIssueNumber: 999,
      repository: 'codeacme17/echo-ui',
      webhookEnvironmentVariable: 'TEST_LOOP_WEBHOOK_URL',
      informationalImmediateTypes: ['pr_completed'],
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
    workspaceValidator: options.workspaceValidator ?? (async () => {}),
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
  return { ...prepared, commentUrl }
}

function pullRequestFixture(
  run,
  headSha,
  { draft = true, embeddedScreenshots = false, merged = false } = {},
) {
  const screenshotEvidence = embeddedScreenshots
    ? [
        `![Before](https://raw.githubusercontent.com/codeacme17/echo-ui/${headSha}/loops/issue-dev-loop/screen-shots/${run.runId}/before/fixture.png)`,
        `![After](https://raw.githubusercontent.com/codeacme17/echo-ui/${headSha}/loops/issue-dev-loop/screen-shots/${run.runId}/after/fixture.png)`,
      ]
    : []
  return {
    state: merged ? 'closed' : 'open',
    draft,
    merged,
    merged_by: merged ? { login: 'codeacme17' } : null,
    merge_commit_sha: merged ? '9'.repeat(40) : null,
    user: { login: 'echo-ui-loop[bot]' },
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
      '- `pnpm test -- keyboard`: passed (exit code 0)',
      '- `pnpm verify`: passed (exit code 0)',
      '- `pnpm test (owner-merged baseline tests)`: passed (exit code 0)',
      '## Evidence',
      'Exact-head workflow evidence is attached or pending for this draft.',
      ...screenshotEvidence,
      '## Independent review',
      'Fresh-context review is attached or pending for this draft.',
      '## Known limitations',
      'None known.',
      'This PR must be marked Ready, reviewed, and merged by `@codeacme17`',
    ].join('\n'),
  }
}

async function recordFixturePr({
  loopRoot,
  run,
  headSha,
  number = 200,
  uiEvidenceRequired = false,
  embeddedScreenshots = uiEvidenceRequired,
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
        : pullRequestFixture(run, headSha, { embeddedScreenshots }),
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
      {
        number: prNumber,
        base: {
          ref: 'dev',
          sha: run.baseSha,
          repo: { url: 'https://api.github.com/repos/codeacme17/echo-ui' },
        },
        head: { ref: run.branch, sha: headSha },
      },
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
      trustedWorkflowSha: run.baseSha,
      workflowBaseSha: run.baseSha,
      workflowRunSha: headSha,
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
        {
          command: 'pnpm test (owner-merged baseline tests)',
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
      cycle: 1,
      reviewerAgent: 'echo_ui_pr_reviewer',
      freshContext: true,
      headSha,
      verdict: 'PASS',
      rounds: [
        {
          round: 1,
          headSha,
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

function publishedReviewFixture({ id, runId, cycle = 1, round, headSha }) {
  return {
    id,
    commit_id: headSha,
    state: 'COMMENTED',
    user: { login: 'echo-ui-reviewer[bot]' },
    body: `<!-- issue-dev-loop:${runId}:review-cycle:${cycle}:round:${round}:head:${headSha} -->`,
  }
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
  const completed = status === 'completed'
  const readyNotifiedAt = completed
    ? new Date(Date.parse(finishedAt) - 20 * 60_000).toISOString()
    : null
  const completionNotifiedAt = completed
    ? new Date(Date.parse(finishedAt) - 5 * 60_000).toISOString()
    : null
  const failureStatus = ['failed', 'blocked'].includes(status)
  const checkpointRecord = failureStatus
    ? JSON.parse(
        await readFile(
          path.join(loopRoot, 'logs', 'runs', runId, 'checkpoint-result.json'),
          'utf8',
        ),
      )
    : null
  const checkpointEvent = failureStatus
    ? (await readFile(path.join(loopRoot, 'logs', 'runs', runId, 'events.jsonl'), 'utf8'))
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line))
        .findLast((event) => event.type === 'checkpoint_published')
    : null
  const pauseStartedAt = failureStatus
    ? checkpointRecord.events.findLast(
        (event) => event.type === 'run_status_changed' && event.status === 'waiting_for_owner',
      )?.timestamp
    : null
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
    notificationUrl: completed
      ? `${run.prUrl}#issuecomment-8803`
      : ['failed', 'blocked'].includes(status)
        ? `${run.issueUrl}#issuecomment-8800`
        : null,
    readyNotificationUrl: completed ? `${run.prUrl}#issuecomment-8802` : null,
    readyNotifiedAt,
    completionNotifiedAt,
    notificationWebhookStatus: completed ? 'not_configured' : null,
    predecessorCheckpointUrl: checkpointEvent?.payload?.commentUrl ?? null,
    predecessorCheckpointDigest: checkpointEvent?.payload?.digest ?? null,
    pauseStartedAt,
    notificationNotifiedAt: failureStatus ? pauseStartedAt : null,
  }
  const resultPath = path.join(loopRoot, 'logs', 'runs', runId, 'finalization-result.json')
  await writeFile(resultPath, `${canonicalRecord(record)}\n`, 'utf8')
  const digest = recordDigest(record)
  const commentUrl = 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9900'
  const githubApi = async (endpoint) => {
    if (endpoint.includes('/reviews')) {
      return [
        {
          user: { login: 'codeacme17' },
          state: 'APPROVED',
          commit_id: record.headSha,
          submitted_at: new Date(Date.now() + 120_000).toISOString(),
        },
      ]
    }
    if (endpoint.includes('/timeline')) {
      return [
        {
          event: 'ready_for_review',
          actor: { login: 'codeacme17' },
          created_at: new Date(Date.now() + 60_000).toISOString(),
        },
      ]
    }
    if (endpoint.includes('/pulls/')) {
      return {
        merged: true,
        merged_at: new Date(Date.now() + 180_000).toISOString(),
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
        created_at: record.notificationNotifiedAt,
        body: `@codeacme17 **${notificationType}**\n\nRun: \`${runId}\``,
      }
    }
    if (
      checkpointEvent &&
      endpoint.endsWith(
        `/issues/comments/${record.predecessorCheckpointUrl.split('#issuecomment-')[1]}`,
      )
    ) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        body: [
          `<!-- issue-dev-loop:checkpoint:${runId}:sha256:${record.predecessorCheckpointDigest} -->`,
          '```json',
          canonicalCheckpoint(checkpointRecord),
          '```',
        ].join('\n'),
      }
    }
    if (endpoint.endsWith('/issues/comments/8802')) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        created_at: readyNotifiedAt,
        body: `@codeacme17 **pr_ready_for_review**\n\nRun: \`${runId}\``,
      }
    }
    if (endpoint.endsWith('/issues/comments/8803')) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        created_at: completionNotifiedAt,
        body: `@codeacme17 **pr_completed**\n\nRun: \`${runId}\``,
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
  const orphanedClaim = selectIssue({
    issues: [
      {
        number: 13,
        title: 'Reserved branch',
        labels: [{ name: 'codex-ready' }],
      },
    ],
    branchNames: ['codex/issue-13'],
  })
  assert.equal(orphanedClaim.hasWork, true)
  assert.equal(orphanedClaim.workType, 'claim_recovery')
  assert.equal(orphanedClaim.branch, 'codex/issue-13')
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

test('GitHub collection loading consumes every page beyond the first 100 records', async () => {
  const firstPage = Array.from({ length: 100 }, (_, index) => ({ number: index + 1 }))
  const secondPage = [{ number: 101 }, { number: 102 }]
  let observedCommand
  const collection = await loadPaginatedGitHubCollection(
    'repos/codeacme17/echo-ui/issues?state=open&per_page=100',
    {
      execute: async (command, args) => {
        observedCommand = [command, ...args]
        return { stdout: JSON.stringify([firstPage, secondPage]) }
      },
    },
  )
  assert.deepEqual(observedCommand, [
    'gh',
    'api',
    '--paginate',
    '--slurp',
    'repos/codeacme17/echo-ui/issues?state=open&per_page=100',
  ])
  assert.equal(collection.length, 102)
  assert.equal(collection.at(-1).number, 102)
})

test('candidate control-plane validation permits run evidence but rejects verifier changes', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-control-plane-test-'))
  const repository = path.join(parent, 'repository')
  const loopRoot = path.join(repository, 'loops', 'issue-dev-loop')
  const runId = 'run-issue-123'
  await mkdir(path.join(loopRoot, 'logs', 'runs', runId), { recursive: true })
  await mkdir(path.join(repository, 'src'), { recursive: true })
  await mkdir(path.join(repository, '.codex', 'agents'), { recursive: true })
  const git = async (...args) => execFileAsync('git', args, { cwd: repository })
  await git('init', '--initial-branch=dev')
  await git('config', 'user.name', 'Loop Test')
  await git('config', 'user.email', 'loop-test@example.invalid')
  await writeFile(path.join(repository, 'src', 'feature.js'), 'export const value = 1\n', 'utf8')
  await writeFile(path.join(repository, 'package.json'), '{"scripts":{"verify":"true"}}\n', 'utf8')
  await writeFile(
    path.join(repository, '.codex', 'agents', 'reviewer.toml'),
    'sandbox_mode = "read-only"\n',
    'utf8',
  )
  await git('add', '.')
  await git('commit', '-m', 'base')
  const baseSha = (await git('rev-parse', 'HEAD')).stdout.trim()

  await writeFile(path.join(repository, 'src', 'feature.js'), 'export const value = 2\n', 'utf8')
  await git('add', 'src/feature.js')
  await git('commit', '-m', 'implementation')
  const implementationCommit = (await git('rev-parse', 'HEAD')).stdout.trim()
  const run = {
    runId,
    issueNumber: 123,
    baseSha,
    headSha: implementationCommit,
    implementationCommit,
    branch: 'codex/issue-123',
    finishedAt: null,
  }
  await writeFile(
    path.join(loopRoot, 'logs', 'runs', runId, 'run.json'),
    `${JSON.stringify(run)}\n`,
    'utf8',
  )
  await git('add', '.')
  await git('commit', '-m', 'run evidence')
  const permittedHead = (await git('rev-parse', 'HEAD')).stdout.trim()
  const validator = path.join(repositoryLoopRoot, 'scripts', 'validate-candidate-control-plane.mjs')
  const permitted = await execFileAsync(process.execPath, [
    validator,
    '--loop-root',
    loopRoot,
    '--run-id',
    runId,
    '--base-sha',
    baseSha,
    '--head-sha',
    permittedHead,
  ])
  assert.equal(JSON.parse(permitted.stdout).valid, true)

  await git('mv', '.codex/agents/reviewer.toml', 'src/reviewer.toml')
  await git('commit', '-m', 'move protected reviewer configuration')
  const renamedHead = (await git('rev-parse', 'HEAD')).stdout.trim()
  await assert.rejects(
    execFileAsync(process.execPath, [
      validator,
      '--loop-root',
      loopRoot,
      '--run-id',
      runId,
      '--base-sha',
      baseSha,
      '--head-sha',
      renamedHead,
    ]),
    /\.codex\/agents\/reviewer\.toml/,
  )
  await git('mv', 'src/reviewer.toml', '.codex/agents/reviewer.toml')
  await git('commit', '-m', 'restore protected reviewer configuration')

  await symlink('src', path.join(repository, '.agents'))
  await git('add', '.agents')
  await git('commit', '-m', 'add root agent adapter symlink')
  const symlinkHead = (await git('rev-parse', 'HEAD')).stdout.trim()
  await assert.rejects(
    execFileAsync(process.execPath, [
      validator,
      '--loop-root',
      loopRoot,
      '--run-id',
      runId,
      '--base-sha',
      baseSha,
      '--head-sha',
      symlinkHead,
    ]),
    /(?:^|\n)\.agents(?:\n|$)/,
  )
  await rm(path.join(repository, '.agents'))
  await git('add', '-A')
  await git('commit', '-m', 'remove root agent adapter symlink')

  await writeFile(
    path.join(repository, 'package.json'),
    '{"scripts":{"verify":"node attacker.js"}}\n',
    'utf8',
  )
  await git('add', 'package.json')
  await git('commit', '-m', 'weaken verifier')
  const violatingHead = (await git('rev-parse', 'HEAD')).stdout.trim()
  await assert.rejects(
    execFileAsync(process.execPath, [
      validator,
      '--loop-root',
      loopRoot,
      '--run-id',
      runId,
      '--base-sha',
      baseSha,
      '--head-sha',
      violatingHead,
    ]),
    /issue branches cannot modify the trusted control or verification plane:[\s\S]*package\.json/,
  )

  for (const [relativePath, source, expected] of [
    [
      '.codex/agents/echo_ui_pr_reviewer.toml',
      'sandbox_mode = "danger-full-access"\n',
      /\.codex\/agents\/echo_ui_pr_reviewer\.toml/,
    ],
    [
      '.agents/skills/issue-dev-loop/SKILL.md',
      '# Candidate-controlled adapter\n',
      /\.agents\/skills\/issue-dev-loop\/SKILL\.md/,
    ],
    ['vercel.json', '{"git":{"deploymentEnabled":{"codex/issue-*":true}}}\n', /vercel\.json/],
  ]) {
    const target = path.join(repository, relativePath)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, source, 'utf8')
    await git('add', relativePath)
    await git('commit', '-m', `change protected ${relativePath}`)
    const headSha = (await git('rev-parse', 'HEAD')).stdout.trim()
    await assert.rejects(
      execFileAsync(process.execPath, [
        validator,
        '--loop-root',
        loopRoot,
        '--run-id',
        runId,
        '--base-sha',
        baseSha,
        '--head-sha',
        headSha,
      ]),
      expected,
    )
  }
})

test('durable candidate validation supports pre-implementation and later repair heads', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-durable-candidate-test-'))
  const repository = path.join(parent, 'repository')
  const loopRoot = path.join(repository, 'loops', 'issue-dev-loop')
  const validator = path.join(repositoryLoopRoot, 'scripts', 'validate-candidate-control-plane.mjs')
  const runId = 'run-issue-321'
  const git = async (...args) => execFileAsync('git', args, { cwd: repository })
  await mkdir(path.join(repository, 'src'), { recursive: true })
  await mkdir(loopRoot, { recursive: true })
  await git('init', '--initial-branch=dev')
  await git('config', 'user.name', 'Loop Test')
  await git('config', 'user.email', 'loop-test@example.invalid')
  await writeFile(path.join(repository, 'src', 'feature.js'), 'export const value = 0\n', 'utf8')
  await git('add', '.')
  await git('commit', '-m', 'base')
  await git('switch', '-c', 'codex/issue-321')
  const baseSha = (await git('rev-parse', 'HEAD')).stdout.trim()

  const preImplementation = await execFileAsync(process.execPath, [
    validator,
    '--loop-root',
    loopRoot,
    '--run-id',
    runId,
    '--base-sha',
    baseSha,
    '--head-sha',
    baseSha,
    '--durable-issue-number',
    '321',
    '--durable-implementation-commit',
    'none',
    '--durable-pr-head',
    'none',
  ])
  assert.equal(JSON.parse(preImplementation.stdout).valid, true)

  await writeFile(path.join(repository, 'src', 'feature.js'), 'export const value = 1\n', 'utf8')
  await git('add', 'src/feature.js')
  await git('commit', '-m', 'first PR head')
  const oldPrHead = (await git('rev-parse', 'HEAD')).stdout.trim()
  await writeFile(path.join(repository, 'src', 'feature.js'), 'export const value = 2\n', 'utf8')
  await git('add', 'src/feature.js')
  await git('commit', '-m', 'owner feedback implementation')
  const repairCommit = (await git('rev-parse', 'HEAD')).stdout.trim()

  const repair = await execFileAsync(process.execPath, [
    validator,
    '--loop-root',
    loopRoot,
    '--run-id',
    runId,
    '--base-sha',
    baseSha,
    '--head-sha',
    repairCommit,
    '--durable-issue-number',
    '321',
    '--durable-implementation-commit',
    repairCommit,
    '--durable-pr-head',
    oldPrHead,
  ])
  assert.equal(JSON.parse(repair.stdout).valid, true)
  assert.equal(
    checkpointWorktreeHead({
      run: { baseSha },
      events: [
        {
          type: 'pr_published',
          payload: { headSha: oldPrHead },
        },
        {
          type: 'implementation_completed',
          status: 'passed',
          payload: { commitSha: repairCommit },
        },
      ],
    }),
    repairCommit,
  )
})

test('default checkpoint restore ignores hidden-untracked config and rejects concealed index state', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-restore-cleanliness-test-'))
  const repository = path.join(parent, 'repository')
  const worktree = path.join(parent, 'worktree')
  const loopRoot = path.join(worktree, 'loops', 'issue-dev-loop')
  const git = async (cwd, ...args) => execFileAsync('git', args, { cwd })
  try {
    await mkdir(path.join(repository, 'loops', 'issue-dev-loop'), { recursive: true })
    await writeFile(path.join(repository, 'tracked.txt'), 'tracked\n', 'utf8')
    await writeFile(
      path.join(repository, 'loops', 'issue-dev-loop', '.gitkeep'),
      '',
      'utf8',
    )
    await git(repository, 'init', '--initial-branch=dev')
    await git(repository, 'config', 'user.name', 'Loop Test')
    await git(repository, 'config', 'user.email', 'loop-test@example.invalid')
    await git(repository, 'add', '.')
    await git(repository, 'commit', '-m', 'base')
    const baseSha = (await git(repository, 'rev-parse', 'HEAD')).stdout.trim()
    await git(repository, 'worktree', 'add', '-b', 'codex/issue-444', worktree, baseSha)

    const startedAt = '2026-07-24T00:00:00.000Z'
    const record = {
      schemaVersion: 1,
      kind: 'active-checkpoint',
      run: {
        schemaVersion: 1,
        runId: 'restore-untracked-run',
        issueNumber: 444,
        issueTitle: 'Restore exact durable worktree',
        issueUrl: 'https://github.com/codeacme17/echo-ui/issues/444',
        baseBranch: 'dev',
        baseSha,
        branch: 'codex/issue-444',
        status: 'running',
        startedAt,
        finishedAt: null,
        prUrl: null,
        headSha: null,
        mergeSha: null,
        issueSnapshot: {
          title: 'Restore exact durable worktree',
          body: 'Fixture',
          labels: ['codex-ready'],
          url: 'https://github.com/codeacme17/echo-ui/issues/444',
          capturedAt: startedAt,
        },
        briefDigest: null,
        uiEvidenceRequired: false,
        implementationCommit: null,
      },
      briefSource: '',
      events: [
        {
          schemaVersion: 1,
          runId: 'restore-untracked-run',
          type: 'loop_started',
          timestamp: startedAt,
          status: 'running',
          payload: { issueNumber: 444, branch: 'codex/issue-444' },
        },
      ],
      artifacts: [],
      updatedAt: startedAt,
    }
    const checkpoint = { record, commentUrl: null, createdAt: startedAt }

    const restoredPreImplementation = await restoreActiveCheckpoint({ loopRoot, checkpoint })
    assert.equal(restoredPreImplementation.implementationCommit, null)
    for (const directory of ['logs', 'handoffs', 'screen-shots', 'evidence']) {
      await rm(path.join(loopRoot, directory), { recursive: true, force: true })
    }

    await git(worktree, 'config', 'status.showUntrackedFiles', 'no')
    await writeFile(path.join(worktree, 'hidden-untracked.txt'), 'not clean\n', 'utf8')
    const configuredStatus = await git(worktree, 'status', '--porcelain')
    assert.equal(configuredStatus.stdout, '')
    await assert.rejects(
      restoreActiveCheckpoint({ loopRoot, checkpoint }),
      /clean isolated worktree/,
    )

    await rm(path.join(worktree, 'hidden-untracked.txt'))
    await git(worktree, 'update-index', '--skip-worktree', 'tracked.txt')
    await assert.rejects(
      restoreActiveCheckpoint({ loopRoot, checkpoint }),
      /index concealment/,
    )

    await git(worktree, 'update-index', '--no-skip-worktree', 'tracked.txt')
    await writeFile(path.join(worktree, 'tracked.txt'), 'repaired\n', 'utf8')
    await git(worktree, 'add', 'tracked.txt')
    await git(worktree, 'commit', '-m', 'repair implementation')
    const repairCommit = (await git(worktree, 'rev-parse', 'HEAD')).stdout.trim()
    const repairBrief = 'Repair the issue and retain the durable resume boundary.\n'
    const repairBriefDigest = createHash('sha256').update(repairBrief).digest('hex')
    const repairResult = {
      schemaVersion: 1,
      runId: record.run.runId,
      agent: '$implement',
      invocationId: 'repair-invocation',
      startedAt: '2026-07-24T00:01:00.000Z',
      finishedAt: '2026-07-24T00:02:00.000Z',
      briefDigest: repairBriefDigest,
      commitSha: repairCommit,
      checks: [{ command: 'pnpm verify', status: 'passed' }],
    }
    const repairResultSource = `${JSON.stringify(repairResult)}\n`
    const repairResultDigest = createHash('sha256')
      .update(repairResultSource)
      .digest('hex')
    const repairResultPath = `logs/runs/${record.run.runId}/repair-result.json`
    const repairFinishedAt = repairResult.finishedAt
    const repairRecord = structuredClone(record)
    repairRecord.run.implementationCommit = repairCommit
    repairRecord.run.briefDigest = repairBriefDigest
    repairRecord.briefSource = repairBrief
    repairRecord.events.push({
      schemaVersion: 1,
      runId: record.run.runId,
      type: 'implementation_completed',
      timestamp: repairFinishedAt,
      status: 'passed',
      payload: {
        agent: '$implement',
        invocationId: repairResult.invocationId,
        startedAt: repairResult.startedAt,
        finishedAt: repairFinishedAt,
        briefDigest: repairBriefDigest,
        commitSha: repairCommit,
        resultPath: repairResultPath,
        resultDigest: repairResultDigest,
      },
    })
    repairRecord.artifacts.push({
      path: repairResultPath,
      sha256: repairResultDigest,
      source: repairResultSource,
    })
    repairRecord.updatedAt = repairFinishedAt

    const restoredRepair = await restoreActiveCheckpoint({
      loopRoot,
      checkpoint: {
        record: repairRecord,
        commentUrl: null,
        createdAt: repairFinishedAt,
      },
    })
    assert.equal(restoredRepair.implementationCommit, repairCommit)
  } finally {
    await rm(parent, { recursive: true, force: true })
  }
})

test('review publication digest excludes assigned review URLs but binds review content', () => {
  const review = {
    schemaVersion: 1,
    runId: 'run-1',
    cycle: 1,
    reviewerAgent: 'echo_ui_pr_reviewer',
    freshContext: true,
    headSha: 'a'.repeat(40),
    verdict: 'PASS',
    rounds: [
      {
        round: 1,
        headSha: 'a'.repeat(40),
        reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/1#pullrequestreview-1',
        verdict: 'PASS',
        findings: [],
      },
    ],
  }
  const digest = reviewPublicationDigest(review)
  const assignedByGitHub = structuredClone(review)
  assignedByGitHub.rounds[0].reviewUrl =
    'https://github.com/codeacme17/echo-ui/pull/1#pullrequestreview-987654'
  assert.equal(reviewPublicationDigest(assignedByGitHub), digest)

  const changedReview = structuredClone(assignedByGitHub)
  changedReview.headSha = 'b'.repeat(40)
  changedReview.rounds[0].headSha = changedReview.headSha
  assert.notEqual(reviewPublicationDigest(changedReview), digest)
})

test('authoritative claim rejects any paginated open PR that references the issue', async () => {
  let labelAdded = false
  await assert.rejects(
    defaultClaimIssue({
      issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
      issueNumber: 128,
      baseSha: '0'.repeat(40),
      githubApi: async () => ({
        number: 128,
        title: 'Issue',
        state: 'open',
        labels: [{ name: 'codex-ready' }],
      }),
      githubPaginatedApi: async () => [
        { head: { ref: 'feature/other' }, title: 'Existing fix', body: 'Closes #128' },
      ],
      remoteBranchExists: async () => false,
      addLabel: async () => {
        labelAdded = true
      },
    }),
    /already claims issue 128/,
  )
  assert.equal(labelAdded, false)

  await assert.rejects(
    defaultClaimIssue({
      issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
      issueNumber: 128,
      baseSha: '0'.repeat(40),
      githubApi: async () => ({
        number: 128,
        title: 'Issue',
        state: 'open',
        labels: [{ name: 'codex-ready' }],
      }),
      githubPaginatedApi: async () => [],
      remoteBranchExists: async () => true,
      addLabel: async () => {
        labelAdded = true
      },
    }),
    /remote branch codex\/issue-128 already exists/,
  )
  assert.equal(labelAdded, false)
})

test('authoritative claim atomically reserves one remote issue branch across starters', async () => {
  let reservationCreated = false
  let labelCount = 0
  const claim = () =>
    defaultClaimIssue({
      issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
      issueNumber: 128,
      baseSha: '0'.repeat(40),
      githubApi: async () => ({
        number: 128,
        title: 'Issue',
        state: 'open',
        labels: [{ name: 'codex-ready' }],
      }),
      githubPaginatedApi: async () => [],
      remoteBranchExists: async () => false,
      reserveRemoteBranch: async () => {
        if (reservationCreated) throw new Error('remote ref already exists')
        reservationCreated = true
      },
      addLabel: async () => {
        labelCount += 1
      },
    })

  const outcomes = await Promise.allSettled([claim(), claim()])
  assert.equal(outcomes.filter(({ status }) => status === 'fulfilled').length, 1)
  assert.equal(outcomes.filter(({ status }) => status === 'rejected').length, 1)
  assert.match(
    outcomes.find(({ status }) => status === 'rejected').reason.message,
    /remote ref already exists/,
  )
  assert.equal(labelCount, 1)
})

test('authoritative claim releases its exact reservation when labeling fails', async () => {
  let reservationCreated = false
  let reservationReleased = false
  await assert.rejects(
    defaultClaimIssue({
      issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
      issueNumber: 128,
      baseSha: '0'.repeat(40),
      githubApi: async () => ({
        number: 128,
        title: 'Issue',
        state: 'open',
        labels: [{ name: 'codex-ready' }],
      }),
      githubPaginatedApi: async () => [],
      remoteBranchExists: async () => false,
      reserveRemoteBranch: async () => {
        reservationCreated = true
      },
      addLabel: async () => {
        throw new Error('label unavailable')
      },
      releaseRemoteBranch: async ({ baseSha }) => {
        assert.equal(baseSha, '0'.repeat(40))
        reservationReleased = true
      },
    }),
    /label unavailable/,
  )
  assert.equal(reservationCreated, true)
  assert.equal(reservationReleased, true)
})

test('startRun creates one correlated run, handoff, and evidence directories', async () => {
  const { loopRoot } = await createFixture()
  let workspaceValidation
  const result = await startFixtureRun({
    loopRoot,
    issueNumber: 128,
    issueTitle: 'Improve Player focus behavior',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
    now: new Date('2026-07-22T15:30:12Z'),
    entropy: 'a1b2c3',
    workspaceValidator: async (input) => {
      workspaceValidation = input
    },
  })

  assert.equal(result.run.runId, '20260722T153012Z-issue-128-a1b2c3')
  assert.equal(result.run.baseBranch, 'dev')
  assert.equal(result.run.branch, 'codex/issue-128')
  assert.equal(workspaceValidation.issueNumber, 128)
  assert.equal(workspaceValidation.baseSha, '0'.repeat(40))
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
  await assert.rejects(
    runtimeFreezeBrief({ loopRoot, runId: run.runId }),
    /requires a durable checkpoint/,
  )
  const prepared = await prepareActiveCheckpoint({ loopRoot, runId: run.runId })
  const eventsPath = path.join(loopRoot, 'logs', 'runs', run.runId, 'events.jsonl')
  await writeFile(
    eventsPath,
    `${await readFile(eventsPath, 'utf8')}${JSON.stringify({
      schemaVersion: 1,
      runId: run.runId,
      type: 'checkpoint_published',
      timestamp: '2030-01-01T00:00:00.000Z',
      status: 'published',
      payload: {
        commentUrl: 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9999',
        digest: prepared.digest,
        checkpointUpdatedAt: prepared.record.updatedAt,
      },
    })}\n`,
    'utf8',
  )
  await assert.rejects(
    runtimeFreezeBrief({
      loopRoot,
      runId: run.runId,
      githubApi: async () => ({
        user: { login: 'echo-ui-loop[bot]' },
        body: 'forged local checkpoint has no matching journal body',
      }),
    }),
    /does not attest the exact active state/,
  )
})

test('remote checkpoint proof is rejected when current local state was rewritten', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 152,
    issueTitle: 'Canonical checkpoint state',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/152',
    entropy: 'check152',
  })
  const prepared = await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  await writeFile(
    path.join(loopRoot, 'logs', 'runs', run.runId, 'run.json'),
    `${JSON.stringify({ ...run, headSha: 'a'.repeat(40) })}\n`,
    'utf8',
  )
  await assert.rejects(
    runtimeFreezeBrief({
      loopRoot,
      runId: run.runId,
      githubApi: async () => ({
        user: { login: 'echo-ui-loop[bot]' },
        body: prepared.body,
      }),
    }),
    /checkpoint event does not match its durable record/,
  )
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
  const partiallyCompleted = await readFile(briefPath, 'utf8')
  await writeFile(
    briefPath,
    partiallyCompleted
      .replace('## In scope\n', '## In scope\n\nThe requested component behavior.\n')
      .replace('## Out of scope\n', '## Out of scope\n\nUnrelated public APIs.\n')
      .replace(
        '## Pre-agreed TDD seams\n',
        '## Pre-agreed TDD seams\n\nThe component behavior boundary.\n',
      )
      .replace('## Required targeted checks\n', '## Required targeted checks\n\n- pnpm verify\n')
      .replace(
        '## Required UI evidence\n',
        '## Required UI evidence\n\nNot required for this fixture.\n',
      )
      .replace(
        '## Risks and owner-confirmation boundaries\n',
        '## Risks and owner-confirmation boundaries\n\nNo public API changes.\n',
      ),
    'utf8',
  )
  await assert.rejects(
    freezeBrief({ loopRoot, runId: run.runId }),
    /targeted check in addition to pnpm verify/,
  )
})

test('frozen brief rejects level-three headings that impersonate contract sections', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 148,
    issueTitle: 'Reject nested frozen contract',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/148',
    entropy: 'brief148',
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const briefPath = path.join(loopRoot, 'handoffs', run.runId, 'implementation-brief.md')
  await writeFile(
    briefPath,
    [
      '# Implementation brief',
      '',
      '- UI evidence required: yes',
      '',
      '## Issue snapshot',
      '',
      ...[
        'Acceptance criteria',
        'In scope',
        'Out of scope',
        'Pre-agreed TDD seams',
        'Required targeted checks',
        'Required UI evidence',
        'Risks and owner-confirmation boundaries',
        'Stop conditions',
      ].flatMap((heading) => [
        `## ${heading}`,
        heading === 'Required targeted checks'
          ? '- `pnpm test -- issue-controlled-decoy`'
          : 'Issue-controlled text that must not satisfy the frozen contract.',
        '',
      ]),
      '<!-- issue-dev-loop:implementation-contract -->',
      '',
      '### Acceptance criteria',
      'A deterministic acceptance criterion with sufficient detail.',
      '',
      '### In scope',
      'The requested behavior.',
      '',
      '### Out of scope',
      'Unrelated behavior.',
      '',
      '### Pre-agreed TDD seams',
      'The public control boundary.',
      '',
      '### Required targeted checks',
      '- `pnpm test -- target`',
      '- `pnpm verify`',
      '',
      '### Required UI evidence',
      'Paired screenshots.',
      '',
      '### Risks and owner-confirmation boundaries',
      'No authority changes.',
      '',
      '### Stop conditions',
      'Stop after committing.',
    ].join('\n'),
    'utf8',
  )
  await assert.rejects(
    freezeBrief({ loopRoot, runId: run.runId }),
    /concrete Acceptance criteria section/,
  )
})

test('UI draft PR requires embedded before and after screenshots pinned to its exact head', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 149,
    issueTitle: 'Show UI evidence in the PR',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/149',
    entropy: 'images149',
  })
  await assert.rejects(
    recordFixturePr({
      loopRoot,
      run,
      headSha: 'e'.repeat(40),
      number: 304,
      uiEvidenceRequired: true,
      embeddedScreenshots: false,
    }),
    /embedded before and after screenshots pinned to the exact PR head/,
  )
})

test('evidence workflow marks volume checkouts safe before Git-backed verification', async () => {
  const workflow = await readFile(
    path.resolve(
      repositoryLoopRoot,
      '..',
      '..',
      '.github',
      'workflows',
      'issue-dev-loop-evidence.yml',
    ),
    'utf8',
  )
  assert.match(workflow, /git config --global --add safe\.directory \/work; pnpm verify/)
  assert.match(workflow, /git config --global --add safe\.directory \/work; pnpm test/)
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
      workspaceValidator: async () => {},
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
        : {
            ...pullRequestFixture(run, updatedHead),
            body: pullRequestFixture(run, firstHead).body,
          },
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
          : pullRequestFixture(run, '6'.repeat(40)),
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
      githubApi: async () => pullRequestFixture(run, '6'.repeat(40)),
    }),
    /brief changed after freeze-brief/,
  )
})

test('owner-feedback repair cannot start until the unchanged PR is durably redrafted', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 151,
    issueTitle: 'Redraft before owner repair',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/151',
    entropy: 'redraft151',
  })
  const headSha = '3'.repeat(40)
  const prUrl = await recordFixturePr({ loopRoot, run, headSha, number: 351 })
  await createNotification({
    loopRoot,
    runId: run.runId,
    type: 'clarification_required',
    summary: 'Owner requested a repair',
    requestedAction: 'Confirm the requested repair',
    targetUrl: prUrl,
    blocking: true,
    now: new Date('2030-01-01T00:00:00.000Z'),
    githubComment: async () => ({
      html_url: `${prUrl}#issuecomment-600`,
    }),
  })
  await assert.rejects(
    recordOwnerResponse({
      loopRoot,
      runId: run.runId,
      responseUrl: `${prUrl}#pullrequestreview-700`,
      githubApi: async () => ({
        user: { login: 'codeacme17' },
        body: 'Please repair this older revision.',
        state: 'CHANGES_REQUESTED',
        commit_id: '2'.repeat(40),
        submitted_at: '2030-01-01T00:01:00.000Z',
      }),
    }),
    /current, run-bound decision/,
  )
  await recordOwnerResponse({
    loopRoot,
    runId: run.runId,
    responseUrl: `${prUrl}#issuecomment-601`,
    now: new Date('2030-01-01T00:01:30.000Z'),
    githubApi: async () => ({
      user: { login: 'codeacme17' },
      body: `Please repair this. RESUME ${run.runId}`,
      created_at: '2030-01-01T00:01:00.000Z',
    }),
  })
  await transitionRun({
    loopRoot,
    runId: run.runId,
    status: 'running',
    now: new Date('2030-01-01T00:02:00.000Z'),
  })
  const currentRun = JSON.parse(
    await readFile(path.join(loopRoot, 'logs', 'runs', run.runId, 'run.json'), 'utf8'),
  )
  const resultPath = path.join(
    loopRoot,
    'logs',
    'runs',
    run.runId,
    'implementation-result-owner-repair.json',
  )
  await writeFile(
    resultPath,
    `${JSON.stringify({
      schemaVersion: 1,
      runId: run.runId,
      agent: '$implement',
      invocationId: 'impl-owner-repair',
      startedAt: '2030-01-01T00:04:00.000Z',
      finishedAt: '2030-01-01T00:05:00.000Z',
      briefDigest: currentRun.briefDigest,
      commitSha: '4'.repeat(40),
      checks: [
        { command: 'pnpm test -- keyboard', status: 'passed' },
        { command: 'pnpm verify', status: 'passed' },
      ],
    })}\n`,
    'utf8',
  )
  await assert.rejects(
    recordImplementation({
      loopRoot,
      runId: run.runId,
      resultPath,
      commitRangeValidator: async () => {},
    }),
    /durably redrafted first/,
  )
  await recordPullRequest({
    loopRoot,
    runId: run.runId,
    prUrl,
    headSha,
    now: new Date('2030-01-01T00:03:00.000Z'),
    githubApi: async (endpoint) =>
      endpoint.includes('/compare/')
        ? { status: 'ahead', base_commit: { sha: '1'.repeat(40) } }
        : pullRequestFixture(run, headSha),
    trailingPathValidator: async () => {},
  })
  const repaired = await recordImplementation({
    loopRoot,
    runId: run.runId,
    resultPath,
    commitRangeValidator: async () => {},
  })
  assert.equal(repaired.implementationCommit, '4'.repeat(40))
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
      candidateControlPlaneVerifier: async () => {
        throw new Error('candidate changed protected workflow')
      },
      githubApi: async () => {
        throw new Error('GitHub must not be queried before local control-plane verification')
      },
    }),
    /candidate changed protected workflow/,
  )
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
  const advancedDevRun = successfulWorkflowRun(run, headSha, 301, 800)
  advancedDevRun.pull_requests[0].base.sha = 'f'.repeat(40)
  const advancedManifest = JSON.parse(manifestSource)
  advancedManifest.workflowBaseSha = 'f'.repeat(40)
  const advancedManifestSource = `${JSON.stringify(advancedManifest, null, 2)}\n`
  await writeFile(manifestPath, advancedManifestSource, 'utf8')
  const recorded = await recordEvidence({
    loopRoot,
    runId: run.runId,
    manifestPath,
    publicationUrl: 'https://github.com/codeacme17/echo-ui/actions/runs/800/artifacts/900',
    githubApi: async (endpoint) =>
      endpoint.includes('/actions/artifacts/') ? artifact : advancedDevRun,
    artifactManifestLoader: async () => advancedManifestSource,
  })
  assert.equal(recorded.headSha, headSha)
  await writeFile(manifestPath, manifestSource, 'utf8')

  const implementationEvent = (
    await readFile(path.join(loopRoot, 'logs', 'runs', run.runId, 'events.jsonl'), 'utf8')
  )
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .findLast((event) => event.type === 'implementation_completed')
  const implementationResultPath = path.resolve(loopRoot, implementationEvent.payload.resultPath)
  const implementationResultSource = await readFile(implementationResultPath, 'utf8')
  const mutatedImplementationResult = JSON.parse(implementationResultSource)
  mutatedImplementationResult.checks.push({ command: 'pnpm test -- injected', status: 'passed' })
  await writeFile(
    implementationResultPath,
    `${JSON.stringify(mutatedImplementationResult)}\n`,
    'utf8',
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
      artifactManifestLoader: async () => manifestSource,
    }),
    /\$implement result no longer matches its recorded digest/,
  )
  await writeFile(implementationResultPath, implementationResultSource, 'utf8')
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
  const incomplete = pullRequestFixture(run, nextHead)
  const ownerAuthored = pullRequestFixture(run, nextHead)
  ownerAuthored.user = { login: 'codeacme17' }
  await assert.rejects(
    recordPullRequest({
      loopRoot,
      runId: run.runId,
      prUrl,
      headSha: nextHead,
      githubApi: async (endpoint) =>
        endpoint.includes('/compare/')
          ? { status: 'ahead', base_commit: { sha: '1'.repeat(40) } }
          : ownerAuthored,
      trailingPathValidator: async () => {},
    }),
    /record-pr requires a live Draft PR/,
  )
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
  assert.equal(JSON.parse(resolveResult.stdout).baseSha, run.baseSha)

  const output = path.join(loopRoot, 'evidence', run.runId, 'manifest.json')
  await execFileAsync(
    process.execPath,
    [
      path.join(repositoryLoopRoot, 'scripts', 'generate-evidence.mjs'),
      '--loop-root',
      loopRoot,
      '--run-id',
      run.runId,
      '--head-sha',
      headSha,
      '--trusted-workflow-sha',
      run.baseSha,
      '--workflow-base-sha',
      run.baseSha,
      '--workflow-run-sha',
      headSha,
      '--status',
      'passed',
      '--baseline-status',
      'passed',
      '--started-at',
      '2026-07-22T16:00:00Z',
      '--finished-at',
      '2026-07-22T16:10:00Z',
      '--output',
      output,
    ],
    {
      env: {
        ...process.env,
        GITHUB_ACTIONS: 'false',
      },
    },
  )
  const evidence = JSON.parse(await readFile(output, 'utf8'))
  assert.equal(evidence.headSha, headSha)
  assert.equal(evidence.screenshots[1].path, screenshotRelativePath)
  assert.equal(evidence.screenshots[1].width, 937)
  assert.equal(evidence.screenshots[1].height, 569)
  assert.match(evidence.screenshots[1].sha256, /^[0-9a-f]{64}$/)
})

test('owner-review waiting transition keeps the exact verified PR Draft and remains resumable', async () => {
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
  const reviewDigest = reviewPublicationDigest(JSON.parse(await readFile(reviewPath, 'utf8')))
  await recordReview({
    loopRoot,
    runId: run.runId,
    resultPath: reviewPath,
    reviewUrl: `${prUrl}#pullrequestreview-300`,
    githubApi: async (endpoint) => {
      if (endpoint.endsWith('/pulls/200/reviews?per_page=100&page=1')) {
        return [
          publishedReviewFixture({
            id: 300,
            runId: run.runId,
            round: 1,
            headSha,
          }),
        ]
      }
      if (endpoint.includes('/comments?')) return []
      if (endpoint.endsWith('/pulls/200')) return pullRequestFixture(run, headSha)
      return {
        commit_id: headSha,
        state: 'COMMENTED',
        submitted_at: '2026-07-22T17:00:00.000Z',
        user: { login: 'echo-ui-reviewer[bot]' },
        body: [
          'PASS',
          `<!-- issue-dev-loop:${run.runId}:review-cycle:1:round:1:head:${headSha} -->`,
          `<!-- issue-dev-loop:${run.runId}:review-result-sha256:${reviewDigest} -->`,
        ].join('\n'),
      }
    },
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })

  const ownerReadyPullRequest = pullRequestFixture(run, headSha, { draft: true })
  ownerReadyPullRequest.body = ownerReadyPullRequest.body
    .replace(
      'Exact-head workflow evidence is attached or pending for this draft.',
      'https://github.com/codeacme17/echo-ui/actions/runs/101/artifacts/201',
    )
    .replace(
      'Fresh-context review is attached or pending for this draft.',
      `${prUrl}#pullrequestreview-300`,
    )

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
    now: new Date('2030-07-23T08:30:00.000Z'),
    githubComment: async () => ({
      html_url: `${prUrl}#issuecomment-8802`,
    }),
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })

  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
      githubApi: async () => pullRequestFixture(run, headSha, { draft: false }),
    }),
    /exact-head evidence and review links/,
  )

  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
      githubApi: async () => ({
        ...ownerReadyPullRequest,
        base: { ref: 'main', repo: { full_name: 'codeacme17/echo-ui' } },
      }),
    }),
    /automation-authored live Draft PR/,
  )

  const failedCommandPullRequest = structuredClone(ownerReadyPullRequest)
  failedCommandPullRequest.body = failedCommandPullRequest.body.replace(
    '- `pnpm test -- keyboard`: passed (exit code 0)',
    '- `pnpm test -- keyboard`: failed (exit code 1)',
  )
  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
      githubApi: async () => failedCommandPullRequest,
    }),
    /exact-head evidence and review links/,
  )

  const ambiguousCommandPullRequest = structuredClone(ownerReadyPullRequest)
  ambiguousCommandPullRequest.body = ambiguousCommandPullRequest.body.replace(
    '- `pnpm test -- keyboard`: passed (exit code 0)',
    '- `pnpm test -- keyboard`: passed (exit code 0) — actually failed',
  )
  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
      githubApi: async () => ambiguousCommandPullRequest,
    }),
    /exact-head evidence and review links/,
  )

  const hiddenCommandPullRequest = structuredClone(ownerReadyPullRequest)
  hiddenCommandPullRequest.body = hiddenCommandPullRequest.body.replace(
    '- `pnpm test -- keyboard`: passed (exit code 0)',
    '<!-- - `pnpm test -- keyboard`: passed (exit code 0) -->\n- `pnpm test -- keyboard`: failed (exit code 1)',
  )
  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
      githubApi: async () => hiddenCommandPullRequest,
    }),
    /exact-head evidence and review links/,
  )

  const unclosedCommentPullRequest = structuredClone(ownerReadyPullRequest)
  unclosedCommentPullRequest.body = unclosedCommentPullRequest.body.replace(
    '- `pnpm test -- keyboard`: passed (exit code 0)',
    '<!-- hidden through EOF\n- `pnpm test -- keyboard`: passed (exit code 0)',
  )
  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
      githubApi: async () => unclosedCommentPullRequest,
    }),
    /exact-head evidence and review links/,
  )

  const crossSectionCommentPullRequest = structuredClone(ownerReadyPullRequest)
  crossSectionCommentPullRequest.body = crossSectionCommentPullRequest.body.replace(
    '## Acceptance criteria\nAll frozen acceptance criteria are covered.',
    '## Acceptance criteria\nAll frozen acceptance criteria are covered.\n<!-- hidden through EOF',
  )
  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
      githubApi: async () => crossSectionCommentPullRequest,
    }),
    /exact-head evidence and review links/,
  )

  const duplicateCommandPullRequest = structuredClone(ownerReadyPullRequest)
  duplicateCommandPullRequest.body = duplicateCommandPullRequest.body.replace(
    '- `pnpm test -- keyboard`: passed (exit code 0)',
    '- `pnpm test -- keyboard`: passed (exit code 0)\n- `pnpm test -- keyboard`: passed (exit code 0)',
  )
  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
      githubApi: async () => duplicateCommandPullRequest,
    }),
    /exact-head evidence and review links/,
  )

  const mutatedManifest = JSON.parse(manifestSource)
  mutatedManifest.checks.push({
    command: 'pnpm test -- injected',
    status: 'passed',
    exitCode: 0,
    startedAt: '2026-07-22T16:30:00.000Z',
    finishedAt: '2026-07-22T16:30:00.000Z',
    artifactUrl: null,
  })
  await writeFile(manifestPath, `${JSON.stringify(mutatedManifest)}\n`, 'utf8')
  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl,
      headSha,
      githubApi: async () => ownerReadyPullRequest,
    }),
    /evidence manifest no longer matches its digest/,
  )
  await writeFile(manifestPath, manifestSource, 'utf8')

  const paused = await transitionRun({
    loopRoot,
    runId: run.runId,
    status: 'awaiting_owner_review',
    prUrl,
    headSha,
    now: new Date('2030-07-23T08:42:00.000Z'),
    githubApi: async () => ownerReadyPullRequest,
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

  const completionCommentUrl = `${prUrl}#issuecomment-8803`
  const finalizationCommentUrl =
    'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9900'
  let preparedCompletion
  const completionGithubApi = async (endpoint) => {
    if (endpoint.includes('/reviews')) {
      return [
        {
          user: { login: 'codeacme17' },
          state: 'APPROVED',
          commit_id: headSha,
          submitted_at: '2030-07-23T08:41:00.000Z',
        },
      ]
    }
    if (endpoint.includes('/timeline')) {
      return [
        {
          event: 'ready_for_review',
          actor: { login: 'codeacme17' },
          created_at: '2030-07-23T08:40:00.000Z',
        },
      ]
    }
    if (endpoint.endsWith('/issues/comments/8802')) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        created_at: '2030-07-23T08:30:00.000Z',
        body: `@codeacme17 **pr_ready_for_review**\n\nRun: \`${run.runId}\``,
      }
    }
    if (endpoint.endsWith('/issues/comments/8803')) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        created_at: '2030-07-23T08:50:00.000Z',
        body: `@codeacme17 **pr_completed**\n\nRun: \`${run.runId}\`\n\nMerge: \`${'9'.repeat(40)}\``,
      }
    }
    if (endpoint.endsWith('/issues/comments/9900')) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        body: preparedCompletion.body,
      }
    }
    return {
      ...pullRequestFixture(run, headSha, { draft: false, merged: true }),
      merged_at: '2030-07-23T08:45:00.000Z',
    }
  }
  await assert.rejects(
    prepareFinalizationRecord({
      loopRoot,
      runId: run.runId,
      status: 'completed',
      finishedAt: new Date('2030-07-23T09:00:00.000Z'),
      mergeSha: '9'.repeat(40),
      githubApi: completionGithubApi,
      notifyOwner: async () => ({
        delivery: {
          github: 'failed: unavailable',
          webhook: 'not_configured',
        },
      }),
    }),
    /durable GitHub delivery and a settled webhook attempt/,
  )
  preparedCompletion = await prepareFinalizationRecord({
    loopRoot,
    runId: run.runId,
    status: 'completed',
    finishedAt: new Date('2030-07-23T09:00:00.000Z'),
    mergeSha: '9'.repeat(40),
    githubApi: completionGithubApi,
    checkpointVerifier: bypassCheckpointVerifier,
    notifyOwner: async (notification) => {
      assert.equal(notification.recordEvent, false)
      assert.equal(notification.type, 'pr_completed')
      return {
        delivery: {
          github: 'delivered',
          githubUrl: completionCommentUrl,
          webhook: 'failed: timed out after 5ms',
        },
      }
    },
  })
  await assert.rejects(
    verifyTerminalExternalProof({
      loopRoot,
      record: {
        ...preparedCompletion.record,
        completionNotifiedAt: '2030-07-23T08:40:00.000Z',
      },
      githubApi: async (endpoint) => {
        if (endpoint.endsWith('/issues/comments/8803')) {
          return {
            user: { login: 'echo-ui-loop[bot]' },
            created_at: '2030-07-23T08:40:00.000Z',
            body: `@codeacme17 **pr_completed**\n\nRun: \`${run.runId}\`\n\nMerge: \`${'9'.repeat(40)}\``,
          }
        }
        return completionGithubApi(endpoint)
      },
    }),
    /completion-notification timestamp/,
  )
  await assert.rejects(
    verifyTerminalExternalProof({
      loopRoot,
      record: {
        ...preparedCompletion.record,
        readyNotifiedAt: '2099-01-01T00:00:00.000Z',
        completionNotifiedAt: '2099-01-02T00:00:00.000Z',
        finishedAt: '2099-01-03T00:00:00.000Z',
      },
      githubApi: async (endpoint) => {
        if (endpoint.endsWith('/issues/comments/8802')) {
          return {
            user: { login: 'echo-ui-loop[bot]' },
            created_at: '2099-01-01T00:00:00.000Z',
            body: `@codeacme17 **pr_ready_for_review**\n\nRun: \`${run.runId}\``,
          }
        }
        return completionGithubApi(endpoint)
      },
    }),
    /owner-authored Ready transition/,
  )
  const finalized = await observeOwnerMerge({
    loopRoot,
    runId: run.runId,
    now: new Date('2030-07-23T09:00:00Z'),
    githubApi: completionGithubApi,
    releaseIssueClaim: async () => {},
    finalizationResultPath: preparedCompletion.resultPath,
    finalizationCommentUrl,
  })
  assert.equal(finalized.status, 'completed')
  assert.equal(finalized.mergeSha, '9'.repeat(40))
  assert.equal(finalized.finishedAt, '2030-07-23T09:00:00.000Z')
  const completedEvents = await readFile(
    path.join(loopRoot, 'logs', 'runs', run.runId, 'events.jsonl'),
    'utf8',
  )
  assert.match(completedEvents, /"notificationType":"pr_completed"/)
  assert.ok(
    completedEvents.indexOf('"notificationType":"pr_completed"') <
      completedEvents.indexOf('"type":"pr_merged"'),
  )
  const reconciledFinalization = await reconcileFinalizationJournal({
    loopRoot,
    now: new Date('2030-07-23T09:01:00.000Z'),
    githubPaginatedApi: async () => [
      {
        user: { login: 'echo-ui-loop[bot]' },
        html_url: finalizationCommentUrl,
        body: preparedCompletion.body,
      },
    ],
    githubApi: completionGithubApi,
  })
  assert.deepEqual(reconciledFinalization.durableRunIds, [run.runId])
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
      githubApi: async (endpoint) => {
        if (endpoint.includes('/reviews')) {
          return [{ user: { login: 'codeacme17' }, state: 'APPROVED', commit_id: headSha }]
        }
        if (endpoint.includes('/timeline')) {
          return [
            {
              event: 'ready_for_review',
              actor: { login: 'codeacme17' },
              created_at: '2026-07-23T08:30:00.000Z',
            },
          ]
        }
        return {
          ...pullRequestFixture(run, headSha, { draft: false }),
          merged: false,
          merged_by: null,
          merge_commit_sha: null,
        }
      },
      releaseIssueClaim: async () => {
        released = true
      },
    }),
    /durable Ready and completion notifications|not approved and merged by the configured owner/,
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
      githubApi: async (endpoint) => {
        if (endpoint.includes('/reviews')) {
          return [{ user: { login: 'codeacme17' }, state: 'APPROVED', commit_id: headSha }]
        }
        if (endpoint.includes('/timeline')) {
          return [
            {
              event: 'ready_for_review',
              actor: { login: 'codeacme17' },
              created_at: '2026-07-23T08:30:00.000Z',
            },
          ]
        }
        return {
          ...pullRequestFixture(run, headSha, { draft: false }),
          merged: false,
          merged_by: null,
          merge_commit_sha: null,
        }
      },
      releaseIssueClaim: async () => {
        released = true
      },
    }),
    /matching durable finalization record/,
  )
  assert.equal(released, false)
})

test('forged local blocked finalization cannot release an issue claim', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 151,
    issueTitle: 'Blocked finalization proof',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/151',
    entropy: 'block151',
  })
  const finishedAt = '2030-01-01T00:00:02.000Z'
  const failureFingerprint = 'forged-local-blocker'
  const runPath = path.join(loopRoot, 'logs', 'runs', run.runId)
  const record = {
    schemaVersion: 1,
    runId: run.runId,
    issueNumber: run.issueNumber,
    status: 'blocked',
    startedAt: run.startedAt,
    finishedAt,
    prUrl: null,
    headSha: null,
    mergeSha: null,
    failureFingerprint,
    notificationUrl: `${run.issueUrl}#issuecomment-8800`,
    readyNotificationUrl: null,
    readyNotifiedAt: null,
    completionNotifiedAt: null,
    notificationWebhookStatus: null,
    predecessorCheckpointUrl: 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-8801',
    predecessorCheckpointDigest: 'a'.repeat(64),
    pauseStartedAt: '2030-01-01T00:00:00.000Z',
    notificationNotifiedAt: '2030-01-01T00:01:00.000Z',
  }
  await writeFile(
    path.join(runPath, 'run.json'),
    `${JSON.stringify({ ...run, status: 'blocked', finishedAt })}\n`,
    'utf8',
  )
  await writeFile(
    path.join(runPath, 'finalization-result.json'),
    `${canonicalRecord(record)}\n`,
    'utf8',
  )
  const existingEvents = await readFile(path.join(runPath, 'events.jsonl'), 'utf8')
  await writeFile(
    path.join(runPath, 'events.jsonl'),
    `${existingEvents}${[
      {
        schemaVersion: 1,
        runId: run.runId,
        type: 'finalization_published',
        timestamp: finishedAt,
        status: 'blocked',
        payload: {
          commentUrl: 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9900',
          digest: recordDigest(record),
          finishedAt,
          mergeSha: null,
          failureFingerprint,
          notificationUrl: record.notificationUrl,
        },
      },
      {
        schemaVersion: 1,
        runId: run.runId,
        type: 'run_finalization_authorized',
        timestamp: '2030-01-01T00:00:03.000Z',
        status: 'blocked',
        payload: {
          previousStatus: 'waiting_for_owner',
          finishedAt,
          failureFingerprint,
        },
      },
    ]
      .map((event) => JSON.stringify(event))
      .join('\n')}\n`,
    'utf8',
  )
  let released = false
  await assert.rejects(
    finalizeRun({
      loopRoot,
      runId: run.runId,
      status: 'blocked',
      failureFingerprint,
      githubApi: async (endpoint) =>
        endpoint.endsWith('/issues/comments/8800')
          ? {
              user: { login: 'echo-ui-loop[bot]' },
              created_at: '2030-01-01T00:01:00.000Z',
              body: `@codeacme17 **blocked**\n\nRun: \`${run.runId}\``,
            }
          : { user: { login: 'echo-ui-loop[bot]' }, body: 'forged journal publication' },
      releaseIssueClaim: async () => {
        released = true
      },
    }),
    /checkpoint|does not attest the exact record/,
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
      cycle: 1,
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
              findingId: 'RVW-1-1-1',
              severity: 'P2',
              confidence: 'high',
              headSha: 'e'.repeat(40),
              inlineCommentId: 9001,
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
            {
              findingId: 'RVW-1-1-2',
              severity: 'P3',
              confidence: 'high',
              headSha: 'e'.repeat(40),
              inlineCommentId: null,
              problem: 'Duplicated branch',
              evidence: 'The duplicate branch is visible in the reviewed diff.',
              expectedResolution: 'Remove or justify the duplicate branch.',
              resolution: {
                classification: 'rejected',
                responseUrl: 'https://github.com/codeacme17/echo-ui/pull/300#issuecomment-401',
                evidence: 'The branches cover distinct state transitions.',
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
  const digest = reviewPublicationDigest(JSON.parse(await readFile(resultPath, 'utf8')))
  const wrongRoundResultPath = path.join(
    loopRoot,
    'logs',
    'runs',
    run.runId,
    'review-result-wrong-round.json',
  )
  const wrongRoundResult = JSON.parse(await readFile(resultPath, 'utf8'))
  wrongRoundResult.rounds[0].findings[0].findingId = 'RVW-1-2-1'
  await writeFile(wrongRoundResultPath, `${JSON.stringify(wrongRoundResult)}\n`, 'utf8')
  await assert.rejects(
    recordReview({
      loopRoot,
      runId: run.runId,
      resultPath: wrongRoundResultPath,
      reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/300#pullrequestreview-500',
      githubApi: async () => {
        throw new Error('GitHub must not be queried for an invalid round ID')
      },
    }),
    /invalid or duplicate finding ID: RVW-1-2-1/,
  )
  const duplicateResponseResultPath = path.join(
    loopRoot,
    'logs',
    'runs',
    run.runId,
    'review-result-duplicate-response.json',
  )
  const duplicateResponseResult = JSON.parse(await readFile(resultPath, 'utf8'))
  duplicateResponseResult.rounds[0].findings[1].resolution.responseUrl =
    duplicateResponseResult.rounds[0].findings[0].resolution.responseUrl
  await writeFile(
    duplicateResponseResultPath,
    `${JSON.stringify(duplicateResponseResult)}\n`,
    'utf8',
  )
  const duplicateResponseDigest = reviewPublicationDigest(duplicateResponseResult)

  const reviewGithubApi =
    ({
      includePriorFinding = true,
      duplicateInlineFinding = false,
      publicationDigest = digest,
    } = {}) =>
    async (endpoint) => {
      if (endpoint.endsWith('/pulls/300/reviews?per_page=100&page=1')) {
        return [
          publishedReviewFixture({
            id: 499,
            runId: run.runId,
            round: 1,
            headSha: 'e'.repeat(40),
          }),
          publishedReviewFixture({
            id: 500,
            runId: run.runId,
            round: 2,
            headSha,
          }),
        ]
      }
      if (endpoint.endsWith('/reviews/499/comments?per_page=100&page=1')) {
        const inlineFinding = {
          id: 9001,
          user: { login: 'echo-ui-reviewer[bot]' },
          path: 'src/keyboard.ts',
          line: 12,
          body: [
            'RVW-1-1-1',
            'P2',
            'high',
            'Incorrect assertion',
            'The runtime check already guarantees this invariant.',
            'Prove or fix the assertion.',
            `<!-- issue-dev-loop:${run.runId}:RVW-1-1-1 -->`,
          ].join('\n'),
        }
        return duplicateInlineFinding
          ? [
              inlineFinding,
              {
                ...inlineFinding,
                id: 9002,
              },
            ]
          : [inlineFinding]
      }
      if (endpoint.endsWith('/comments?per_page=100&page=1')) return []
      if (endpoint.includes('/issues/comments/400')) {
        return {
          user: { login: 'echo-ui-loop[bot]' },
          created_at: '2026-07-22T17:00:00.000Z',
          body: `Rejected with proof. Reproduction command exits successfully.\n<!-- issue-dev-loop:${run.runId}:RVW-1-1-1:rejected -->`,
        }
      }
      if (endpoint.includes('/issues/comments/401')) {
        return {
          user: { login: 'echo-ui-loop[bot]' },
          created_at: '2026-07-22T17:01:00.000Z',
          body: `The branches cover distinct state transitions.\n<!-- issue-dev-loop:${run.runId}:RVW-1-1-2:rejected -->`,
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
              'RVW-1-1-1',
              'P2',
              'high',
              'Incorrect assertion',
              'The runtime check already guarantees this invariant.',
              'Prove or fix the assertion.',
              `<!-- issue-dev-loop:${run.runId}:RVW-1-1-1 -->`,
              'RVW-1-1-2',
              'P3',
              'high',
              'Duplicated branch',
              'The duplicate branch is visible in the reviewed diff.',
              'Remove or justify the duplicate branch.',
              `<!-- issue-dev-loop:${run.runId}:RVW-1-1-2 -->`,
              `<!-- issue-dev-loop:${run.runId}:review-cycle:1:round:1:head:${'e'.repeat(40)} -->`,
            ].join('\n')
          : [
              'PASS',
              ...(includePriorFinding
                ? ['Resolved RVW-1-1-1 and RVW-1-1-2 with published executor responses.']
                : []),
              `<!-- issue-dev-loop:${run.runId}:review-cycle:1:round:2:head:${headSha} -->`,
              `<!-- issue-dev-loop:${run.runId}:review-result-sha256:${publicationDigest} -->`,
            ].join('\n'),
      }
    }

  await assert.rejects(
    recordReview({
      loopRoot,
      runId: run.runId,
      resultPath,
      reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/300#pullrequestreview-500',
      githubApi: reviewGithubApi({ duplicateInlineFinding: true }),
    }),
    /unrecorded reviewer inline comment/,
  )
  await assert.rejects(
    recordReview({
      loopRoot,
      runId: run.runId,
      resultPath: duplicateResponseResultPath,
      reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/300#pullrequestreview-500',
      githubApi: reviewGithubApi({ publicationDigest: duplicateResponseDigest }),
    }),
    /response comment cannot adjudicate multiple findings/,
  )
  await assert.rejects(
    recordReview({
      loopRoot,
      runId: run.runId,
      resultPath,
      reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/300#pullrequestreview-500',
      githubApi: reviewGithubApi({ includePriorFinding: false }),
    }),
    /unrecorded findings/,
  )
  const recorded = await recordReview({
    loopRoot,
    runId: run.runId,
    resultPath,
    reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/300#pullrequestreview-500',
    githubApi: reviewGithubApi(),
  })
  assert.equal(recorded.findingCount, 2)
  assert.equal(recorded.rounds, 2)
})

test('review gate rejects GitHub findings omitted from the durable result', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 150,
    issueTitle: 'Exhaustive review proof',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/150',
    entropy: 'rev150',
  })
  const headSha = 'f'.repeat(40)
  const prUrl = await recordFixturePr({ loopRoot, run, headSha, number: 350 })
  const resultPath = await writePassingReview({
    loopRoot,
    run,
    headSha,
    prNumber: 350,
    reviewId: 500,
  })
  const digest = reviewPublicationDigest(JSON.parse(await readFile(resultPath, 'utf8')))
  await assert.rejects(
    recordReview({
      loopRoot,
      runId: run.runId,
      resultPath,
      reviewUrl: `${prUrl}#pullrequestreview-500`,
      githubApi: async (endpoint) => {
        if (endpoint.endsWith('/pulls/350/reviews?per_page=100&page=1')) {
          return [
            publishedReviewFixture({
              id: 499,
              runId: run.runId,
              round: 1,
              headSha: 'e'.repeat(40),
            }),
            publishedReviewFixture({
              id: 500,
              runId: run.runId,
              round: 1,
              headSha,
            }),
          ]
        }
        throw new Error(`unexpected endpoint after exhaustive membership failure: ${endpoint}`)
      },
    }),
    /include every reviewer publication/,
  )
  let secondCommentPageFetched = false
  await assert.rejects(
    recordReview({
      loopRoot,
      runId: run.runId,
      resultPath,
      reviewUrl: `${prUrl}#pullrequestreview-500`,
      githubApi: async (endpoint) => {
        if (endpoint.endsWith('/pulls/350/reviews?per_page=100&page=1')) {
          return [
            publishedReviewFixture({
              id: 500,
              runId: run.runId,
              round: 1,
              headSha,
            }),
          ]
        }
        if (endpoint.endsWith('/comments?per_page=100&page=1')) {
          return Array.from({ length: 100 }, (_, index) => ({
            id: index + 1,
            user: { login: 'echo-ui-reviewer[bot]' },
            path: 'src/context.ts',
            line: index + 1,
            body: `Reviewer context ${index + 1}`,
          }))
        }
        if (endpoint.endsWith('/comments?per_page=100&page=2')) {
          secondCommentPageFetched = true
          return [
            {
              id: 101,
              user: { login: 'echo-ui-reviewer[bot]' },
              path: 'src/untracked.ts',
              line: 101,
              body: 'RVW-1-1-1: omitted finding beyond the first page.',
            },
          ]
        }
        if (endpoint.endsWith('/pulls/350')) return pullRequestFixture(run, headSha)
        return {
          commit_id: headSha,
          state: 'COMMENTED',
          submitted_at: '2026-07-22T18:00:00.000Z',
          user: { login: 'echo-ui-reviewer[bot]' },
          body: [
            'PASS',
            `<!-- issue-dev-loop:${run.runId}:review-cycle:1:round:1:head:${headSha} -->`,
            `<!-- issue-dev-loop:${run.runId}:review-result-sha256:${digest} -->`,
          ].join('\n'),
        }
      },
    }),
    /unrecorded findings/,
  )
  assert.equal(secondCommentPageFetched, true)
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
    cycle: 1,
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
            findingId: 'RVW-1-1-1',
            severity: 'P2',
            confidence: 'high',
            headSha: findingHead,
            inlineCommentId: null,
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
  const digest = reviewPublicationDigest(JSON.parse(await readFile(resultPath, 'utf8')))
  const recorded = await recordReview({
    loopRoot,
    runId: run.runId,
    resultPath,
    reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/304#pullrequestreview-510',
    githubApi: async (endpoint) => {
      if (endpoint.endsWith('/pulls/304/reviews?per_page=100&page=1')) {
        return [
          publishedReviewFixture({
            id: 509,
            runId: run.runId,
            round: 1,
            headSha: findingHead,
          }),
          publishedReviewFixture({
            id: 510,
            runId: run.runId,
            round: 2,
            headSha,
          }),
        ]
      }
      if (endpoint.endsWith('/comments?per_page=100&page=1')) return []
      if (endpoint.includes('/issues/comments/410')) {
        return {
          user: { login: 'echo-ui-loop[bot]' },
          created_at: '2026-07-22T17:40:00.000Z',
          body: `pnpm verify passes after the guard. ${fixCommit}\n<!-- issue-dev-loop:${run.runId}:RVW-1-1-1:accepted -->`,
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
              'RVW-1-1-1',
              'P2',
              'high',
              'Missing guard',
              'The failure is reproducible.',
              'Add the guard.',
              `<!-- issue-dev-loop:${run.runId}:RVW-1-1-1 -->`,
              `<!-- issue-dev-loop:${run.runId}:review-cycle:1:round:1:head:${findingHead} -->`,
            ].join('\n')
          : [
              'PASS',
              'Resolved RVW-1-1-1 with the published executor response.',
              `<!-- issue-dev-loop:${run.runId}:review-cycle:1:round:2:head:${headSha} -->`,
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
      cycle: 1,
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
              findingId: 'RVW-1-1-1',
              severity: 'P1',
              confidence: 'high',
              headSha,
              inlineCommentId: null,
              problem: 'Potential public API break',
              evidence: 'The export changed.',
              expectedResolution: 'Restore compatibility or adjudicate.',
              resolution: {
                classification: 'rejected',
                responseUrl: 'https://github.com/codeacme17/echo-ui/pull/302#issuecomment-401',
                evidence: 'Executor disagrees.',
                adjudicationUrl:
                  'https://github.com/codeacme17/echo-ui/pull/302#pullrequestreview-502',
                adjudicationVerdict: 'REJECT_FINDING',
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
  let digest = reviewPublicationDigest(JSON.parse(await readFile(resultPath, 'utf8')))
  const adjudicationGithubApi = (adjudicatorLogin) => async (endpoint) => {
    if (endpoint.endsWith('/pulls/302/reviews?per_page=100&page=1')) {
      return [
        publishedReviewFixture({
          id: 500,
          runId: run.runId,
          round: 1,
          headSha,
        }),
        publishedReviewFixture({
          id: 501,
          runId: run.runId,
          round: 2,
          headSha,
        }),
        {
          id: 502,
          commit_id: headSha,
          state: 'COMMENTED',
          submitted_at: '2026-07-22T17:10:00.000Z',
          user: { login: adjudicatorLogin },
          body: `<!-- issue-dev-loop:${run.runId}:RVW-1-1-1:adjudication:REJECT_FINDING:head:${headSha} -->`,
        },
      ]
    }
    if (endpoint.endsWith('/comments?per_page=100&page=1')) return []
    if (endpoint.includes('/issues/comments/401')) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        created_at: '2026-07-22T17:00:00.000Z',
        body: `Executor disagrees.\n<!-- issue-dev-loop:${run.runId}:RVW-1-1-1:rejected -->`,
      }
    }
    if (endpoint.endsWith('/pulls/302/reviews/502')) {
      return {
        commit_id: headSha,
        state: 'COMMENTED',
        submitted_at: '2026-07-22T17:10:00.000Z',
        user: { login: adjudicatorLogin },
        body: `<!-- issue-dev-loop:${run.runId}:RVW-1-1-1:adjudication:REJECT_FINDING:head:${headSha} -->`,
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
            'RVW-1-1-1',
            'P1',
            'high',
            'Potential public API break',
            'The export changed.',
            'Restore compatibility or adjudicate.',
            `<!-- issue-dev-loop:${run.runId}:RVW-1-1-1 -->`,
            `<!-- issue-dev-loop:${run.runId}:review-cycle:1:round:1:head:${headSha} -->`,
          ].join('\n')
        : [
            'PASS',
            'Resolved RVW-1-1-1 through the recorded adjudication.',
            `<!-- issue-dev-loop:${run.runId}:review-cycle:1:round:2:head:${headSha} -->`,
            `<!-- issue-dev-loop:${run.runId}:review-result-sha256:${digest} -->`,
          ].join('\n'),
    }
  }
  await assert.rejects(
    recordReview({
      loopRoot,
      runId: run.runId,
      resultPath,
      reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/302#pullrequestreview-501',
      githubApi: adjudicationGithubApi('codeacme17'),
    }),
    /lacks independent published adjudication/,
  )
  const originalResult = JSON.parse(await readFile(resultPath, 'utf8'))
  const reusedCycleResult = structuredClone(originalResult)
  reusedCycleResult.rounds[0].findings[0].resolution.adjudicationUrl =
    'https://github.com/codeacme17/echo-ui/pull/302#pullrequestreview-500'
  await writeFile(resultPath, `${JSON.stringify(reusedCycleResult)}\n`, 'utf8')
  digest = reviewPublicationDigest(reusedCycleResult)
  const reusedCycleBaseApi = adjudicationGithubApi('echo-ui-reviewer[bot]')
  await assert.rejects(
    recordReview({
      loopRoot,
      runId: run.runId,
      resultPath,
      reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/302#pullrequestreview-501',
      githubApi: async (endpoint) => {
        const response = await reusedCycleBaseApi(endpoint)
        if (endpoint.endsWith('/pulls/302/reviews/500')) {
          return {
            ...response,
            body: [
              response.body,
              `<!-- issue-dev-loop:${run.runId}:RVW-1-1-1:adjudication:REJECT_FINDING:head:${headSha} -->`,
            ].join('\n'),
          }
        }
        return response
      },
    }),
    /lacks independent published adjudication/,
  )
  await writeFile(resultPath, `${JSON.stringify(originalResult)}\n`, 'utf8')
  digest = reviewPublicationDigest(originalResult)
  const recorded = await recordReview({
    loopRoot,
    runId: run.runId,
    resultPath,
    reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/302#pullrequestreview-501',
    githubApi: adjudicationGithubApi('echo-ui-reviewer[bot]'),
  })
  assert.equal(recorded.findingCount, 1)
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

test('canonical GitHub notification persists before a bounded webhook mirror', async () => {
  const { loopRoot, channelRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 132,
    issueTitle: 'Bound webhook delivery',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/132',
    entropy: 'web001',
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const notification = await createNotification({
    loopRoot,
    runId: run.runId,
    type: 'clarification_required',
    summary: 'A decision is required',
    requestedAction: 'Choose the expected behavior',
    targetUrl: run.issueUrl,
    blocking: true,
    environment: { TEST_LOOP_WEBHOOK_URL: 'https://example.invalid/webhook' },
    githubComment: async () => ({
      html_url: `${run.issueUrl}#issuecomment-800`,
    }),
    fetchImplementation: async () => new Promise(() => {}),
    webhookTimeoutMs: 5,
  })
  assert.equal(notification.delivery.github, 'delivered')
  assert.match(notification.delivery.webhook, /^failed: timed out after 5ms$/)
  const persisted = JSON.parse(
    await readFile(path.join(channelRoot, 'outbox', `${notification.notificationId}.json`), 'utf8'),
  )
  assert.equal(persisted.delivery.github, 'delivered')
  assert.match(persisted.delivery.webhook, /^failed: timed out/)
  const events = (
    await readFile(path.join(loopRoot, 'logs', 'runs', run.runId, 'events.jsonl'), 'utf8')
  )
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line))
  assert.ok(
    events.findIndex((event) => event.type === 'owner_notified') <
      events.findIndex((event) => event.type === 'notification_webhook_finished'),
  )
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
    runtimeRecordOwnerResponse({
      loopRoot,
      runId: run.runId,
      responseUrl,
    }),
    /requires a durable checkpoint/,
  )
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
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

test('failed or blocked finalization rejects a stale notification from an earlier pause', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 152,
    issueTitle: 'Reject stale terminal notification',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/152',
    now: new Date('2030-01-01T10:00:00.000Z'),
    entropy: 'stale152',
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  await createNotification({
    loopRoot,
    runId: run.runId,
    type: 'blocked',
    summary: 'First pause blocker',
    requestedAction: 'Acknowledge the first pause',
    targetUrl: run.issueUrl,
    blocking: true,
    now: new Date('2030-01-01T10:01:00.000Z'),
    githubComment: async () => ({
      html_url: `${run.issueUrl}#issuecomment-8810`,
    }),
  })
  await recordOwnerResponse({
    loopRoot,
    runId: run.runId,
    responseUrl: `${run.issueUrl}#issuecomment-8811`,
    now: new Date('2030-01-01T10:02:00.000Z'),
    githubApi: async () => ({
      user: { login: 'codeacme17' },
      body: `Continue. RESUME ${run.runId}`,
      created_at: '2030-01-01T10:02:00.000Z',
    }),
  })
  await transitionRun({
    loopRoot,
    runId: run.runId,
    status: 'running',
    now: new Date('2030-01-01T10:03:00.000Z'),
  })
  await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  await createNotification({
    loopRoot,
    runId: run.runId,
    type: 'clarification_required',
    summary: 'Second pause needs a different owner decision',
    requestedAction: 'Clarify the second pause',
    targetUrl: run.issueUrl,
    blocking: true,
    now: new Date('2030-01-01T10:04:00.000Z'),
    githubComment: async () => ({
      html_url: `${run.issueUrl}#issuecomment-8812`,
    }),
  })
  const predecessor = await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  await assert.rejects(
    prepareFinalizationRecord({
      loopRoot,
      runId: run.runId,
      status: 'blocked',
      failureFingerprint: 'stale-first-pause',
      finishedAt: new Date('2030-01-01T10:05:00.000Z'),
      checkpointVerifier: async () => ({
        record: predecessor.record,
        digest: predecessor.digest,
        commentUrl: predecessor.commentUrl,
      }),
      githubApi: async () => {
        throw new Error('stale notification must fail before remote publication lookup')
      },
    }),
    /current pause/,
  )
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
  const predecessor = await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
  const pauseStartedAt = predecessor.record.events.findLast(
    (event) => event.type === 'run_status_changed' && event.status === 'waiting_for_owner',
  ).timestamp
  const githubApi = async (endpoint) => {
    if (endpoint.endsWith('/issues/comments/8801')) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        created_at: pauseStartedAt,
        body: `@codeacme17 **blocked**\n\nRun: \`${run.runId}\``,
      }
    }
    return {
      user: { login: 'echo-ui-loop[bot]' },
      body: predecessor.body,
    }
  }
  const checkpointVerifier = async () => ({
    record: predecessor.record,
    digest: predecessor.digest,
    commentUrl: predecessor.commentUrl,
  })
  const firstFinishedAt = new Date(Date.parse(run.startedAt) + 60_000)
  const retryFinishedAt = new Date(Date.parse(run.startedAt) + 120_000)
  const first = await prepareFinalizationRecord({
    loopRoot,
    runId: run.runId,
    status: 'blocked',
    failureFingerprint: 'same-terminal-cause',
    finishedAt: firstFinishedAt,
    githubApi,
    checkpointVerifier,
  })
  const retried = await prepareFinalizationRecord({
    loopRoot,
    runId: run.runId,
    status: 'blocked',
    failureFingerprint: 'same-terminal-cause',
    finishedAt: retryFinishedAt,
    githubApi,
    checkpointVerifier,
  })
  assert.equal(retried.digest, first.digest)
  assert.equal(retried.record.finishedAt, firstFinishedAt.toISOString())
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
      githubComment: async () => ({
        html_url: `${run.issueUrl}#issuecomment-8800`,
      }),
    })
    await publishFixtureCheckpoint({ loopRoot, runId: run.runId })
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
    const durableFinalization = await publishFixtureFinalization({
      loopRoot,
      runId: run.runId,
      status: 'blocked',
      finishedAt: `2030-01-01T00:0${issueNumber - 200}:00.000Z`,
      failureFingerprint: 'browser-environment-unavailable',
    })
    finalizationOptions.githubApi = durableFinalization.githubApi
    await finalizeRun(finalizationOptions)
    if (issueNumber === 201) {
      const durableComment = await durableFinalization.githubApi('finalization-comment')
      const reconciled = await reconcileFinalizationJournal({
        loopRoot,
        githubPaginatedApi: async () => [
          {
            user: { login: 'echo-ui-loop[bot]' },
            html_url: durableFinalization.commentUrl,
            body: durableComment.body,
          },
        ],
        githubApi: durableFinalization.githubApi,
      })
      assert.deepEqual(reconciled.durableRunIds, [run.runId])
      const tombstoned = await reconcileFinalizationJournal({
        loopRoot,
        githubPaginatedApi: async () => [],
      })
      assert.deepEqual(tombstoned.durableRunIds, [])
      await finalizeRun(finalizationOptions)
      const restoredHistory = (await readFile(path.join(loopRoot, 'logs', 'index.jsonl'), 'utf8'))
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line))
      assert.doesNotThrow(() => validateFinalizationHistory(restoredHistory))
      assert.equal(
        restoredHistory.findLast((entry) => entry.runId === run.runId)?.event,
        'run_finalized',
      )
    }
  }
  const metrics = await getEvolveStatus({ loopRoot })
  assert.equal(metrics.evolveDue, true)
  assert.equal(metrics.failedRuns, 3)
  const history = (await readFile(path.join(loopRoot, 'logs', 'index.jsonl'), 'utf8'))
    .split('\n')
    .filter((line) => line.includes('run_finalized'))
  assert.equal(history.length, 4)
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
  const durableRunId = '20260722T120000Z-issue-205-journal'
  const notificationUrl = 'https://github.com/codeacme17/echo-ui/issues/205#issuecomment-8802'
  const predecessorCheckpointUrl =
    'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-8801'
  const pauseStartedAt = '2026-07-22T12:30:00.000Z'
  const checkpointRecord = {
    schemaVersion: 1,
    kind: 'active-checkpoint',
    run: {
      schemaVersion: 1,
      runId: durableRunId,
      issueNumber: 205,
      issueTitle: 'Durable blocked run',
      issueUrl: 'https://github.com/codeacme17/echo-ui/issues/205',
      baseBranch: 'dev',
      baseSha: '0'.repeat(40),
      branch: 'codex/issue-205',
      status: 'waiting_for_owner',
      startedAt: '2026-07-22T12:00:00.000Z',
      finishedAt: null,
      prUrl: null,
      headSha: null,
      mergeSha: null,
      issueSnapshot: {
        title: 'Durable blocked run',
        body: '',
        labels: ['codex-ready'],
        url: 'https://github.com/codeacme17/echo-ui/issues/205',
        capturedAt: '2026-07-22T12:00:00.000Z',
      },
      briefDigest: null,
      uiEvidenceRequired: null,
      implementationCommit: null,
    },
    briefSource: '',
    events: [
      {
        schemaVersion: 1,
        runId: durableRunId,
        type: 'loop_started',
        timestamp: '2026-07-22T12:00:00.000Z',
        status: 'running',
        payload: { issueNumber: 205, branch: 'codex/issue-205' },
      },
      {
        schemaVersion: 1,
        runId: durableRunId,
        type: 'owner_notified',
        timestamp: pauseStartedAt,
        status: 'delivered',
        payload: {
          notificationType: 'blocked',
          delivery: { github: 'delivered' },
          deliveryUrl: notificationUrl,
          targetUrl: 'https://github.com/codeacme17/echo-ui/issues/205',
        },
      },
      {
        schemaVersion: 1,
        runId: durableRunId,
        type: 'run_status_changed',
        timestamp: pauseStartedAt,
        status: 'waiting_for_owner',
        payload: { previousStatus: 'running' },
      },
    ],
    artifacts: [],
    updatedAt: pauseStartedAt,
  }
  const predecessorCheckpointDigest = checkpointDigest(checkpointRecord)
  const checkpointBody = [
    `<!-- issue-dev-loop:checkpoint:${durableRunId}:sha256:${predecessorCheckpointDigest} -->`,
    '```json',
    canonicalCheckpoint(checkpointRecord),
    '```',
  ].join('\n')
  const record = {
    schemaVersion: 1,
    runId: durableRunId,
    issueNumber: 205,
    status: 'blocked',
    startedAt: '2026-07-22T12:00:00.000Z',
    finishedAt: '2026-07-22T13:00:00.000Z',
    prUrl: null,
    headSha: null,
    mergeSha: null,
    failureFingerprint: 'persistent-browser-failure',
    notificationUrl,
    readyNotificationUrl: null,
    readyNotifiedAt: null,
    completionNotifiedAt: null,
    notificationWebhookStatus: null,
    predecessorCheckpointUrl,
    predecessorCheckpointDigest,
    pauseStartedAt,
    notificationNotifiedAt: pauseStartedAt,
  }
  const digest = recordDigest(record)
  const foreignRecord = {
    ...record,
    notificationUrl: 'https://github.com/another/repository/issues/205#issuecomment-8802',
  }
  const foreignDigest = recordDigest(foreignRecord)
  const finalizationComments = [
    {
      user: { login: 'echo-ui-loop[bot]' },
      html_url: 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9901',
      body: [
        `<!-- issue-dev-loop:finalization:${record.runId}:sha256:${digest} -->`,
        '```json',
        canonicalRecord(record),
        '```',
      ].join('\n'),
    },
  ]
  const reconciliationGithubApi = async (endpoint) => {
    if (endpoint.endsWith('/issues/comments/8801')) {
      return { user: { login: 'echo-ui-loop[bot]' }, body: checkpointBody }
    }
    if (endpoint.endsWith('/issues/comments/8802')) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        created_at: pauseStartedAt,
        body: `@codeacme17 **blocked**\n\nRun: \`${record.runId}\``,
      }
    }
    return {
      user: { login: 'echo-ui-loop[bot]' },
      body: finalizationComments[0].body,
    }
  }
  await assert.rejects(
    reconcileFinalizationJournal({
      loopRoot,
      githubPaginatedApi: async () => [
        {
          user: { login: 'echo-ui-loop[bot]' },
          html_url: 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9900',
          body: [
            `<!-- issue-dev-loop:finalization:${record.runId}:sha256:${foreignDigest} -->`,
            '```json',
            canonicalRecord(foreignRecord),
            '```',
          ].join('\n'),
        },
      ],
    }),
    /configured run issue or PR/,
  )
  const result = await reconcileFinalizationJournal({
    loopRoot,
    now: new Date('2026-07-22T14:00:00.000Z'),
    githubPaginatedApi: async () => finalizationComments,
    githubApi: reconciliationGithubApi,
    latestActiveCheckpoints: [
      {
        record: checkpointRecord,
        commentUrl: predecessorCheckpointUrl,
        createdAt: pauseStartedAt,
      },
    ],
  })
  assert.deepEqual(result.durableRunIds, [record.runId])
  const history = await readFile(path.join(loopRoot, 'logs', 'index.jsonl'), 'utf8')
  assert.match(history, new RegExp(record.runId))
  const metrics = await getEvolveStatus({ loopRoot })
  assert.equal(metrics.finalizedRuns, 1)
  assert.equal(metrics.failedRuns, 1)

  const latestCheckpointRecord = structuredClone(checkpointRecord)
  latestCheckpointRecord.events.push(
    {
      schemaVersion: 1,
      runId: durableRunId,
      type: 'owner_response_observed',
      timestamp: '2026-07-22T13:10:00.000Z',
      status: 'observed',
      payload: { actor: 'codeacme17' },
    },
    {
      schemaVersion: 1,
      runId: durableRunId,
      type: 'run_status_changed',
      timestamp: '2026-07-22T13:11:00.000Z',
      status: 'running',
      payload: { previousStatus: 'waiting_for_owner' },
    },
    {
      schemaVersion: 1,
      runId: durableRunId,
      type: 'owner_notified',
      timestamp: '2026-07-22T13:20:00.000Z',
      status: 'delivered',
      payload: {
        notificationType: 'clarification_required',
        delivery: { github: 'delivered' },
        deliveryUrl: 'https://github.com/codeacme17/echo-ui/issues/205#issuecomment-8811',
        targetUrl: 'https://github.com/codeacme17/echo-ui/issues/205',
      },
    },
    {
      schemaVersion: 1,
      runId: durableRunId,
      type: 'run_status_changed',
      timestamp: '2026-07-22T13:20:00.000Z',
      status: 'waiting_for_owner',
      payload: { previousStatus: 'running' },
    },
  )
  latestCheckpointRecord.updatedAt = '2026-07-22T13:20:00.000Z'
  const latestCheckpointDigest = checkpointDigest(latestCheckpointRecord)
  const latestCheckpointUrl = 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-8810'
  const latestCheckpointBody = [
    `<!-- issue-dev-loop:checkpoint:${durableRunId}:sha256:${latestCheckpointDigest} -->`,
    '```json',
    canonicalCheckpoint(latestCheckpointRecord),
    '```',
  ].join('\n')
  const allActive = await reconcileActiveJournal({
    loopRoot,
    githubPaginatedApi: async () => [
      {
        user: { login: 'echo-ui-loop[bot]' },
        html_url: predecessorCheckpointUrl,
        body: checkpointBody,
        created_at: pauseStartedAt,
      },
      {
        user: { login: 'echo-ui-loop[bot]' },
        html_url: latestCheckpointUrl,
        body: latestCheckpointBody,
        created_at: latestCheckpointRecord.updatedAt,
      },
    ],
  })
  assert.equal(allActive.activeCheckpoints[0].commentUrl, latestCheckpointUrl)
  const superseded = await reconcileFinalizationJournal({
    loopRoot,
    now: new Date('2026-07-22T14:01:00.000Z'),
    githubPaginatedApi: async () => finalizationComments,
    githubApi: reconciliationGithubApi,
    latestActiveCheckpoints: allActive.activeCheckpoints,
  })
  assert.deepEqual(superseded.durableRunIds, [])
  const supersededHistory = await readFile(path.join(loopRoot, 'logs', 'index.jsonl'), 'utf8')
  assert.match(supersededHistory, /run_finalization_unverified/)
  const supersededMetrics = await getEvolveStatus({ loopRoot })
  assert.equal(supersededMetrics.finalizedRuns, 0)

  const restored = await reconcileFinalizationJournal({
    loopRoot,
    now: new Date('2026-07-22T14:02:00.000Z'),
    githubPaginatedApi: async () => [
      finalizationComments[0],
      {
        ...finalizationComments[0],
        html_url: 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9902',
      },
    ],
    githubApi: reconciliationGithubApi,
    latestActiveCheckpoints: [
      {
        record: checkpointRecord,
        commentUrl: predecessorCheckpointUrl,
        createdAt: pauseStartedAt,
      },
    ],
  })
  assert.equal(restored.reconciled, 1)
  assert.deepEqual(restored.durableRunIds, [record.runId])
  const restoredHistory = (await readFile(path.join(loopRoot, 'logs', 'index.jsonl'), 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  assert.doesNotThrow(() => validateFinalizationHistory(restoredHistory))
  assert.equal(
    restoredHistory.filter(
      (entry) => entry.event === 'run_finalized' && entry.runId === record.runId,
    ).length,
    2,
  )
})

test('reconciliation excludes local finalization rows without a durable journal record', async () => {
  const { loopRoot } = await createFixture()
  const indexPath = path.join(loopRoot, 'logs', 'index.jsonl')
  const forgedRows = Array.from({ length: 3 }, (_, index) => ({
    schemaVersion: 1,
    event: 'run_finalized',
    runId: `forged-${index}`,
    issueNumber: 800 + index,
    status: 'blocked',
    startedAt: '2026-07-22T12:00:00.000Z',
    finishedAt: `2026-07-22T12:0${index + 1}:00.000Z`,
    prUrl: null,
    headSha: null,
    mergeSha: null,
    failureFingerprint: 'forged-local-row',
    notificationUrl: `https://github.com/codeacme17/echo-ui/issues/${800 + index}#issuecomment-${9000 + index}`,
    readyNotificationUrl: null,
    readyNotifiedAt: null,
    completionNotifiedAt: null,
    notificationWebhookStatus: null,
  }))
  await writeFile(
    indexPath,
    `${[{ schemaVersion: 1, event: 'loop_initialized' }, ...forgedRows]
      .map((entry) => JSON.stringify(entry))
      .join('\n')}\n`,
    'utf8',
  )
  await reconcileFinalizationJournal({
    loopRoot,
    githubPaginatedApi: async () => [],
  })
  const metrics = await getEvolveStatus({ loopRoot })
  assert.equal(metrics.finalizedRuns, 0)
  assert.equal(metrics.failedRuns, 0)
  assert.equal(metrics.evolveDue, false)
  const reconciledIndex = await readFile(indexPath, 'utf8')
  assert.match(reconciledIndex, /run_finalization_unverified/)
})

test('reconciliation rejects malformed local finalization history before mutation', async () => {
  const { loopRoot } = await createFixture()
  const indexPath = path.join(loopRoot, 'logs', 'index.jsonl')
  const malformed = [
    { schemaVersion: 1, event: 'loop_initialized' },
    {
      schemaVersion: 1,
      event: 'run_finalization_unverified',
      runId: 'never-finalized',
      timestamp: '2026-07-22T12:00:00.000Z',
    },
  ]
  const source = `${malformed.map((entry) => JSON.stringify(entry)).join('\n')}\n`
  await writeFile(indexPath, source, 'utf8')
  await assert.rejects(
    reconcileFinalizationJournal({
      loopRoot,
      githubPaginatedApi: async () => [],
    }),
    /not currently finalized/,
  )
  assert.equal(await readFile(indexPath, 'utf8'), source)
})

test('top-level reconciliation validates finalization history before any cache writer', async () => {
  const { loopRoot } = await createFixture()
  const indexPath = path.join(loopRoot, 'logs', 'index.jsonl')
  const metricsPath = path.join(loopRoot, 'evolve', 'metrics.json')
  const malformed = [
    { schemaVersion: 1, event: 'loop_initialized' },
    {
      schemaVersion: 1,
      event: 'run_finalization_unverified',
      runId: 'never-finalized',
      timestamp: '2026-07-22T12:00:00.000Z',
    },
  ]
  await writeFile(
    indexPath,
    `${malformed.map((entry) => JSON.stringify(entry)).join('\n')}\n`,
    'utf8',
  )
  const metricsBefore = await readFile(metricsPath, 'utf8')
  let queriedGitHub = false
  await assert.rejects(
    reconcileLoopJournal({
      loopRoot,
      githubPaginatedApi: async () => {
        queriedGitHub = true
        return []
      },
    }),
    /not currently finalized/,
  )
  assert.equal(queriedGitHub, false)
  assert.equal(await readFile(metricsPath, 'utf8'), metricsBefore)
})

test('finalization history permits durable restoration only after a tombstone', () => {
  const finalized = {
    schemaVersion: 1,
    event: 'run_finalized',
    runId: 'restored-run',
    status: 'blocked',
  }
  assert.doesNotThrow(() =>
    validateFinalizationHistory([
      { schemaVersion: 1, event: 'loop_initialized' },
      finalized,
      {
        schemaVersion: 1,
        event: 'run_finalization_unverified',
        runId: 'restored-run',
      },
      finalized,
    ]),
  )
  assert.throws(
    () =>
      validateFinalizationHistory([
        { schemaVersion: 1, event: 'loop_initialized' },
        finalized,
        finalized,
      ]),
    /already finalized/,
  )
  assert.throws(
    () =>
      validateFinalizationHistory([
        { schemaVersion: 1, event: 'loop_initialized' },
        {
          schemaVersion: 1,
          event: 'run_finalization_unverified',
          runId: 'restored-run',
        },
      ]),
    /not currently finalized/,
  )
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

  const tiedRecord = structuredClone(prepared.record)
  tiedRecord.events.push({
    schemaVersion: 1,
    runId: run.runId,
    type: 'owner_response_observed',
    timestamp: tiedRecord.updatedAt,
    status: 'observed',
    payload: { actor: 'codeacme17' },
  })
  const tiedDigest = checkpointDigest(tiedRecord)
  const tiedBody = [
    `<!-- issue-dev-loop:checkpoint:${run.runId}:sha256:${tiedDigest} -->`,
    '```json',
    canonicalCheckpoint(tiedRecord),
    '```',
  ].join('\n')
  const tied = await reconcileActiveJournal({
    loopRoot,
    githubPaginatedApi: async () => [
      {
        user: { login: 'echo-ui-loop[bot]' },
        id: 9911,
        body: tiedBody,
        created_at: durableComment.created_at,
      },
      {
        ...durableComment,
        id: 9910,
      },
    ],
  })
  assert.equal(checkpointDigest(tied.activeCheckpoints[0].record), tiedDigest)
  await assert.rejects(
    reconcileActiveJournal({
      loopRoot,
      githubPaginatedApi: async () => [
        {
          user: { login: 'echo-ui-loop[bot]' },
          body: tiedBody,
          created_at: durableComment.created_at,
        },
        {
          user: { login: 'echo-ui-loop[bot]' },
          body: prepared.body,
          created_at: durableComment.created_at,
        },
      ],
    }),
    /ambiguous durable active checkpoints/,
  )
  await restoreActiveCheckpoint({
    loopRoot,
    checkpoint: reconciled.activeCheckpoints[0],
    workspaceValidator: async () => {},
  })
  const restored = JSON.parse(
    await readFile(path.join(loopRoot, 'logs', 'runs', run.runId, 'run.json'), 'utf8'),
  )
  assert.equal(restored.issueNumber, 206)
  await assert.rejects(
    runtimeFreezeBrief({
      loopRoot,
      runId: run.runId,
      githubApi: async () => ({
        user: { login: 'echo-ui-loop[bot]' },
        body: prepared.body,
      }),
    }),
    /requires a concrete Acceptance criteria section/,
  )

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

  const repairRecord = structuredClone(prepared.record)
  const oldPrHead = 'a'.repeat(40)
  const repairCommit = 'b'.repeat(40)
  const repairBrief = 'repair implementation brief\n'
  const repairBriefDigest = createHash('sha256').update(repairBrief).digest('hex')
  const repairResult = {
    schemaVersion: 1,
    runId: run.runId,
    agent: '$implement',
    invocationId: 'repair-invocation',
    startedAt: '2026-07-22T12:03:00.000Z',
    finishedAt: '2026-07-22T12:04:00.000Z',
    briefDigest: repairBriefDigest,
    commitSha: repairCommit,
    checks: [{ command: 'pnpm verify', status: 'passed' }],
  }
  const repairResultSource = `${JSON.stringify(repairResult)}\n`
  const repairResultDigest = createHash('sha256')
    .update(repairResultSource)
    .digest('hex')
  const repairResultPath = `logs/runs/${run.runId}/repair-result.json`
  repairRecord.run.prUrl = 'https://github.com/codeacme17/echo-ui/pull/206'
  repairRecord.run.headSha = oldPrHead
  repairRecord.run.implementationCommit = repairCommit
  repairRecord.run.briefDigest = repairBriefDigest
  repairRecord.briefSource = repairBrief
  repairRecord.events.push(
    {
      schemaVersion: 1,
      runId: run.runId,
      type: 'pr_published',
      timestamp: '2026-07-22T12:02:30.000Z',
      status: 'draft',
      payload: {
        prUrl: repairRecord.run.prUrl,
        headSha: oldPrHead,
        baseBranch: 'dev',
        branch: repairRecord.run.branch,
      },
    },
    {
      schemaVersion: 1,
      runId: run.runId,
      type: 'implementation_completed',
      timestamp: repairResult.finishedAt,
      status: 'passed',
      payload: {
        agent: '$implement',
        invocationId: repairResult.invocationId,
        startedAt: repairResult.startedAt,
        finishedAt: repairResult.finishedAt,
        briefDigest: repairBriefDigest,
        commitSha: repairCommit,
        resultPath: repairResultPath,
        resultDigest: repairResultDigest,
      },
    },
  )
  repairRecord.artifacts.push({
    path: repairResultPath,
    sha256: repairResultDigest,
    source: repairResultSource,
  })
  repairRecord.updatedAt = repairResult.finishedAt
  const repairCheckpoint = {
    record: repairRecord,
    commentUrl: 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9912',
    createdAt: '2026-07-22T12:04:30.000Z',
  }
  const repairDetection = await detectWork({
    loopRoot,
    now: new Date('2026-07-22T12:05:00.000Z'),
    reconcileJournal: async () => ({ activeCheckpoints: [repairCheckpoint] }),
  })
  assert.equal(repairDetection.expectedHeadSha, repairCommit)
  await restoreActiveCheckpoint({
    loopRoot,
    checkpoint: repairCheckpoint,
    workspaceValidator: async ({ record }) => {
      assert.equal(checkpointWorktreeHead(record), repairDetection.expectedHeadSha)
    },
  })
})

test('checkpoint publication rejects an unattested implementation boundary', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 208,
    issueTitle: 'Reject forged implementation checkpoint',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/208',
    entropy: 'forged208',
  })
  const prepared = await prepareActiveCheckpoint({ loopRoot, runId: run.runId })
  const forged = structuredClone(prepared.record)
  forged.run.implementationCommit = 'c'.repeat(40)
  assert.throws(
    () => checkpointPublicationBody(forged),
    /invalid \$implement boundary|lacks one matching durable event/,
  )
})

test('later-phase checkpoints restore every digest-bound local artifact', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 207,
    issueTitle: 'Resume verified work',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/207',
    now: new Date('2026-07-22T13:00:00.000Z'),
    entropy: 'resume2',
  })
  const runRoot = path.join(loopRoot, 'logs', 'runs', run.runId)
  const artifacts = [
    {
      path: path.join(runRoot, 'implementation-result-1.json'),
      relativePath: `logs/runs/${run.runId}/implementation-result-1.json`,
      source: '{"agent":"$implement","checks":[{"command":"pnpm verify"}]}\n',
      eventType: 'implementation_completed',
      payloadKey: 'resultPath',
    },
    {
      path: path.join(loopRoot, 'evidence', run.runId, 'manifest.json'),
      relativePath: `evidence/${run.runId}/manifest.json`,
      source: '{"checks":[{"command":"pnpm verify","status":"passed"}]}\n',
      eventType: 'verification_completed',
      payloadKey: 'manifestPath',
    },
    {
      path: path.join(runRoot, 'review-result.json'),
      relativePath: `logs/runs/${run.runId}/review-result.json`,
      source: '{"verdict":"PASS","rounds":[]}\n',
      eventType: 'review_completed',
      payloadKey: 'resultPath',
    },
    {
      path: path.join(runRoot, 'finalization-result.json'),
      relativePath: `logs/runs/${run.runId}/finalization-result.json`,
      source: '{"status":"blocked","failureFingerprint":"fixture"}\n',
      eventType: 'finalization_published',
      payloadKey: 'resultPath',
    },
  ]
  for (const artifact of artifacts) {
    await mkdir(path.dirname(artifact.path), { recursive: true })
    await writeFile(artifact.path, artifact.source, 'utf8')
  }
  const existingEvents = (await readFile(path.join(runRoot, 'events.jsonl'), 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  const laterEvents = artifacts.map((artifact, index) => ({
    schemaVersion: 1,
    runId: run.runId,
    type: artifact.eventType,
    timestamp: new Date(Date.UTC(2026, 6, 22, 13, index + 1)).toISOString(),
    status: 'passed',
    payload: artifact.payloadKey
      ? {
          [artifact.payloadKey]: artifact.relativePath,
          [artifact.eventType === 'verification_completed' ? 'manifestDigest' : 'resultDigest']:
            createHash('sha256').update(artifact.source).digest('hex'),
        }
      : {},
  }))
  await writeFile(
    path.join(runRoot, 'events.jsonl'),
    `${[...existingEvents, ...laterEvents].map((event) => JSON.stringify(event)).join('\n')}\n`,
    'utf8',
  )

  const prepared = await prepareActiveCheckpoint({ loopRoot, runId: run.runId })
  assert.deepEqual(
    prepared.record.artifacts.map((artifact) => artifact.path).sort(),
    artifacts.map((artifact) => artifact.relativePath).sort(),
  )
  const tampered = structuredClone(prepared.record)
  tampered.artifacts[0].source += 'tampered'
  await assert.rejects(
    restoreActiveCheckpoint({
      loopRoot,
      checkpoint: { record: tampered },
      workspaceValidator: async () => {},
    }),
    /invalid artifact/,
  )

  await rm(runRoot, { recursive: true, force: true })
  await rm(path.join(loopRoot, 'handoffs', run.runId), { recursive: true, force: true })
  await rm(path.join(loopRoot, 'evidence', run.runId), { recursive: true, force: true })
  await restoreActiveCheckpoint({
    loopRoot,
    checkpoint: {
      record: prepared.record,
      commentUrl: 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-9911',
      createdAt: '2026-07-22T13:10:00.000Z',
    },
    workspaceValidator: async () => {},
  })
  for (const artifact of artifacts) {
    assert.equal(await readFile(artifact.path, 'utf8'), artifact.source)
  }
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
  const preparedRequest = await prepareEvolveRequestPublication({ loopRoot, requestId })
  await recordEvolveRequestPublication({
    loopRoot,
    requestId,
    commentUrl: 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-7000',
    githubApi: async () => ({
      user: { login: 'echo-ui-loop[bot]' },
      body: preparedRequest.body,
    }),
  })
  await assert.rejects(
    completeEvolve({
      loopRoot,
      requestId,
      summary: 'Improve trigger batching',
      prUrl: 'https://github.com/codeacme17/echo-ui/pull/99',
      githubApi: async (endpoint) => {
        if (endpoint.endsWith('/issues/comments/7000')) {
          return {
            user: { login: 'echo-ui-loop[bot]' },
            body: preparedRequest.body,
          }
        }
        if (endpoint.includes('/reviews')) {
          return [
            {
              user: { login: 'codeacme17' },
              state: 'APPROVED',
              commit_id: 'a'.repeat(40),
            },
          ]
        }
        if (endpoint.includes('/timeline')) {
          return [
            {
              event: 'ready_for_review',
              actor: { login: 'codeacme17' },
              created_at: '2026-07-20T01:00:00.000Z',
            },
          ]
        }
        return {
          merged: true,
          merged_by: { login: 'codeacme17' },
          merge_commit_sha: '9'.repeat(40),
          created_at: '2026-07-20T00:00:00.000Z',
          body: 'Unrelated change',
          base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } },
          head: { ref: 'feature/unrelated', sha: 'a'.repeat(40) },
        }
      },
    }),
    /configured owner/,
  )
})

test('fresh worktrees rebuild pending and completed evolve state from the durable journal', async () => {
  const { loopRoot } = await createFixture()
  const requestId = 'EVL-000010-TEN-FINALIZED-RUNS'
  const requestUrl = 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-7100'
  const completionUrl = 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-7101'
  const prUrl = 'https://github.com/codeacme17/echo-ui/pull/710'
  const headSha = '7'.repeat(40)
  const mergeSha = '8'.repeat(40)
  const mergeAt = '2026-07-23T13:00:00.000Z'
  const metricsPath = path.join(loopRoot, 'evolve', 'metrics.json')
  const initialMetrics = JSON.parse(await readFile(metricsPath, 'utf8'))
  await writeFile(
    metricsPath,
    `${JSON.stringify({
      ...initialMetrics,
      finalizedRuns: 10,
      evolveDue: true,
      pendingRequestId: requestId,
    })}\n`,
    'utf8',
  )
  const requestPath = path.join(loopRoot, 'evolve', 'requests', `${requestId}.json`)
  await writeFile(
    requestPath,
    `${JSON.stringify({
      schemaVersion: 1,
      requestId,
      status: 'pending',
      reason: 'ten_finalized_runs',
      requestedAt: '2026-07-23T12:00:00.000Z',
      finalizedRunCount: 10,
    })}\n`,
    'utf8',
  )
  const preparedRequest = await prepareEvolveRequestPublication({ loopRoot, requestId })
  await recordEvolveRequestPublication({
    loopRoot,
    requestId,
    commentUrl: requestUrl,
    githubApi: async () => ({
      user: { login: 'echo-ui-loop[bot]' },
      body: preparedRequest.body,
    }),
  })
  const publishedPendingRequest = JSON.parse(await readFile(requestPath, 'utf8'))

  let completionBody = null
  const githubApi = async (endpoint) => {
    if (endpoint.endsWith('/issues/comments/7100')) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        body: preparedRequest.body,
      }
    }
    if (endpoint.endsWith('/issues/comments/7101')) {
      return {
        user: { login: 'echo-ui-loop[bot]' },
        body: completionBody,
        created_at: '2026-07-23T13:01:00.000Z',
      }
    }
    if (endpoint.includes('/reviews')) {
      return [
        {
          user: { login: 'codeacme17' },
          state: 'APPROVED',
          commit_id: headSha,
          submitted_at: '2026-07-23T12:31:00.000Z',
        },
      ]
    }
    if (endpoint.includes('/timeline')) {
      return [
        {
          event: 'ready_for_review',
          actor: { login: 'codeacme17' },
          created_at: '2026-07-23T12:30:00.000Z',
        },
      ]
    }
    return {
      merged: true,
      merged_at: mergeAt,
      merged_by: { login: 'codeacme17' },
      merge_commit_sha: mergeSha,
      created_at: '2026-07-23T12:10:00.000Z',
      body: `<!-- issue-dev-loop:evolve-request:${requestId} -->`,
      base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } },
      head: {
        ref: `codex/evolve-${requestId}`,
        sha: headSha,
        repo: { full_name: 'codeacme17/echo-ui' },
      },
    }
  }
  const completed = await completeEvolve({
    loopRoot,
    requestId,
    summary: 'Batch empty trigger checks before waking an executor.',
    prUrl,
    now: new Date('2026-07-23T13:02:00.000Z'),
    githubApi,
    githubPaginatedApi: async () => [],
    githubComment: async (_target, body) => {
      completionBody = body
      return { html_url: completionUrl }
    },
    verifyAutomationIdentity: async () => {},
  })
  assert.equal(completed.completionPublicationUrl, completionUrl)
  let metrics = await getEvolveStatus({ loopRoot })
  assert.equal(metrics.evolveDue, false)
  assert.equal(metrics.lastEvolvedRunCount, 10)
  assert.equal(metrics.completedEvolveSessions, 1)

  await writeFile(requestPath, `${JSON.stringify(publishedPendingRequest)}\n`, 'utf8')
  await writeFile(
    metricsPath,
    `${JSON.stringify({
      ...initialMetrics,
      finalizedRuns: 10,
      evolveDue: true,
      pendingRequestId: requestId,
    })}\n`,
    'utf8',
  )
  let duplicatePublicationAttempted = false
  const retried = await completeEvolve({
    loopRoot,
    requestId,
    summary: 'Batch empty trigger checks before waking an executor.',
    prUrl,
    now: new Date('2026-07-23T13:03:00.000Z'),
    githubApi,
    githubPaginatedApi: async () => [
      {
        user: { login: 'echo-ui-loop[bot]' },
        html_url: requestUrl,
        body: preparedRequest.body,
      },
      {
        user: { login: 'echo-ui-loop[bot]' },
        html_url: completionUrl,
        body: completionBody,
        created_at: '2026-07-23T13:01:00.000Z',
      },
    ],
    githubComment: async () => {
      duplicatePublicationAttempted = true
      throw new Error('completion must be reused')
    },
    verifyAutomationIdentity: async () => {},
  })
  assert.equal(retried.completionPublicationUrl, completionUrl)
  assert.equal(duplicatePublicationAttempted, false)

  await writeFile(metricsPath, `${JSON.stringify(initialMetrics)}\n`, 'utf8')
  await rm(requestPath)
  const duplicateRequestUrl = 'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-7200'
  const duplicateCompletionUrl =
    'https://github.com/codeacme17/echo-ui/issues/999#issuecomment-7201'
  const reconciled = await reconcileEvolveJournal({
    loopRoot,
    githubPaginatedApi: async () => [
      {
        user: { login: 'echo-ui-loop[bot]' },
        html_url: requestUrl,
        body: preparedRequest.body,
      },
      {
        user: { login: 'echo-ui-loop[bot]' },
        html_url: completionUrl,
        body: completionBody,
        created_at: '2026-07-23T13:01:00.000Z',
      },
      {
        user: { login: 'echo-ui-loop[bot]' },
        html_url: duplicateRequestUrl,
        body: preparedRequest.body,
      },
      {
        user: { login: 'echo-ui-loop[bot]' },
        html_url: duplicateCompletionUrl,
        body: completionBody,
        created_at: '2026-07-23T13:01:01.000Z',
      },
    ],
    githubApi: async (endpoint) => {
      if (endpoint.endsWith('/issues/comments/7200')) {
        return {
          user: { login: 'echo-ui-loop[bot]' },
          body: preparedRequest.body,
        }
      }
      if (endpoint.endsWith('/issues/comments/7201')) {
        return {
          user: { login: 'echo-ui-loop[bot]' },
          body: completionBody,
          created_at: '2026-07-23T13:01:01.000Z',
        }
      }
      return githubApi(endpoint)
    },
  })
  assert.deepEqual(reconciled.durableCompletedEvolveRequestIds, [requestId])
  metrics = await getEvolveStatus({ loopRoot })
  assert.equal(metrics.evolveDue, false)
  assert.equal(metrics.pendingRequestId, null)
  assert.equal(metrics.lastEvolvedRunCount, 10)
  assert.equal(metrics.completedEvolveSessions, 1)
  const restoredRequest = JSON.parse(await readFile(requestPath, 'utf8'))
  assert.equal(restoredRequest.status, 'completed')
  assert.equal(restoredRequest.mergeSha, mergeSha)

  await reconcileFinalizationJournal({
    loopRoot,
    githubPaginatedApi: async () => [],
  })
  metrics = await getEvolveStatus({ loopRoot })
  assert.equal(metrics.evolveDue, false)
  assert.equal(metrics.completedEvolveSessions, 1)
})

test('repository loop package satisfies its structural invariants', async () => {
  const result = await validateLoop({ loopRoot: repositoryLoopRoot })
  assert.equal(result.valid, true)
})

test('historical workflow parsing is fail-closed without exposing reduced validation', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-historical-target-'))
  const repositoryRoot = path.join(parent, 'repository')
  const historicalLoopRoot = path.join(repositoryRoot, 'loops', 'issue-dev-loop')
  try {
    await Promise.all([
      cp(repositoryLoopRoot, historicalLoopRoot, { recursive: true }),
      cp(
        path.resolve(repositoryLoopRoot, '..', '_shared'),
        path.join(repositoryRoot, 'loops', '_shared'),
        { recursive: true },
      ),
      cp(
        path.resolve(repositoryLoopRoot, '..', '..', '.codex'),
        path.join(repositoryRoot, '.codex'),
        { recursive: true },
      ),
      mkdir(path.join(repositoryRoot, '.github', 'workflows'), { recursive: true }),
    ])
    await cp(
      path.resolve(
        repositoryLoopRoot,
        '..',
        '..',
        '.github',
        'workflows',
        'issue-dev-loop-evidence.yml',
      ),
      path.join(repositoryRoot, '.github', 'workflows', 'issue-dev-loop-evidence.yml'),
    )
    const workflowPath = path.join(
      repositoryRoot,
      '.github',
      'workflows',
      'issue-dev-loop-evidence.yml',
    )
    await writeFile(
      workflowPath,
      (await readFile(workflowPath, 'utf8')).replace(
        '--baseline-status',
        '--historical-baseline-status',
      ),
      'utf8',
    )
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          path.join(historicalLoopRoot, 'scripts', 'loopctl.mjs'),
          'validate',
          '--target-compatibility',
          '--loop-root',
          historicalLoopRoot,
        ],
        { cwd: repositoryRoot },
      ),
      /target compatibility validation is reserved to wrapped activation/,
    )
    await Promise.all([
      rm(path.join(historicalLoopRoot, 'scripts', 'lib', 'review-publication.mjs')),
      rm(path.join(historicalLoopRoot, 'scripts', 'publish-review.mjs')),
    ])

    await assert.rejects(
      validateLoop({ loopRoot: historicalLoopRoot }),
      /missing required loop files: .*review-publication\.mjs.*publish-review\.mjs/,
    )
    await assert.rejects(
      validateLoop({
        loopRoot: historicalLoopRoot,
        targetCompatibility: true,
      }),
      /missing required loop files: .*review-publication\.mjs.*publish-review\.mjs/,
    )
    const historicalWorkflow = await readFile(workflowPath, 'utf8')
    assert.equal(historicalWorkflowIsLowPrivilege(historicalWorkflow), true)
    const unsafeWorkflows = [
      `${historicalWorkflow}
  unsafe:
    permissions: write-all
    runs-on: ubuntu-latest
    steps: []
`,
      `${historicalWorkflow}
  unsafe:
    "permissions": write-all
    runs-on: ubuntu-latest
    steps: []
`,
      historicalWorkflow.replace('  pull_request:\n', '  pull_request:\n  workflow_dispatch:\n'),
      historicalWorkflow.replace('  pull_request:\n', '  "pull_request_target":\n'),
      historicalWorkflow.replace(
        'permissions:\n  contents: read\n',
        'permissions:\n  contents: read\npermissions:\n  contents: read\n',
      ),
      historicalWorkflow.replace('permissions:\n', 'permissions: &shared_permissions\n'),
      historicalWorkflow.replace(
        'jobs:\n',
        'jobs:\n  unsafe: {permissions: write-all, runs-on: ubuntu-latest, steps: []}\n',
      ),
      historicalWorkflow.replace(
        'jobs:\n',
        `jobs:
  unsafe:
    {permissions: write-all, runs-on: ubuntu-latest, steps: []}
`,
      ),
      historicalWorkflow.replace(
        '    runs-on: ubuntu-latest\n',
        '    &permission_key permissions: write-all\n    runs-on: ubuntu-latest\n',
      ),
      historicalWorkflow.replace(
        '    runs-on: ubuntu-latest\n',
        '    !!str permissions: write-all\n    runs-on: ubuntu-latest\n',
      ),
      historicalWorkflow.replace(
        '    runs-on: ubuntu-latest\n',
        '    - permissions: write-all\n    runs-on: ubuntu-latest\n',
      ),
      historicalWorkflow.replace(
        '    runs-on: ubuntu-latest\n',
        '    runs-on: ubuntu-latest\r    permissions: write-all\n',
      ),
      historicalWorkflow.replace(
        '    runs-on: ubuntu-latest\n',
        '    runs-on: ubuntu-latest\u0085    permissions: write-all\n',
      ),
      historicalWorkflow.replace(
        '    runs-on: ubuntu-latest\n',
        '    runs-on: ubuntu-latest\u2028    permissions: write-all\n',
      ),
      historicalWorkflow.replace(
        '    runs-on: ubuntu-latest\n',
        '    runs-on: ubuntu-latest\u2029    permissions: write-all\n',
      ),
      historicalWorkflow.replace('ubuntu-latest', 'ubuntu-latest\u0000'),
      `${historicalWorkflow}
!!str permissions: write-all
`,
      `${historicalWorkflow}
@not-yaml
`,
    ]
    for (const unsafeWorkflow of unsafeWorkflows) {
      assert.equal(historicalWorkflowIsLowPrivilege(unsafeWorkflow), false)
    }
    await assert.rejects(
      async () =>
        validateLoop({
          loopRoot: historicalLoopRoot,
          historicalCapability: {},
        }),
      /historical target validation requires an authorized router capability/,
    )
  } finally {
    await rm(parent, { recursive: true, force: true })
  }
})

test('repository activation verifies both configured GitHub profiles', async () => {
  const profileRoot = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-activation-profiles-'))
  const automationProfile = path.join(profileRoot, 'automation')
  const reviewerProfile = path.join(profileRoot, 'reviewer')
  await Promise.all([mkdir(automationProfile), mkdir(reviewerProfile)])
  await Promise.all([chmod(automationProfile, 0o700), chmod(reviewerProfile, 0o700)])
  const [canonicalAutomationProfile, canonicalReviewerProfile] = await Promise.all([
    realpath(automationProfile),
    realpath(reviewerProfile),
  ])
  const environment = {
    ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR: canonicalAutomationProfile,
    ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR: canonicalReviewerProfile,
    ECHO_UI_LOOP_UNTRUSTED_ROOTS: JSON.stringify([path.resolve(repositoryLoopRoot, '..', '..')]),
  }
  const observedProfiles = []
  const identityCommand = async (_command, _args, options) => {
    observedProfiles.push(options.env.GH_CONFIG_DIR)
    const login =
      options.env.GH_CONFIG_DIR === canonicalAutomationProfile ? 'Ethandasw' : 'Traviinam'
    return { stdout: `${login}\n` }
  }
  const result = await validateLoop({
    loopRoot: repositoryLoopRoot,
    activation: true,
    environment,
    identityCommand,
  })
  assert.equal(result.valid, true)
  assert.deepEqual(observedProfiles, [canonicalAutomationProfile, canonicalReviewerProfile])
})

test('credential isolation rejects profiles inside untrusted roots or with broad permissions', async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-credential-boundary-'))
  const untrustedRoot = path.join(parent, 'repository')
  const embeddedProfile = path.join(untrustedRoot, 'credentials')
  const externalProfile = path.join(parent, 'private-credentials')
  const symlinkedProfile = path.join(parent, 'credential-link')
  await Promise.all([
    mkdir(embeddedProfile, { recursive: true }),
    mkdir(externalProfile, { recursive: true }),
  ])
  await Promise.all([chmod(embeddedProfile, 0o700), chmod(externalProfile, 0o755)])
  await symlink(externalProfile, symlinkedProfile)
  const channel = {
    untrustedRootsEnvironmentVariable: 'ECHO_UI_LOOP_UNTRUSTED_ROOTS',
  }
  const environment = {
    ECHO_UI_LOOP_UNTRUSTED_ROOTS: JSON.stringify([untrustedRoot]),
  }
  await assert.rejects(
    assertCredentialProfileIsolation({
      channel,
      configDirectory: symlinkedProfile,
      environment,
      requiredUntrustedRoots: [untrustedRoot],
    }),
    /real directory, not a symlink/,
  )
  for (const disguisedSymlink of [`${symlinkedProfile}/`, `${symlinkedProfile}/.`]) {
    await assert.rejects(
      assertCredentialProfileIsolation({
        channel,
        configDirectory: disguisedSymlink,
        environment,
        requiredUntrustedRoots: [untrustedRoot],
      }),
      /real directory, not a symlink/,
    )
  }
  await assert.rejects(
    assertCredentialProfileIsolation({
      channel,
      configDirectory: embeddedProfile,
      environment,
      requiredUntrustedRoots: [untrustedRoot],
    }),
    /outside every untrusted agent root/,
  )
  await assert.rejects(
    assertCredentialProfileIsolation({
      channel,
      configDirectory: externalProfile,
      environment,
      requiredUntrustedRoots: [untrustedRoot],
    }),
    /deny group\/other access/,
  )
})
