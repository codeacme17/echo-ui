import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  appendEvent,
  createNotification,
  finalizeRun,
  selectIssue,
  startRun,
  transitionRun,
  validateLoop,
} from '../scripts/runtime.mjs'

const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryLoopRoot = path.resolve(testDirectory, '..')

async function createFixture() {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-loop-test-'))
  const loopRoot = path.join(parent, 'issue-dev-loop')
  const channelRoot = path.join(parent, '_shared', 'owner-channel')
  await Promise.all([
    mkdir(path.join(loopRoot, 'templates'), { recursive: true }),
    mkdir(path.join(loopRoot, 'logs', 'runs'), { recursive: true }),
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
    path.join(channelRoot, 'channel.json'),
    `${JSON.stringify({
      schemaVersion: 1,
      ownerGitHubLogin: 'codeacme17',
      webhookEnvironmentVariable: 'TEST_LOOP_WEBHOOK_URL',
    })}\n`,
    'utf8',
  )
  return { loopRoot, channelRoot }
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

  await appendEvent({
    loopRoot,
    runId: run.runId,
    type: 'verification_completed',
    status: 'passed',
    payload: { verdict: 'passed' },
  })
  await appendEvent({
    loopRoot,
    runId: run.runId,
    type: 'review_completed',
    status: 'passed',
    payload: { verdict: 'PASS' },
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

  await appendEvent({
    loopRoot,
    runId: run.runId,
    type: 'pr_merged',
    status: 'observed',
    payload: { actor: 'codeacme17', mergeSha: '1234567890abcdef' },
  })
  const finalized = await finalizeRun({
    loopRoot,
    runId: run.runId,
    status: 'completed',
    mergeSha: '1234567890abcdef',
    now: new Date('2026-07-23T09:00:00Z'),
  })
  assert.equal(finalized.status, 'completed')
  assert.equal(finalized.mergeSha, '1234567890abcdef')
  assert.equal(finalized.finishedAt, '2026-07-23T09:00:00.000Z')
})

test('completed finalization requires an observed owner merge', async () => {
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
    /observed pr_merged/,
  )

  await appendEvent({
    loopRoot,
    runId: run.runId,
    type: 'pr_merged',
    status: 'observed',
    payload: { actor: 'codeacme17', mergeSha: '1234567890abcdef' },
  })
  const finalized = await finalizeRun({
    loopRoot,
    runId: run.runId,
    status: 'completed',
    mergeSha: '1234567890abcdef',
  })
  assert.equal(finalized.mergeSha, '1234567890abcdef')
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
})

test('repository loop package satisfies its structural invariants', async () => {
  const result = await validateLoop({ loopRoot: repositoryLoopRoot })
  assert.equal(result.valid, true)
})
