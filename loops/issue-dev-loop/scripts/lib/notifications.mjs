import { randomBytes } from 'node:crypto'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  assertNonEmpty,
  assertRunId,
  execFileAsync,
  parseGitHubTarget,
  readJson,
  sameRepository,
  timestampToken,
  writeJson,
} from './common.mjs'
import {
  PAUSED_STATUSES,
  appendValidatedEvent,
  readEvents,
  readRun,
  transitionRun,
} from './run-store.mjs'

function notificationBody(notification, owner) {
  const evidence = notification.evidenceUrl ? `\n\nEvidence: ${notification.evidenceUrl}` : ''
  const resume = notification.blocking
    ? `\n\nTo resume after your decision, include \`RESUME ${notification.runId}\` in a comment. A GitHub “Request changes” review also resumes the run.`
    : ''
  return [
    `@${owner} **${notification.type}**`,
    '',
    notification.summary,
    '',
    `Requested action: ${notification.requestedAction}`,
    '',
    `Notification: \`${notification.notificationId}\` · Run: \`${notification.runId}\`${evidence}${resume}`,
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
  const run = await readRun(loopRoot, normalizedRunId)
  const channelRoot = path.resolve(loopRoot, '..', '_shared', 'owner-channel')
  const channel = await readJson(path.join(channelRoot, 'channel.json'))
  const notificationType = assertNonEmpty(type, 'type')
  if (channel.immediateTypes.includes(notificationType) && !blocking) {
    throw new Error(`${notificationType} must be sent as a blocking notification`)
  }
  const ownerReadyType = ['pr_ready_for_review', 'pr_updated_for_review'].includes(notificationType)
  if (ownerReadyType && (!run.prUrl || !run.headSha || targetUrl !== run.prUrl || !evidenceUrl)) {
    throw new Error(
      `${notificationType} must target the recorded PR and include exact-head evidence`,
    )
  }
  if (ownerReadyType) {
    const events = await readEvents(loopRoot, normalizedRunId)
    for (const eventType of ['verification_completed', 'review_completed']) {
      if (!events.some(
        (event) =>
          event.type === eventType &&
          event.status === 'passed' &&
          event.payload?.headSha === run.headSha &&
          (eventType !== 'verification_completed' || event.payload?.manifestUrl === evidenceUrl),
      )) {
        throw new Error(`${notificationType} requires exact-head verification and review evidence`)
      }
    }
  }
  const target = parseGitHubTarget(targetUrl)
  const issueTarget = parseGitHubTarget(run.issueUrl)
  const pullTarget = parseGitHubTarget(run.prUrl)
  const isRunIssue =
    target?.kind === 'issues' &&
    sameRepository(issueTarget, target) &&
    target.number === run.issueNumber
  const isRunPull =
    target?.kind === 'pull' &&
    pullTarget &&
    sameRepository(pullTarget, target) &&
    target.number === pullTarget.number
  if (
    targetUrl &&
    (!target || (!isRunIssue && !isRunPull))
  ) {
    throw new Error('targetUrl must be the exact run issue or recorded pull request')
  }
  const suffix = (entropy ?? randomBytes(3).toString('hex')).toUpperCase()
  const notificationId = `NTF-${timestampToken(now).replace('Z', '')}-${suffix}`
  const notification = {
    schemaVersion: 1,
    notificationId,
    loop: 'issue-dev-loop',
    runId: normalizedRunId,
    type: notificationType,
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
  const delivered = notification.delivery.github === 'delivered'
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: dryRun ? 'notification_dry_run' : delivered ? 'owner_notified' : 'notification_failed',
    status: dryRun ? 'simulated' : delivered ? 'delivered' : 'failed',
    payload: {
      notificationId,
      notificationType,
      delivery: notification.delivery,
      targetUrl,
      evidenceUrl,
      headSha: run.headSha,
    },
    now,
  })

  if (blocking && !dryRun) {
    if (run.finishedAt === null && !PAUSED_STATUSES.has(run.status)) {
      await transitionRun({ loopRoot, runId: normalizedRunId, status: 'waiting_for_owner', now })
    }
  }
  if (blocking && !delivered && !dryRun) {
    throw new Error(`blocking notification was not delivered: ${notificationId}`)
  }
  return notification
}
