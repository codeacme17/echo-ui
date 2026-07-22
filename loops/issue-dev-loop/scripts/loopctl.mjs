#!/usr/bin/env node

import {
  appendEvent,
  createNotification,
  detectWork,
  finalizeRun,
  parseArguments,
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
          now: args.now ? new Date(args.now) : undefined,
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
      output(
        await transitionRun({
          runId: args['run-id'],
          status: args.status,
          prUrl: args['pr-url'] ?? null,
          headSha: args['head-sha'] ?? null,
          mergeSha: args['merge-sha'] ?? null,
        }),
      )
      break
    case 'finalize':
      output(
        await finalizeRun({
          runId: args['run-id'],
          status: args.status,
          prUrl: args['pr-url'] ?? null,
          headSha: args['head-sha'] ?? null,
          mergeSha: args['merge-sha'] ?? null,
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
      output(await validateLoop())
      break
    default:
      throw new Error(
        'usage: loopctl.mjs <start|event|transition|finalize|notify|detect-work|validate> [options]',
      )
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
