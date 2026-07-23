#!/usr/bin/env node

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

  switch (command) {
    case 'start':
      output(
        await startRun({
          issueNumber: args.issue,
          issueTitle: args.title,
          issueUrl: args.url,
          baseSha: args['base-sha'],
          now: args.now ? new Date(args.now) : undefined,
        }),
      )
      break
    case 'freeze-brief':
      output(await freezeBrief({ runId: args['run-id'] }))
      break
    case 'record-implementation':
      output(
        await recordImplementation({
          runId: args['run-id'],
          resultPath: args.result,
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
        }),
      )
      break
    case 'transition':
      output(await transitionRun(runTransitionOptions(args)))
      break
    case 'finalize':
      output(await finalizeRun(runTransitionOptions(args)))
      break
    case 'record-evidence':
      output(
        await recordEvidence({
          runId: args['run-id'],
          manifestPath: args.manifest,
          publicationUrl: args['publication-url'],
        }),
      )
      break
    case 'record-pr':
      output(
        await recordPullRequest({
          runId: args['run-id'],
          prUrl: args['pr-url'],
          headSha: args['head-sha'],
        }),
      )
      break
    case 'record-owner-response':
      output(
        await recordOwnerResponse({
          runId: args['run-id'],
          responseUrl: args['response-url'],
        }),
      )
      break
    case 'record-review':
      output(
        await recordReview({
          runId: args['run-id'],
          resultPath: args.result,
          reviewUrl: args['review-url'],
        }),
      )
      break
    case 'record-finalization':
      output(
        await recordFinalizationPublication({
          runId: args['run-id'],
          resultPath: args.result,
          commentUrl: args['comment-url'],
        }),
      )
      break
    case 'prepare-checkpoint':
      output(await prepareActiveCheckpoint({ runId: args['run-id'] }))
      break
    case 'record-checkpoint':
      output(
        await recordActiveCheckpointPublication({
          runId: args['run-id'],
          resultPath: args.result,
          commentUrl: args['comment-url'],
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
        }),
      )
      break
    case 'reconcile':
      output(await reconcileLoopJournal())
      break
    case 'restore-checkpoint': {
      const reconciled = await reconcileLoopJournal()
      const checkpoint = reconciled.activeCheckpoints.find(
        (entry) => entry.record.run.runId === args['run-id'],
      )
      if (!checkpoint) throw new Error(`no durable active checkpoint for ${args['run-id']}`)
      output(await restoreActiveCheckpoint({ checkpoint }))
      break
    }
    case 'observe-owner-merge':
      output(
        await observeOwnerMerge({
          runId: args['run-id'],
          finalizationResultPath: args.result,
          finalizationCommentUrl: args['comment-url'],
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
        }),
      )
      break
    case 'detect-work':
      output(
        await detectWork({
          issuesFile: args['issues-file'],
          pullRequestsFile: args['prs-file'],
          repo: args.repo,
        }),
      )
      break
    case 'validate':
      output(await validateLoop({ activation: Boolean(args.activation) }))
      break
    case 'evolve-status':
      output(await getEvolveStatus())
      break
    case 'prepare-evolve-request':
      output(
        await prepareEvolveRequestPublication({
          requestId: args['request-id'],
        }),
      )
      break
    case 'record-evolve-request':
      output(
        await recordEvolveRequestPublication({
          requestId: args['request-id'],
          commentUrl: args['comment-url'],
        }),
      )
      break
    case 'evolve-complete':
      output(
        await completeEvolve({
          requestId: args['request-id'],
          summary: args.summary,
          prUrl: args['pr-url'],
        }),
      )
      break
    default:
      throw new Error(
        'usage: loopctl.mjs <start|freeze-brief|record-implementation|event|record-pr|record-owner-response|record-evidence|record-review|prepare-checkpoint|record-checkpoint|prepare-finalization|record-finalization|reconcile|restore-checkpoint|transition|finalize|observe-owner-merge|notify|detect-work|validate|evolve-status|prepare-evolve-request|record-evolve-request|evolve-complete> [options]',
      )
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
