#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  appendEvent,
  completeEvolve,
  createNotification,
  detectWork,
  finalizeRun,
  freezeBrief,
  getEvolveStatus,
  observeOwnerMerge,
  parseArguments,
  prepareActiveCheckpoint,
  prepareBootstrapAuthorization,
  prepareEvolveRequestPublication,
  prepareFinalizationRecord,
  reconcileLoopJournal,
  recordActiveCheckpointPublication,
  recordEvidence,
  recordEvolveRequestPublication,
  recordFinalizationPublication,
  recordImplementation,
  recordOwnerResponse,
  recordPullRequest,
  recordReview,
  reviewPublicationDigest,
  restoreActiveCheckpoint,
  startRun,
  transitionRun,
  validateLoop,
} from './runtime.mjs'

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`)
}

function parsePayload(value) {
  if (!value) return {}
  const parsed = JSON.parse(value)
  if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error('--payload must be a JSON object')
  }
  return parsed
}

function runTransitionOptions(args) {
  return {
    runId: args['run-id'],
    status: args.status,
    prUrl: args['pr-url'] ?? null,
    headSha: args['head-sha'] ?? null,
    mergeSha: args['merge-sha'] ?? null,
    failureFingerprint: args['failure-fingerprint'] ?? null,
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  const args = parseArguments(rest)
  const loopRoot = args['loop-root'] ? path.resolve(args['loop-root']) : undefined

  switch (command) {
    case 'start':
      output(
        await startRun({
          issueNumber: args.issue,
          issueTitle: args.title,
          issueUrl: args.url,
          baseSha: args['base-sha'],
          now: args.now ? new Date(args.now) : undefined,
          loopRoot,
        }),
      )
      break
    case 'freeze-brief':
      output(await freezeBrief({ loopRoot, runId: args['run-id'] }))
      break
    case 'record-implementation':
      output(
        await recordImplementation({
          runId: args['run-id'],
          resultPath: args.result,
          loopRoot,
        }),
      )
      break
    case 'event':
      output(
        await appendEvent({
          runId: args['run-id'],
          type: args.type,
          status: args.status ?? null,
          payload: parsePayload(args.payload),
          loopRoot,
        }),
      )
      break
    case 'transition':
      output(await transitionRun({ ...runTransitionOptions(args), loopRoot }))
      break
    case 'finalize':
      output(await finalizeRun({ ...runTransitionOptions(args), loopRoot }))
      break
    case 'record-evidence':
      output(
        await recordEvidence({
          runId: args['run-id'],
          manifestPath: args.manifest,
          publicationUrl: args['publication-url'],
          loopRoot,
        }),
      )
      break
    case 'record-pr':
      output(
        await recordPullRequest({
          runId: args['run-id'],
          prUrl: args['pr-url'],
          headSha: args['head-sha'],
          loopRoot,
        }),
      )
      break
    case 'record-owner-response':
      output(
        await recordOwnerResponse({
          runId: args['run-id'],
          responseUrl: args['response-url'],
          loopRoot,
        }),
      )
      break
    case 'review-digest': {
      const resultPath = path.resolve(args.result)
      const result = JSON.parse(await readFile(resultPath, 'utf8'))
      const publicationDigest = reviewPublicationDigest(result)
      output({
        runId: result.runId,
        publicationDigest,
        marker: `<!-- issue-dev-loop:${result.runId}:review-result-sha256:${publicationDigest} -->`,
      })
      break
    }
    case 'record-review':
      output(
        await recordReview({
          runId: args['run-id'],
          resultPath: args.result,
          reviewUrl: args['review-url'],
          loopRoot,
        }),
      )
      break
    case 'record-finalization':
      output(
        await recordFinalizationPublication({
          runId: args['run-id'],
          resultPath: args.result,
          commentUrl: args['comment-url'],
          loopRoot,
        }),
      )
      break
    case 'prepare-checkpoint':
      output(await prepareActiveCheckpoint({ loopRoot, runId: args['run-id'] }))
      break
    case 'record-checkpoint':
      output(
        await recordActiveCheckpointPublication({
          runId: args['run-id'],
          resultPath: args.result,
          commentUrl: args['comment-url'],
          loopRoot,
        }),
      )
      break
    case 'prepare-finalization':
      output(
        await prepareFinalizationRecord({
          runId: args['run-id'],
          status: args.status,
          mergeSha: args['merge-sha'] ?? null,
          failureFingerprint: args['failure-fingerprint'] ?? null,
          finishedAt: args['finished-at'] ? new Date(args['finished-at']) : undefined,
          loopRoot,
        }),
      )
      break
    case 'reconcile':
      output(await reconcileLoopJournal({ loopRoot }))
      break
    case 'restore-checkpoint': {
      const reconciled = await reconcileLoopJournal({ loopRoot })
      const checkpoint = reconciled.activeCheckpoints.find(
        (entry) => entry.record.run.runId === args['run-id'],
      )
      if (!checkpoint) throw new Error(`no durable active checkpoint for ${args['run-id']}`)
      output(await restoreActiveCheckpoint({ loopRoot, checkpoint }))
      break
    }
    case 'observe-owner-merge':
      output(
        await observeOwnerMerge({
          runId: args['run-id'],
          finalizationResultPath: args.result,
          finalizationCommentUrl: args['comment-url'],
          loopRoot,
        }),
      )
      break
    case 'notify':
      output(
        await createNotification({
          runId: args['run-id'],
          type: args.type,
          summary: args.summary,
          requestedAction: args.action,
          targetUrl: args['target-url'] ?? null,
          evidenceUrl: args['evidence-url'] ?? null,
          blocking: Boolean(args.blocking),
          dryRun: Boolean(args['dry-run']),
          loopRoot,
        }),
      )
      break
    case 'detect-work':
      output(
        await detectWork({
          issuesFile: args['issues-file'],
          pullRequestsFile: args['prs-file'],
          repo: args.repo,
          loopRoot,
        }),
      )
      break
    case 'validate':
      if (args['target-compatibility']) {
        throw new Error('target compatibility validation is reserved to wrapped activation')
      }
      output(
        await validateLoop({
          loopRoot,
          activation: Boolean(args.activation),
        }),
      )
      break
    case 'evolve-status':
      output(await getEvolveStatus({ loopRoot }))
      break
    case 'prepare-evolve-request':
      output(
        await prepareEvolveRequestPublication({
          requestId: args['request-id'],
          loopRoot,
        }),
      )
      break
    case 'prepare-bootstrap-authorization':
      output(
        await prepareBootstrapAuthorization({
          authorizationId: args['authorization-id'],
          branch: args.branch,
          baseSha: args['base-sha'],
          headSha: args['head-sha'],
          purpose: args.purpose,
          expiresAt: args['expires-at'],
          now: args.now ? new Date(args.now) : undefined,
          loopRoot,
        }),
      )
      break
    case 'record-evolve-request':
      output(
        await recordEvolveRequestPublication({
          requestId: args['request-id'],
          commentUrl: args['comment-url'],
          loopRoot,
        }),
      )
      break
    case 'evolve-complete':
      output(
        await completeEvolve({
          requestId: args['request-id'],
          summary: args.summary,
          prUrl: args['pr-url'],
          loopRoot,
        }),
      )
      break
    default:
      throw new Error(
        'usage: loopctl.mjs <start|freeze-brief|record-implementation|event|record-pr|record-owner-response|record-evidence|review-digest|record-review|prepare-checkpoint|record-checkpoint|prepare-finalization|record-finalization|reconcile|restore-checkpoint|transition|finalize|observe-owner-merge|notify|detect-work|validate|evolve-status|prepare-evolve-request|prepare-bootstrap-authorization|record-evolve-request|evolve-complete> [options]',
      )
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
