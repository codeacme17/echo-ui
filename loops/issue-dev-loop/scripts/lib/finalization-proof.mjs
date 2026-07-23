import { createHash } from 'node:crypto'
import path from 'node:path'

import {
  assertNonEmpty,
  defaultGitHubApi,
  parseGitHubTarget,
  parsePullCommentUrl,
  readJson,
  sameGitHubLogin,
  sameRepository,
} from './common.mjs'
import { observeOwnerApprovedMerge } from './owner-gate.mjs'

const TERMINAL_STATUSES = new Set(['completed', 'failed', 'blocked', 'cancelled'])

export function canonicalFinalizationRecord(record) {
  return JSON.stringify({
    schemaVersion: 1,
    runId: record.runId,
    issueNumber: record.issueNumber,
    status: record.status,
    startedAt: record.startedAt,
    finishedAt: record.finishedAt,
    prUrl: record.prUrl ?? null,
    headSha: record.headSha ?? null,
    mergeSha: record.mergeSha ?? null,
    failureFingerprint: record.failureFingerprint ?? null,
    notificationUrl: record.notificationUrl ?? null,
    readyNotificationUrl: record.readyNotificationUrl ?? null,
    readyNotifiedAt: record.readyNotifiedAt ?? null,
    completionNotifiedAt: record.completionNotifiedAt ?? null,
    notificationWebhookStatus: record.notificationWebhookStatus ?? null,
  })
}

export function finalizationRecordDigest(record) {
  return createHash('sha256').update(canonicalFinalizationRecord(record)).digest('hex')
}

export function validateFinalizationRecord(record, run = null) {
  if (
    record?.schemaVersion !== 1 ||
    !TERMINAL_STATUSES.has(record.status) ||
    !Number.isInteger(record.issueNumber) ||
    Number.isNaN(Date.parse(record.startedAt)) ||
    Number.isNaN(Date.parse(record.finishedAt)) ||
    Date.parse(record.finishedAt) < Date.parse(record.startedAt) ||
    (record.headSha !== null && !/^[0-9a-f]{40}$/i.test(record.headSha)) ||
    (record.mergeSha !== null && !/^[0-9a-f]{40}$/i.test(record.mergeSha)) ||
    ![
      'readyNotificationUrl',
      'readyNotifiedAt',
      'completionNotifiedAt',
      'notificationWebhookStatus',
    ].every((field) => Object.hasOwn(record, field))
  ) {
    throw new Error('invalid finalization journal record')
  }
  if (
    record.status === 'completed' &&
    (!record.prUrl ||
      !record.headSha ||
      !record.mergeSha ||
      record.failureFingerprint !== null ||
      !record.notificationUrl ||
      !record.readyNotificationUrl ||
      record.notificationUrl === record.readyNotificationUrl ||
      Number.isNaN(Date.parse(record.readyNotifiedAt)) ||
      Number.isNaN(Date.parse(record.completionNotifiedAt)) ||
      Date.parse(record.readyNotifiedAt) > Date.parse(record.completionNotifiedAt) ||
      Date.parse(record.completionNotifiedAt) > Date.parse(record.finishedAt) ||
      !record.notificationWebhookStatus ||
      ['pending', 'dry_run'].includes(record.notificationWebhookStatus))
  ) {
    throw new Error(
      'completed finalization record requires PR, head, merge, Ready, and completion-notification proof',
    )
  }
  if (['failed', 'blocked'].includes(record.status)) {
    assertNonEmpty(record.failureFingerprint, 'failureFingerprint')
    if (!record.notificationUrl) {
      throw new Error('failed or blocked finalization requires a notification URL')
    }
  }
  if (record.status === 'cancelled' && (!record.prUrl || !record.headSha)) {
    throw new Error('cancelled finalization requires a published PR')
  }
  if (
    record.status !== 'completed' &&
    [
      record.readyNotificationUrl,
      record.readyNotifiedAt,
      record.completionNotifiedAt,
      record.notificationWebhookStatus,
    ].some((value) => value !== null)
  ) {
    throw new Error('non-completed finalization cannot contain completion-notification proof')
  }
  if (
    run &&
    (record.runId !== run.runId ||
      record.issueNumber !== run.issueNumber ||
      record.startedAt !== run.startedAt ||
      record.prUrl !== run.prUrl ||
      record.headSha !== run.headSha ||
      (run.finishedAt !== null &&
        (record.status !== run.status ||
          record.finishedAt !== run.finishedAt ||
          record.mergeSha !== run.mergeSha)))
  ) {
    throw new Error('finalization journal record does not match the run')
  }
  return record
}

export async function finalizationJournalConfiguration(loopRoot) {
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  if (
    !Number.isInteger(channel.stateIssueNumber) ||
    channel.stateIssueNumber < 1 ||
    !channel.automationGitHubLogin
  ) {
    throw new Error('owner channel must configure stateIssueNumber and automationGitHubLogin')
  }
  const [owner, repo] = channel.repository.split('/')
  return { channel, owner, repo }
}

export async function verifyPullNotificationComment({
  url,
  allowedTypes,
  runId,
  prUrl,
  channel,
  githubApi,
  requiredBodyFragments = [],
}) {
  const target = parsePullCommentUrl(url)
  const pullTarget = parseGitHubTarget(prUrl)
  if (
    !target ||
    target.kind !== 'issue_comment' ||
    target.surface !== 'pull' ||
    !pullTarget ||
    !sameRepository(target, pullTarget) ||
    target.number !== pullTarget.number
  ) {
    throw new Error('completion proof notification must be a comment on the recorded PR')
  }
  const comment = await githubApi(
    `repos/${target.owner}/${target.repo}/issues/comments/${target.commentId}`,
  )
  const notificationType = allowedTypes.find((type) => comment.body?.includes(`**${type}**`))
  if (
    !notificationType ||
    !sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin) ||
    !comment.body?.includes(`Run: \`${runId}\``) ||
    requiredBodyFragments.some((fragment) => !comment.body?.includes(fragment)) ||
    Number.isNaN(Date.parse(comment.created_at))
  ) {
    throw new Error('completion proof notification is not durable automation-authored evidence')
  }
  return { comment, notificationType }
}

export async function verifyTerminalExternalProof({
  loopRoot,
  record,
  expectedHeadBranch = `codex/issue-${record.issueNumber}`,
  githubApi = defaultGitHubApi,
} = {}) {
  const validated = validateFinalizationRecord(record)
  const { channel, owner, repo } = await finalizationJournalConfiguration(loopRoot)
  const configuredTarget = { owner, repo }
  if (validated.status === 'completed') {
    const readyNotification = await verifyPullNotificationComment({
      url: validated.readyNotificationUrl,
      allowedTypes: ['pr_ready_for_review', 'pr_updated_for_review'],
      runId: validated.runId,
      prUrl: validated.prUrl,
      channel,
      githubApi,
    })
    if (readyNotification.comment.created_at !== validated.readyNotifiedAt) {
      throw new Error('completed finalization Ready notification timestamp changed')
    }
    const merge = await observeOwnerApprovedMerge({
      loopRoot,
      prUrl: validated.prUrl,
      expectedHeadSha: validated.headSha,
      expectedHeadBranch,
      readyAfter: validated.readyNotifiedAt,
      githubApi,
    })
    if (merge.mergeSha !== validated.mergeSha) {
      throw new Error('completed finalization does not match the remote owner merge')
    }
    const completionNotification = await verifyPullNotificationComment({
      url: validated.notificationUrl,
      allowedTypes: ['pr_completed'],
      runId: validated.runId,
      prUrl: validated.prUrl,
      channel,
      githubApi,
      requiredBodyFragments: [validated.mergeSha],
    })
    if (
      completionNotification.comment.created_at !== validated.completionNotifiedAt ||
      Number.isNaN(Date.parse(merge.mergeAt)) ||
      Date.parse(validated.completionNotifiedAt) < Date.parse(merge.mergeAt)
    ) {
      throw new Error('completed finalization completion-notification timestamp changed')
    }
  }
  if (['failed', 'blocked'].includes(validated.status)) {
    const target = parsePullCommentUrl(validated.notificationUrl)
    const issueTarget = parseGitHubTarget(
      `https://github.com/${owner}/${repo}/issues/${validated.issueNumber}`,
    )
    const pullTarget = parseGitHubTarget(validated.prUrl)
    if (
      !target ||
      target.kind !== 'issue_comment' ||
      !sameRepository(target, configuredTarget) ||
      !['pull', 'issues'].includes(target.surface) ||
      (target.surface === 'issues' &&
        (!sameRepository(target, issueTarget) || target.number !== validated.issueNumber)) ||
      (target.surface === 'pull' &&
        (!pullTarget || !sameRepository(target, pullTarget) || target.number !== pullTarget.number))
    ) {
      throw new Error('terminal notification URL is not bound to the configured run issue or PR')
    }
    const comment = await githubApi(
      `repos/${target.owner}/${target.repo}/issues/comments/${target.commentId}`,
    )
    const expectedType = validated.status === 'failed' ? 'loop_failed' : 'blocked'
    if (
      !sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin) ||
      !comment.body?.includes(`**${expectedType}**`) ||
      !comment.body?.includes(`Run: \`${validated.runId}\``)
    ) {
      throw new Error('terminal notification lacks durable automation-authored proof')
    }
  }
  if (validated.status === 'cancelled') {
    const target = parseGitHubTarget(validated.prUrl)
    if (!target || target.kind !== 'pull' || !sameRepository(target, configuredTarget)) {
      throw new Error('cancelled finalization requires a configured-repository PR')
    }
    const pull = await githubApi(`repos/${target.owner}/${target.repo}/pulls/${target.number}`)
    if (pull.state !== 'closed' || pull.merged === true || pull.head?.sha !== validated.headSha) {
      throw new Error('cancelled finalization requires the recorded PR closed without merge')
    }
  }
  return validated
}

export async function verifyPublishedFinalization({
  loopRoot,
  record,
  commentUrl,
  expectedHeadBranch,
  githubApi = defaultGitHubApi,
} = {}) {
  const validated = await verifyTerminalExternalProof({
    loopRoot,
    record,
    expectedHeadBranch,
    githubApi,
  })
  const { channel, owner, repo } = await finalizationJournalConfiguration(loopRoot)
  const target = parsePullCommentUrl(commentUrl)
  if (
    !target ||
    target.surface !== 'issues' ||
    target.kind !== 'issue_comment' ||
    target.owner.toLowerCase() !== owner.toLowerCase() ||
    target.repo.toLowerCase() !== repo.toLowerCase() ||
    target.number !== channel.stateIssueNumber
  ) {
    throw new Error('finalization comment must be on the configured state journal issue')
  }
  const comment = await githubApi(
    `repos/${target.owner}/${target.repo}/issues/comments/${target.commentId}`,
  )
  const digest = finalizationRecordDigest(validated)
  const marker = `<!-- issue-dev-loop:finalization:${validated.runId}:sha256:${digest} -->`
  if (
    !sameGitHubLogin(comment.user?.login, channel.automationGitHubLogin) ||
    !comment.body?.includes(marker) ||
    !comment.body?.includes(canonicalFinalizationRecord(validated))
  ) {
    throw new Error('published finalization comment does not attest the exact record')
  }
  return { record: validated, digest, commentUrl }
}
