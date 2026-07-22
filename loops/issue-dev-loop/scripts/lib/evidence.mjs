import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  assertArray,
  assertHttpUrl,
  assertNonEmpty,
  assertRunId,
  parseArtifactUrl,
  parseGitHubTarget,
  parseReviewUrl,
  sameRepository,
} from './common.mjs'
import { appendValidatedEvent, readRun } from './run-store.mjs'

const REVIEW_CLASSIFICATIONS = new Set(['accepted', 'rejected', 'stale', 'already-fixed'])

function validateReviewEvidence(review, headSha) {
  if (!review || typeof review !== 'object' || Array.isArray(review)) {
    throw new Error('evidence review must be an object')
  }
  if (review.reviewerAgent !== 'echo_ui_pr_reviewer' || review.freshContext !== true) {
    throw new Error('review must come from fresh-context echo_ui_pr_reviewer')
  }
  if (review.headSha !== headSha || review.verdict !== 'PASS') {
    throw new Error('review PASS must be bound to the evidence headSha')
  }

  const rounds = assertArray(review.rounds, 'review.rounds')
  if (rounds.length < 1 || rounds.length > 2) {
    throw new Error('review.rounds must contain one or two rounds')
  }
  const lastRound = rounds.at(-1)
  if (lastRound?.headSha !== headSha || lastRound?.verdict !== 'PASS') {
    throw new Error('the last review round must PASS the evidence headSha')
  }

  let findingCount = 0
  const findingIds = new Set()
  for (const [roundIndex, round] of rounds.entries()) {
    assertNonEmpty(round.headSha, `review.rounds[${roundIndex}].headSha`)
    if (round.round !== roundIndex + 1 || !['PASS', 'CHANGES_REQUESTED'].includes(round.verdict)) {
      throw new Error('review rounds must be ordered and have a supported verdict')
    }
    const findings = assertArray(round.findings, `review.rounds[${roundIndex}].findings`)
    if (round.verdict === 'PASS' && findings.length > 0) {
      throw new Error('a PASS review round cannot contain findings')
    }
    if (round.verdict === 'CHANGES_REQUESTED' && findings.length === 0) {
      throw new Error('a CHANGES_REQUESTED review round must contain findings')
    }
    for (const finding of findings) {
      findingCount += 1
      const findingId = assertNonEmpty(finding.findingId, 'finding.findingId')
      if (!/^RVW-[0-9]+-[0-9]+$/.test(findingId) || findingIds.has(findingId)) {
        throw new Error(`invalid or duplicate finding ID: ${findingId}`)
      }
      findingIds.add(findingId)
      if (!['P0', 'P1', 'P2', 'P3'].includes(finding.severity)) {
        throw new Error('finding.severity must be P0, P1, P2, or P3')
      }
      if (!['high', 'medium', 'low'].includes(finding.confidence)) {
        throw new Error(`${findingId}.confidence must be high, medium, or low`)
      }
      assertNonEmpty(finding.problem, `${findingId}.problem`)
      assertNonEmpty(finding.evidence, `${findingId}.evidence`)
      assertNonEmpty(finding.expectedResolution, `${findingId}.expectedResolution`)
      if (finding.headSha !== round.headSha) {
        throw new Error(`${findingId} is not bound to its review round headSha`)
      }
      const resolution = finding.resolution
      if (!resolution || !REVIEW_CLASSIFICATIONS.has(resolution.classification)) {
        throw new Error(`${findingId} requires a final non-human classification`)
      }
      assertHttpUrl(resolution.responseUrl, `${findingId}.resolution.responseUrl`)
      assertNonEmpty(resolution.evidence, `${findingId}.resolution.evidence`)
      if (resolution.classification === 'accepted') {
        assertNonEmpty(resolution.fixCommit, `${findingId}.resolution.fixCommit`)
      }
    }
  }
  return { findingCount, rounds: rounds.length }
}

export async function recordEvidence({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  manifestPath,
  publicationUrl,
  now = new Date(),
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (run.finishedAt !== null) throw new Error(`run is already finalized: ${normalizedRunId}`)

  const evidenceRoot = path.resolve(loopRoot, 'evidence')
  const resolvedManifest = path.resolve(assertNonEmpty(manifestPath, 'manifestPath'))
  if (!resolvedManifest.startsWith(`${evidenceRoot}${path.sep}`)) {
    throw new Error('manifestPath must be inside the loop evidence directory')
  }
  const source = await readFile(resolvedManifest, 'utf8')
  const manifest = JSON.parse(source)
  if (
    manifest.schemaVersion !== 1 ||
    manifest.runId !== normalizedRunId ||
    manifest.issueNumber !== run.issueNumber
  ) {
    throw new Error('evidence manifest does not match the run')
  }
  const headSha = assertNonEmpty(manifest.headSha, 'manifest.headSha')
  if (!/^[0-9a-f]{7,40}$/i.test(headSha)) throw new Error('manifest.headSha must be a Git SHA')
  if (manifest.verdict !== 'passed') throw new Error('evidence manifest must have passed verdict')
  const publishedEvidenceUrl = assertHttpUrl(publicationUrl, 'publicationUrl')
  const artifactTarget = parseArtifactUrl(publishedEvidenceUrl)
  if (!artifactTarget || !sameRepository(parseGitHubTarget(run.issueUrl), artifactTarget)) {
    throw new Error('publicationUrl must be a GitHub Actions artifact for the issue repository')
  }

  const checks = assertArray(manifest.checks, 'manifest.checks')
  if (checks.length === 0 || checks.some((check) => check.status !== 'passed')) {
    throw new Error('all evidence checks must pass')
  }
  if (!checks.some((check) => /^pnpm verify(?:\s|$)/.test(check.command))) {
    throw new Error('evidence checks must include pnpm verify')
  }
  for (const [index, check] of checks.entries()) {
    assertNonEmpty(check.command, `checks[${index}].command`)
    if (Number.isNaN(Date.parse(check.startedAt)) || Number.isNaN(Date.parse(check.finishedAt))) {
      throw new Error(`checks[${index}] requires valid timestamps`)
    }
    if (check.artifactUrl !== null && check.artifactUrl !== undefined) {
      assertHttpUrl(check.artifactUrl, `checks[${index}].artifactUrl`)
    }
  }
  for (const [index, screenshot] of assertArray(
    manifest.screenshots,
    'manifest.screenshots',
  ).entries()) {
    assertNonEmpty(screenshot.name, `screenshots[${index}].name`)
    assertNonEmpty(screenshot.path, `screenshots[${index}].path`)
  }
  const manifestDigest = createHash('sha256').update(source).digest('hex')
  const relativeManifestPath = path.relative(loopRoot, resolvedManifest)
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'verification_completed',
    status: 'passed',
    payload: {
      verdict: 'passed',
      headSha,
      manifestPath: relativeManifestPath,
      manifestUrl: publishedEvidenceUrl,
      manifestDigest,
    },
    now,
  })
  return {
    headSha,
    manifestPath: relativeManifestPath,
    publicationUrl: publishedEvidenceUrl,
    manifestDigest,
  }
}

export async function recordReview({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  resultPath,
  reviewUrl,
  now = new Date(),
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (run.finishedAt !== null) throw new Error(`run is already finalized: ${normalizedRunId}`)
  const source = await readFile(path.resolve(assertNonEmpty(resultPath, 'resultPath')), 'utf8')
  const result = JSON.parse(source)
  if (result.schemaVersion !== 1 || result.runId !== normalizedRunId) {
    throw new Error('review result does not match the run')
  }
  const headSha = assertNonEmpty(result.headSha, 'review.headSha')
  const reviewSummary = validateReviewEvidence(result, headSha)
  const publishedReviewUrl = assertHttpUrl(reviewUrl, 'reviewUrl')
  const reviewTarget = parseReviewUrl(publishedReviewUrl)
  if (!reviewTarget || !sameRepository(parseGitHubTarget(run.issueUrl), reviewTarget)) {
    throw new Error('reviewUrl must be a GitHub pull request review for the issue repository')
  }
  const resultDigest = createHash('sha256').update(source).digest('hex')
  await appendValidatedEvent({
    loopRoot,
    runId: normalizedRunId,
    type: 'review_completed',
    status: 'passed',
    payload: {
      verdict: 'PASS',
      headSha,
      reviewUrl: publishedReviewUrl,
      resultDigest,
      findingCount: reviewSummary.findingCount,
      reviewRounds: reviewSummary.rounds,
      unresolvedHighSeverityFindings: 0,
    },
    now,
  })
  return { headSha, reviewUrl: publishedReviewUrl, resultDigest, ...reviewSummary }
}
