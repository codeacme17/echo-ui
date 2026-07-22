import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import {
  appendEvent,
  createNotification,
  finalizeRun,
  getEvolveStatus,
  observeOwnerMerge,
  recordEvidence,
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
  const result = await startRun({
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

test('CI helpers resolve a run and generate exact-head screenshot evidence', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startRun({
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
  const { run } = await startRun({
    loopRoot,
    issueNumber: 129,
    issueTitle: 'Add keyboard test',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/129',
    now: new Date('2026-07-22T16:00:00Z'),
    entropy: 'abc123',
  })

  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl: 'https://github.com/codeacme17/echo-ui/pull/200',
      headSha: 'abcdef1234567',
    }),
    /passed verification_completed/,
  )

  const staleManifest = await writePassingEvidence({
    loopRoot,
    run,
    headSha: '0000000123456',
  })
  await recordEvidence({
    loopRoot,
    runId: run.runId,
    manifestPath: staleManifest,
    publicationUrl: 'https://github.com/codeacme17/echo-ui/actions/runs/100/artifacts/200',
  })
  await assert.rejects(
    transitionRun({
      loopRoot,
      runId: run.runId,
      status: 'awaiting_owner_review',
      prUrl: 'https://github.com/codeacme17/echo-ui/pull/200',
      headSha: 'abcdef1234567',
    }),
    /for headSha/,
  )

  const manifestPath = await writePassingEvidence({
    loopRoot,
    run,
    headSha: 'abcdef1234567',
  })
  await recordEvidence({
    loopRoot,
    runId: run.runId,
    manifestPath,
    publicationUrl: 'https://github.com/codeacme17/echo-ui/actions/runs/101/artifacts/201',
  })
  const reviewPath = await writePassingReview({
    loopRoot,
    run,
    headSha: 'abcdef1234567',
  })
  await recordReview({
    loopRoot,
    runId: run.runId,
    resultPath: reviewPath,
    reviewUrl: 'https://github.com/codeacme17/echo-ui/pull/200#pullrequestreview-300',
  })

  const paused = await transitionRun({
    loopRoot,
    runId: run.runId,
    status: 'awaiting_owner_review',
    prUrl: 'https://github.com/codeacme17/echo-ui/pull/200',
    headSha: 'abcdef1234567',
    now: new Date('2026-07-22T17:00:00Z'),
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
                commit_id: 'abcdef1234567',
              },
            ]
          : {
              merged: true,
              merged_by: { login: 'someone-else' },
              head: { sha: 'abcdef1234567' },
              merge_commit_sha: '1234567890abcdef',
            },
    }),
    /not merged by the configured owner/,
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
              commit_id: 'abcdef1234567',
            },
          ]
        : {
            merged: true,
            merged_by: { login: 'codeacme17' },
            head: { sha: 'abcdef1234567' },
            merge_commit_sha: '1234567890abcdef',
          },
  })
  assert.equal(finalized.status, 'completed')
  assert.equal(finalized.mergeSha, '1234567890abcdef')
  assert.equal(finalized.finishedAt, '2026-07-23T09:00:00.000Z')
})

test('completed finalization cannot bypass the owner-ready gate', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startRun({
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
    /owner-ready PR/,
  )
})

test('notification dry-run stages an auditable owner message', async () => {
  const { loopRoot, channelRoot } = await createFixture()
  const { run } = await startRun({
    loopRoot,
    issueNumber: 131,
    issueTitle: 'Notify owner',
    issueUrl: 'https://github.com/codeacme17/echo-ui/issues/131',
    entropy: 'b00b1e',
  })
  const notification = await createNotification({
    loopRoot,
    runId: run.runId,
    type: 'pr_ready_for_review',
    summary: 'PR is verified and ready',
    requestedAction: 'Review and merge or request changes',
    targetUrl: 'https://github.com/codeacme17/echo-ui/pull/201',
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
  assert.equal(paused.status, 'waiting_for_owner')
})

test('failed blocking delivery still pauses for the owner', async () => {
  const { loopRoot } = await createFixture()
  const { run } = await startRun({
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
    const { run } = await startRun({
      loopRoot,
      issueNumber,
      issueTitle: `Failure ${issueNumber}`,
      issueUrl: `https://github.com/codeacme17/echo-ui/issues/${issueNumber}`,
      entropy: `fail${issueNumber}`,
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

test('repository loop package satisfies its structural invariants', async () => {
  const result = await validateLoop({ loopRoot: repositoryLoopRoot })
  assert.equal(result.valid, true)
})
