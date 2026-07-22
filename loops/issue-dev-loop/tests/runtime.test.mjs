import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import {
  appendEvent,
  completeEvolve,
  createNotification,
  finalizeRun,
  getEvolveStatus,
  observeOwnerMerge,
  recordEvidence,
  recordPullRequest,
  recordReview,
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
  return startRun({ ...options, claimIssue: async () => {} })
}

function pullRequestFixture(run, headSha, { draft = true, merged = false } = {}) {
  return {
    state: merged ? 'closed' : 'open',
    draft,
    merged,
    merged_by: merged ? { login: 'codeacme17' } : null,
    merge_commit_sha: merged ? '1234567890abcdef' : null,
    base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } },
    head: { ref: run.branch, sha: headSha, repo: { full_name: 'codeacme17/echo-ui' } },
    body: '',
  }
}

async function recordFixturePr({ loopRoot, run, headSha, number = 200 }) {
  const prUrl = `https://github.com/codeacme17/echo-ui/pull/${number}`
  await recordPullRequest({
    loopRoot,
    runId: run.runId,
    prUrl,
    headSha,
    githubApi: async () => pullRequestFixture(run, headSha),
  })
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
      headSha,
      verdict: 'passed',
      checks: [
        {
          command: 'pnpm verify',
          status: 'passed',
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

async function writePassingReview({ loopRoot, run, headSha }) {
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
      rounds: [{ round: 1, headSha, verdict: 'PASS', findings: [] }],
    })}\n`,
    'utf8',
  )
  return resultPath
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

test('recordEvidence rejects failed workflow runs and mismatched artifact manifests', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 134,
    issueTitle: 'Artifact attestation',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/134',
    entropy: 'art134',
  })
  const headSha = 'abcdef1234567'
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

test('CI helpers resolve a run and generate exact-head screenshot evidence', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 128,
    issueTitle: 'Capture Player UI',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/128',
    entropy: 'c1e2e3',
  })
  const screenshotRelativePath = `screen-shots/${run.runId}/after/player.webp`
  await writeFile(path.join(loopRoot, screenshotRelativePath), 'fake-image', 'utf8')
  await writeFile(
    path.join(loopRoot, 'screen-shots', run.runId, 'manifest.json'),
    `${JSON.stringify({
      screenshots: [
        {
          name: 'Player after',
          scenario: 'Keyboard focus',
          viewport: '1280x720',
          path: screenshotRelativePath,
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
    'abcdef1234567',
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
  assert.equal(evidence.headSha, 'abcdef1234567')
  assert.equal(evidence.screenshots[0].path, screenshotRelativePath)
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
  const headSha = 'abcdef1234567'
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
        user: { login: 'echo-ui-reviewer[bot]' },
        body: `PASS\n\n<!-- issue-dev-loop:${run.runId}:review-result-sha256:${reviewDigest} -->`,
      }
    },
  })

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
      payload: { actor: 'codeacme17', mergeSha: '1234567890abcdef' },
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
              merge_commit_sha: '1234567890abcdef',
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
  })
  assert.equal(finalized.status, 'completed')
  assert.equal(finalized.mergeSha, '1234567890abcdef')
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
      mergeSha: '1234567890abcdef',
    }),
    /invalid run status transition/,
  )
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
  const headSha = 'fedcba9876543'
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
          headSha: 'abcabc1234567',
          verdict: 'CHANGES_REQUESTED',
          findings: [
            {
              findingId: 'RVW-1-1',
              severity: 'P2',
              confidence: 'high',
              headSha: 'abcabc1234567',
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
        { round: 2, headSha, verdict: 'PASS', findings: [] },
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
      if (endpoint.endsWith('/comments?per_page=100')) return []
      if (endpoint.includes('/issues/comments/400')) {
        return {
          user: { login: 'echo-ui-loop[bot]' },
          body: `Rejected with proof. Reproduction command exits successfully.\n<!-- issue-dev-loop:${run.runId}:RVW-1-1:rejected -->`,
        }
      }
      if (endpoint.endsWith('/pulls/300')) return pullRequestFixture(run, headSha)
      return {
        commit_id: headSha,
        state: 'COMMENTED',
        user: { login: 'echo-ui-reviewer[bot]' },
        body: `RVW-1-1\n<!-- issue-dev-loop:${run.runId}:review-result-sha256:${digest} -->`,
      }
    },
  })
  assert.equal(recorded.findingCount, 1)
  assert.equal(recorded.rounds, 2)
})

test('review gate rejects unilateral P0 or P1 rejection without adjudication', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startFixtureRun({
    loopRoot,
    issueNumber: 135,
    issueTitle: 'High severity review dispute',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/135',
    entropy: 'rev135',
  })
  const headSha = 'fedcba9876543'
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
              },
            },
          ],
        },
        { round: 2, headSha, verdict: 'PASS', findings: [] },
      ],
    })}\n`,
    'utf8',
  )
  await assert.rejects(
    recordReview({
      loopRoot,
      runId: run.runId,
      resultPath,
      reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/302#pullrequestreview-501',
      githubApi: async () => {
        throw new Error('GitHub should not be queried before local adjudication validation')
      },
    }),
    /adjudicationUrl/,
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
    await finalizeRun({
      loopRoot,
      runId: run.runId,
      status: 'blocked',
      failureFingerprint: 'browser-environment-unavailable',
    })
  }
  const metrics = await getEvolveStatus({ loopRoot })
  assert.equal(metrics.evolveDue, true)
  assert.equal(metrics.failedRuns, 3)
  assert.match(metrics.pendingRequestId, /^EVL-/)
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
                commit_id: 'abcdef1234567',
              },
            ]
          : {
              merged: true,
              merged_by: { login: 'codeacme17' },
              merge_commit_sha: '1234567890abcdef',
              created_at: '2026-07-20T00:00:00.000Z',
              body: 'Unrelated change',
              base: { ref: 'dev', repo: { full_name: 'codeacme17/echo-ui' } },
              head: { ref: 'feature/unrelated', sha: 'abcdef1234567' },
            },
    }),
    /not approved and merged by the configured owner/,
  )
})

test('repository loop package satisfies its structural invariants', async () => {
  const result = await validateLoop({ loopRoot: repositoryLoopRoot })
  assert.equal(result.valid, true)
})
