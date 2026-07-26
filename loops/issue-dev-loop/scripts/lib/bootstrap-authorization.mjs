import { createHash } from 'node:crypto'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  assertHttpUrl,
  assertNonEmpty,
  defaultGitHubApi,
  parsePullCommentUrl,
  readJson,
  sameGitHubLogin,
  sameRepository,
} from './common.mjs'

export const BOOTSTRAP_AUTHORIZATION_ENVIRONMENT_VARIABLE =
  'ECHO_UI_LOOP_BOOTSTRAP_AUTHORIZATION_URL'

const AUTHORIZATION_LIFETIME_MS = 24 * 60 * 60 * 1000
const CLOCK_SKEW_MS = 5 * 60 * 1000
const AUTHORIZATION_ID_PATTERN = /^BST-[A-Z0-9][A-Z0-9-]{5,63}$/
const BOOTSTRAP_BRANCH_PATTERN = /^codex\/bootstrap-[a-z0-9][a-z0-9._-]{0,63}$/

function stateJournalTarget(channel) {
  const [owner, repo] = channel.repository.split('/')
  return { owner, repo, number: channel.stateIssueNumber }
}

function validateBootstrapAuthorization(record) {
  const normalized = {
    schemaVersion: record.schemaVersion,
    kind: record.kind,
    authorizationId: record.authorizationId,
    repository: record.repository,
    branch: record.branch,
    baseSha: typeof record.baseSha === 'string' ? record.baseSha.toLowerCase() : record.baseSha,
    headSha: typeof record.headSha === 'string' ? record.headSha.toLowerCase() : record.headSha,
    authorizedActor: record.authorizedActor,
    purpose: record.purpose,
    expiresAt: record.expiresAt,
  }
  if (
    normalized.schemaVersion !== 1 ||
    normalized.kind !== 'control-plane-bootstrap' ||
    !AUTHORIZATION_ID_PATTERN.test(normalized.authorizationId ?? '') ||
    !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(normalized.repository ?? '') ||
    !BOOTSTRAP_BRANCH_PATTERN.test(normalized.branch ?? '') ||
    !/^[0-9a-f]{40}$/i.test(normalized.baseSha ?? '') ||
    !/^[0-9a-f]{40}$/i.test(normalized.headSha ?? '') ||
    normalized.baseSha === normalized.headSha ||
    !assertNonEmpty(normalized.authorizedActor, 'bootstrap.authorizedActor') ||
    !assertNonEmpty(normalized.purpose, 'bootstrap.purpose') ||
    normalized.purpose.length > 240 ||
    Number.isNaN(Date.parse(normalized.expiresAt))
  ) {
    throw new Error('invalid bootstrap authorization')
  }
  return normalized
}

export function canonicalBootstrapAuthorization(record) {
  return JSON.stringify(validateBootstrapAuthorization(record))
}

export function bootstrapAuthorizationDigest(record) {
  return createHash('sha256')
    .update(canonicalBootstrapAuthorization(record))
    .digest('hex')
}

export function bootstrapAuthorizationBody(record) {
  const normalized = validateBootstrapAuthorization(record)
  const serialized = canonicalBootstrapAuthorization(normalized)
  const digest = bootstrapAuthorizationDigest(normalized)
  return [
    `<!-- issue-dev-loop:bootstrap-authorization:${normalized.authorizationId}:sha256:${digest} -->`,
    '```json',
    serialized,
    '```',
  ].join('\n')
}

function parseBootstrapAuthorizationBody(body) {
  const match = body?.match(
    /^<!-- issue-dev-loop:bootstrap-authorization:([^:]+):sha256:([0-9a-f]{64}) -->\n```json\n([^\n]+)\n```$/,
  )
  if (!match) throw new Error('bootstrap authorization comment has an invalid body')
  const record = validateBootstrapAuthorization(JSON.parse(match[3]))
  const digest = bootstrapAuthorizationDigest(record)
  if (
    record.authorizationId !== match[1] ||
    digest !== match[2] ||
    bootstrapAuthorizationBody(record) !== body
  ) {
    throw new Error('bootstrap authorization comment digest does not match')
  }
  return { record, digest }
}

export async function prepareBootstrapAuthorization({
  loopRoot = DEFAULT_LOOP_ROOT,
  authorizationId,
  branch,
  baseSha,
  headSha,
  purpose,
  expiresAt,
  now = new Date(),
} = {}) {
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const record = validateBootstrapAuthorization({
    schemaVersion: 1,
    kind: 'control-plane-bootstrap',
    authorizationId,
    repository: channel.repository,
    branch,
    baseSha,
    headSha,
    authorizedActor: channel.automationGitHubLogin,
    purpose,
    expiresAt:
      expiresAt ??
      new Date(now.getTime() + AUTHORIZATION_LIFETIME_MS).toISOString(),
  })
  const journal = stateJournalTarget(channel)
  return {
    record,
    digest: bootstrapAuthorizationDigest(record),
    body: bootstrapAuthorizationBody(record),
    journalIssueUrl: `https://github.com/${channel.repository}/issues/${journal.number}`,
  }
}

export async function verifyBootstrapAuthorizationComment({
  loopRoot = DEFAULT_LOOP_ROOT,
  commentUrl,
  now = new Date(),
  githubApi = defaultGitHubApi,
} = {}) {
  const publicationUrl = assertHttpUrl(commentUrl, 'bootstrap.commentUrl')
  const target = parsePullCommentUrl(publicationUrl)
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const journal = stateJournalTarget(channel)
  if (
    target?.kind !== 'issue_comment' ||
    target.surface !== 'issues' ||
    target.number !== journal.number ||
    !sameRepository(target, journal)
  ) {
    throw new Error('bootstrap authorization must be an owner comment on the state journal')
  }
  const comment = await githubApi(
    `repos/${target.owner}/${target.repo}/issues/comments/${target.commentId}`,
  )
  if (!sameGitHubLogin(comment.user?.login, channel.ownerGitHubLogin)) {
    throw new Error('bootstrap authorization must be authored by the configured owner')
  }
  const { record, digest } = parseBootstrapAuthorizationBody(comment.body)
  const createdAt = Date.parse(comment.created_at)
  const expiresAt = Date.parse(record.expiresAt)
  if (
    Number.isNaN(createdAt) ||
    createdAt > now.getTime() + CLOCK_SKEW_MS ||
    expiresAt <= now.getTime() ||
    expiresAt > createdAt + AUTHORIZATION_LIFETIME_MS
  ) {
    throw new Error('bootstrap authorization is expired or has an unsafe lifetime')
  }
  if (
    record.repository.toLowerCase() !== channel.repository.toLowerCase() ||
    !sameGitHubLogin(record.authorizedActor, channel.automationGitHubLogin)
  ) {
    throw new Error('bootstrap authorization does not match the configured repository identities')
  }
  return {
    ...record,
    publicationUrl,
    publicationDigest: digest,
    ownerLogin: comment.user.login,
    ownerAuthorizedAt: comment.created_at,
  }
}
