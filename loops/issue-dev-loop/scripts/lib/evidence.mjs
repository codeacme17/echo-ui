import { createHash } from 'node:crypto'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import {
  DEFAULT_LOOP_ROOT,
  assertArray,
  assertHttpUrl,
  assertNonEmpty,
  assertRunId,
  defaultGitHubApi,
  execFileAsync,
  parseArtifactUrl,
  parseGitHubTarget,
  parsePullCommentUrl,
  parseReviewUrl,
  readJson,
  runDirectory,
  sameGitHubLogin,
  sameRepository,
} from './common.mjs'
import { appendValidatedEvent, readEvents, readRun } from './run-store.mjs'
import { verifyLatestDurableCheckpoint } from './checkpoint-proof.mjs'

const REVIEW_CLASSIFICATIONS = new Set(['accepted', 'rejected', 'stale', 'already-fixed'])

async function defaultArtifactManifestLoader({ owner, repo, runId, artifactName }) {
  const temporary = await mkdtemp(path.join(tmpdir(), 'echo-ui-loop-artifact-'))
  try {
    await execFileAsync(
      'gh',
      [
        'run',
        'download',
        runId,
        '--repo',
        `${owner}/${repo}`,
        '--name',
        artifactName,
        '--dir',
        temporary,
      ],
      { maxBuffer: 1024 * 1024 },
    )
    const entries = await readdir(temporary, { recursive: true, withFileTypes: true })
    const manifests = entries.filter((entry) => entry.isFile() && entry.name === 'manifest.json')
    if (manifests.length !== 1) {
      throw new Error('evidence artifact must contain exactly one manifest.json')
    }
    return readFile(path.join(manifests[0].parentPath, manifests[0].name), 'utf8')
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}

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
  const reviewUrls = new Set()
  const roundDetails = []
  for (const [roundIndex, round] of rounds.entries()) {
    const roundHeadSha = assertNonEmpty(round.headSha, `review.rounds[${roundIndex}].headSha`)
    if (!/^[0-9a-f]{40}$/i.test(roundHeadSha)) {
      throw new Error(`review.rounds[${roundIndex}].headSha must be a full Git SHA`)
    }
    if (round.round !== roundIndex + 1 || !['PASS', 'CHANGES_REQUESTED'].includes(round.verdict)) {
      throw new Error('review rounds must be ordered and have a supported verdict')
    }
    const roundReviewUrl = assertHttpUrl(round.reviewUrl, `review.rounds[${roundIndex}].reviewUrl`)
    if (reviewUrls.has(roundReviewUrl)) throw new Error('each review round requires a unique URL')
    reviewUrls.add(roundReviewUrl)
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
      if (!new RegExp(`^RVW-${round.round}-[0-9]+$`).test(findingId) || findingIds.has(findingId)) {
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
        const fixCommit = assertNonEmpty(resolution.fixCommit, `${findingId}.resolution.fixCommit`)
        if (!/^[0-9a-f]{40}$/i.test(fixCommit)) {
          throw new Error(`${findingId}.resolution.fixCommit must be a full Git SHA`)
        }
      }
      if (['P0', 'P1'].includes(finding.severity) && resolution.classification === 'rejected') {
        assertHttpUrl(resolution.adjudicationUrl, `${findingId}.resolution.adjudicationUrl`)
        if (
          !['REJECT_FINDING', 'OWNER_REJECTED_FINDING'].includes(resolution.adjudicationVerdict)
        ) {
          throw new Error(`${findingId} rejected P0/P1 requires a rejecting adjudication verdict`)
        }
      }
    }
    roundDetails.push(round)
  }
  return { findingCount, rounds: rounds.length, roundDetails }
}

export async function recordEvidence({
  loopRoot = DEFAULT_LOOP_ROOT,
  runId,
  manifestPath,
  publicationUrl,
  now = new Date(),
  githubApi = defaultGitHubApi,
  artifactManifestLoader = defaultArtifactManifestLoader,
  checkpointVerifier = verifyLatestDurableCheckpoint,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (run.finishedAt !== null) throw new Error(`run is already finalized: ${normalizedRunId}`)
  if (!run.prUrl || !run.headSha) throw new Error('record-evidence requires a recorded draft PR')
  const runEvents = await readEvents(loopRoot, normalizedRunId)
  await checkpointVerifier({
    loopRoot,
    runId: normalizedRunId,
    events: runEvents,
    operation: 'record-evidence',
    githubApi,
  })

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
    manifest.issueNumber !== run.issueNumber ||
    manifest.baseSha !== run.baseSha
  ) {
    throw new Error('evidence manifest does not match the run')
  }
  const headSha = assertNonEmpty(manifest.headSha, 'manifest.headSha')
  if (!/^[0-9a-f]{40}$/i.test(headSha)) {
    throw new Error('manifest.headSha must be a full Git SHA')
  }
  if (manifest.verdict !== 'passed') throw new Error('evidence manifest must have passed verdict')
  const publishedEvidenceUrl = assertHttpUrl(publicationUrl, 'publicationUrl')
  const artifactTarget = parseArtifactUrl(publishedEvidenceUrl)
  if (!artifactTarget || !sameRepository(parseGitHubTarget(run.issueUrl), artifactTarget)) {
    throw new Error('publicationUrl must be a GitHub Actions artifact for the issue repository')
  }
  const artifact = await githubApi(
    `repos/${artifactTarget.owner}/${artifactTarget.repo}/actions/artifacts/${artifactTarget.artifactId}`,
  )
  const workflowRun = await githubApi(
    `repos/${artifactTarget.owner}/${artifactTarget.repo}/actions/runs/${artifactTarget.runId}`,
  )
  const pullTarget = parseGitHubTarget(run.prUrl)
  if (
    String(artifact.id) !== artifactTarget.artifactId ||
    artifact.expired === true ||
    String(artifact.workflow_run?.id) !== artifactTarget.runId ||
    artifact.workflow_run?.head_sha !== headSha ||
    artifact.name !== `issue-dev-loop-${normalizedRunId}-${headSha}` ||
    workflowRun.id !== Number(artifactTarget.runId) ||
    workflowRun.status !== 'completed' ||
    workflowRun.conclusion !== 'success' ||
    workflowRun.event !== 'pull_request' ||
    workflowRun.head_sha !== headSha ||
    workflowRun.head_branch !== run.branch ||
    workflowRun.path?.split('@')[0] !== '.github/workflows/issue-dev-loop-evidence.yml' ||
    !workflowRun.pull_requests?.some(
      (pullRequest) =>
        pullRequest.number === pullTarget.number &&
        pullRequest.base?.ref === 'dev' &&
        pullRequest.base?.repo?.full_name?.toLowerCase() ===
          `${pullTarget.owner}/${pullTarget.repo}`.toLowerCase(),
    )
  ) {
    throw new Error('evidence artifact metadata does not match the run and exact headSha')
  }
  if (headSha !== run.headSha) throw new Error('evidence manifest is not for the recorded PR head')
  const artifactManifest = await artifactManifestLoader({
    owner: artifactTarget.owner,
    repo: artifactTarget.repo,
    runId: artifactTarget.runId,
    artifactName: artifact.name,
  })
  if (artifactManifest !== source) {
    throw new Error('local evidence manifest does not match the published artifact manifest')
  }

  const checks = assertArray(manifest.checks, 'manifest.checks')
  if (checks.length === 0 || checks.some((check) => check.status !== 'passed')) {
    throw new Error('all evidence checks must pass')
  }
  if (!checks.some((check) => /^pnpm verify(?:\s|$)/.test(check.command))) {
    throw new Error('evidence checks must include pnpm verify')
  }
  const latestImplementation = runEvents.findLast(
    (event) =>
      event.type === 'implementation_completed' &&
      event.payload?.commitSha === run.implementationCommit,
  )
  const implementationResultPath = path.resolve(
    loopRoot,
    assertNonEmpty(latestImplementation?.payload?.resultPath, 'implementation result path'),
  )
  if (
    !implementationResultPath.startsWith(`${runDirectory(loopRoot, normalizedRunId)}${path.sep}`)
  ) {
    throw new Error('implementation result path is outside the current run')
  }
  const implementationResultSource = await readFile(implementationResultPath, 'utf8')
  const implementationResultDigest = createHash('sha256')
    .update(implementationResultSource)
    .digest('hex')
  if (implementationResultDigest !== latestImplementation.payload?.resultDigest) {
    throw new Error('$implement result no longer matches its recorded digest')
  }
  const implementationResult = JSON.parse(implementationResultSource)
  const expectedCommands = implementationResult.checks.map((check) => check.command)
  if (expectedCommands.some((command) => !checks.some((check) => check.command === command))) {
    throw new Error('evidence manifest omits an attested $implement check')
  }
  for (const [index, check] of checks.entries()) {
    assertNonEmpty(check.command, `checks[${index}].command`)
    if (!Number.isInteger(check.exitCode) || check.exitCode !== 0) {
      throw new Error(`checks[${index}] requires a successful exitCode`)
    }
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
    for (const field of [
      'name',
      'scenario',
      'route',
      'viewport',
      'path',
      'capturedAt',
      'sourceSha',
    ]) {
      assertNonEmpty(screenshot[field], `screenshots[${index}].${field}`)
    }
    const expectedSourceSha = screenshot.phase === 'before' ? run.baseSha : run.implementationCommit
    if (
      !['before', 'after'].includes(screenshot.phase) ||
      screenshot.headSha !== headSha ||
      screenshot.sourceSha !== expectedSourceSha ||
      !Number.isInteger(screenshot.width) ||
      !Number.isInteger(screenshot.height) ||
      screenshot.width < 320 ||
      screenshot.height < 200 ||
      !/^[0-9a-f]{64}$/i.test(screenshot.sha256) ||
      Number.isNaN(Date.parse(screenshot.capturedAt))
    ) {
      throw new Error(`screenshots[${index}] is not bound to the evidence head`)
    }
  }
  if (
    run.uiEvidenceRequired &&
    (!manifest.screenshots.some((screenshot) => screenshot.phase === 'before') ||
      !manifest.screenshots.some((screenshot) => screenshot.phase === 'after'))
  ) {
    throw new Error('UI evidence requires before and after screenshots')
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
  githubApi = defaultGitHubApi,
  checkpointVerifier = verifyLatestDurableCheckpoint,
} = {}) {
  const normalizedRunId = assertRunId(runId)
  const run = await readRun(loopRoot, normalizedRunId)
  if (run.finishedAt !== null) throw new Error(`run is already finalized: ${normalizedRunId}`)
  await checkpointVerifier({
    loopRoot,
    runId: normalizedRunId,
    events: await readEvents(loopRoot, normalizedRunId),
    operation: 'record-review',
    githubApi,
  })
  const resolvedResultPath = path.resolve(assertNonEmpty(resultPath, 'resultPath'))
  const expectedResultRoot = runDirectory(loopRoot, normalizedRunId)
  if (!resolvedResultPath.startsWith(`${expectedResultRoot}${path.sep}`)) {
    throw new Error('resultPath must be inside the current run directory')
  }
  const source = await readFile(resolvedResultPath, 'utf8')
  const result = JSON.parse(source)
  if (result.schemaVersion !== 1 || result.runId !== normalizedRunId) {
    throw new Error('review result does not match the run')
  }
  const headSha = assertNonEmpty(result.headSha, 'review.headSha')
  if (!/^[0-9a-f]{40}$/i.test(headSha)) throw new Error('review.headSha must be a full Git SHA')
  const reviewSummary = validateReviewEvidence(result, headSha)
  const publishedReviewUrl = assertHttpUrl(reviewUrl, 'reviewUrl')
  if (reviewSummary.roundDetails.at(-1).reviewUrl !== publishedReviewUrl) {
    throw new Error('reviewUrl must be the final review round URL')
  }
  const reviewTarget = parseReviewUrl(publishedReviewUrl)
  const recordedPullTarget = parseGitHubTarget(run.prUrl)
  if (
    !reviewTarget ||
    !sameRepository(parseGitHubTarget(run.issueUrl), reviewTarget) ||
    reviewTarget.number !== recordedPullTarget?.number
  ) {
    throw new Error('reviewUrl must be a GitHub review on the recorded run PR')
  }
  const resultDigest = createHash('sha256').update(source).digest('hex')
  const channel = await readJson(
    path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
  )
  const automationLogin = assertNonEmpty(
    channel.automationGitHubLogin,
    'channel.automationGitHubLogin',
  )
  const reviewerLogin = assertNonEmpty(channel.reviewerGitHubLogin, 'channel.reviewerGitHubLogin')
  if (
    sameGitHubLogin(automationLogin, reviewerLogin) ||
    sameGitHubLogin(channel.ownerGitHubLogin, reviewerLogin)
  ) {
    throw new Error('reviewerGitHubLogin must be independent from executor and owner identities')
  }
  const digestMarker = `<!-- issue-dev-loop:${normalizedRunId}:review-result-sha256:${resultDigest} -->`
  const publications = new Map()
  const priorFindingIds = new Set()
  let previousSubmittedAt = -Infinity
  for (const round of reviewSummary.roundDetails) {
    const roundTarget = parseReviewUrl(round.reviewUrl)
    if (
      !roundTarget ||
      !sameRepository(reviewTarget, roundTarget) ||
      roundTarget.number !== reviewTarget.number
    ) {
      throw new Error(`review round ${round.round} is not published on the recorded PR`)
    }
    const roundEndpoint = `repos/${roundTarget.owner}/${roundTarget.repo}/pulls/${roundTarget.number}/reviews/${roundTarget.reviewId}`
    const [publishedRound, roundComments] = await Promise.all([
      githubApi(roundEndpoint),
      githubApi(`${roundEndpoint}/comments?per_page=100`),
    ])
    const bodies = [
      publishedRound.body ?? '',
      ...roundComments.map((comment) => comment.body ?? ''),
    ]
    const roundMarker = `<!-- issue-dev-loop:${normalizedRunId}:review-round:${round.round}:head:${round.headSha} -->`
    const submittedAt = Date.parse(publishedRound.submitted_at)
    if (
      publishedRound.commit_id !== round.headSha ||
      publishedRound.state !== 'COMMENTED' ||
      !sameGitHubLogin(publishedRound.user?.login, reviewerLogin) ||
      Number.isNaN(submittedAt) ||
      submittedAt < previousSubmittedAt ||
      !bodies.some((body) => body.includes(roundMarker)) ||
      (round.round === reviewSummary.rounds && !bodies.some((body) => body.includes(digestMarker)))
    ) {
      throw new Error(`published GitHub review round ${round.round} is not bound to its exact head`)
    }
    const expectedFindingIds = new Set(round.findings.map((finding) => finding.findingId))
    const publishedFindingIds = new Set(
      bodies.flatMap((body) => body.match(/\bRVW-[0-9]+-[0-9]+\b/g) ?? []),
    )
    if (
      [...expectedFindingIds].some((findingId) => !publishedFindingIds.has(findingId)) ||
      [...publishedFindingIds].some(
        (findingId) => !expectedFindingIds.has(findingId) && !priorFindingIds.has(findingId),
      ) ||
      (round.round === reviewSummary.rounds &&
        [...priorFindingIds].some((findingId) => !publishedFindingIds.has(findingId)))
    ) {
      throw new Error(`published GitHub review round ${round.round} has unrecorded findings`)
    }
    for (const comment of roundComments) {
      const commentFindingIds = new Set(comment.body?.match(/\bRVW-[0-9]+-[0-9]+\b/g) ?? [])
      if (
        !sameGitHubLogin(comment.user?.login, reviewerLogin) ||
        commentFindingIds.size === 0 ||
        [...commentFindingIds].some((findingId) => !expectedFindingIds.has(findingId))
      ) {
        throw new Error(
          `published GitHub review round ${round.round} has an unrecorded reviewer inline comment`,
        )
      }
    }
    for (const finding of round.findings) {
      const findingMarker = `<!-- issue-dev-loop:${normalizedRunId}:${finding.findingId} -->`
      const requiredFindingFragments = [
        findingMarker,
        finding.findingId,
        finding.severity,
        finding.confidence,
        finding.problem,
        finding.evidence,
        finding.expectedResolution,
      ]
      if (
        !bodies.some((body) =>
          requiredFindingFragments.every((fragment) => body.includes(fragment)),
        )
      ) {
        throw new Error(`${finding.findingId} is not published verbatim in its GitHub review round`)
      }
      if (
        finding.path &&
        Number.isInteger(finding.line) &&
        !roundComments.some(
          (comment) =>
            comment.path === finding.path &&
            [comment.line, comment.original_line].includes(finding.line) &&
            requiredFindingFragments.every((fragment) => comment.body?.includes(fragment)),
        )
      ) {
        throw new Error(`${finding.findingId} requires a matching inline GitHub review comment`)
      }
    }
    publications.set(round.round, {
      submittedAt: publishedRound.submitted_at,
    })
    for (const findingId of expectedFindingIds) priorFindingIds.add(findingId)
    previousSubmittedAt = submittedAt
  }
  const livePullRequest = await githubApi(
    `repos/${reviewTarget.owner}/${reviewTarget.repo}/pulls/${reviewTarget.number}`,
  )
  if (
    livePullRequest.state !== 'open' ||
    livePullRequest.base?.ref !== 'dev' ||
    livePullRequest.head?.ref !== run.branch ||
    livePullRequest.head?.sha !== headSha ||
    run.headSha !== headSha
  ) {
    throw new Error('published review is not bound to the recorded live PR head')
  }
  const runEvents = await readEvents(loopRoot, normalizedRunId)
  for (const round of reviewSummary.roundDetails) {
    const publication = publications.get(round.round)
    const reviewSubmittedAt = Date.parse(publication.submittedAt)
    for (const finding of round.findings) {
      const responseTarget = parsePullCommentUrl(finding.resolution.responseUrl)
      if (
        !responseTarget ||
        responseTarget.surface !== 'pull' ||
        !sameRepository(reviewTarget, responseTarget) ||
        responseTarget.number !== reviewTarget.number
      ) {
        throw new Error(`${finding.findingId} response is not on the reviewed PR`)
      }
      const responseEndpoint =
        responseTarget.kind === 'review_comment'
          ? `repos/${responseTarget.owner}/${responseTarget.repo}/pulls/comments/${responseTarget.commentId}`
          : `repos/${responseTarget.owner}/${responseTarget.repo}/issues/comments/${responseTarget.commentId}`
      const response = await githubApi(responseEndpoint)
      const responseAt = Date.parse(response.created_at ?? response.updated_at)
      const responseMarker = `<!-- issue-dev-loop:${normalizedRunId}:${finding.findingId}:${finding.resolution.classification} -->`
      if (
        !sameGitHubLogin(response.user?.login, automationLogin) ||
        Number.isNaN(responseAt) ||
        responseAt < reviewSubmittedAt ||
        !response.body?.includes(responseMarker) ||
        !response.body?.includes(finding.resolution.evidence) ||
        (finding.resolution.classification === 'accepted' &&
          !response.body?.includes(finding.resolution.fixCommit))
      ) {
        throw new Error(
          `${finding.findingId} response is not published with its classification and evidence`,
        )
      }
      if (finding.resolution.classification === 'accepted') {
        const implementationEvent = runEvents.find(
          (event) =>
            event.type === 'implementation_completed' &&
            event.status === 'passed' &&
            event.payload?.agent === '$implement' &&
            event.payload?.briefDigest === run.briefDigest &&
            event.payload?.commitSha === finding.resolution.fixCommit,
        )
        if (
          !implementationEvent ||
          Date.parse(implementationEvent.payload.startedAt) < reviewSubmittedAt ||
          responseAt < Date.parse(implementationEvent.payload.finishedAt)
        ) {
          throw new Error(`${finding.findingId} fixCommit lacks a recorded $implement invocation`)
        }
        const [findingToFix, fixToHead] = await Promise.all([
          githubApi(
            `repos/${reviewTarget.owner}/${reviewTarget.repo}/compare/${finding.headSha}...${finding.resolution.fixCommit}`,
          ),
          githubApi(
            `repos/${reviewTarget.owner}/${reviewTarget.repo}/compare/${finding.resolution.fixCommit}...${headSha}`,
          ),
        ])
        if (
          findingToFix.status !== 'ahead' ||
          findingToFix.base_commit?.sha !== finding.headSha ||
          !['ahead', 'identical'].includes(fixToHead.status) ||
          fixToHead.base_commit?.sha !== finding.resolution.fixCommit
        ) {
          throw new Error(
            `${finding.findingId} fixCommit must be after the finding head and within the reviewed head`,
          )
        }
      }
      if (
        ['P0', 'P1'].includes(finding.severity) &&
        finding.resolution.classification === 'rejected'
      ) {
        const adjudicationTarget = parsePullCommentUrl(finding.resolution.adjudicationUrl)
        if (
          !adjudicationTarget ||
          adjudicationTarget.surface !== 'pull' ||
          !sameRepository(reviewTarget, adjudicationTarget) ||
          adjudicationTarget.number !== reviewTarget.number
        ) {
          throw new Error(`${finding.findingId} adjudication is not on the reviewed PR`)
        }
        const adjudicationEndpoint =
          adjudicationTarget.kind === 'review_comment'
            ? `repos/${adjudicationTarget.owner}/${adjudicationTarget.repo}/pulls/comments/${adjudicationTarget.commentId}`
            : `repos/${adjudicationTarget.owner}/${adjudicationTarget.repo}/issues/comments/${adjudicationTarget.commentId}`
        const adjudication = await githubApi(adjudicationEndpoint)
        const adjudicationAt = Date.parse(adjudication.created_at ?? adjudication.updated_at)
        const expectedVerdict = finding.resolution.adjudicationVerdict
        const expectedMarker = `<!-- issue-dev-loop:${normalizedRunId}:${finding.findingId}:adjudication:${expectedVerdict} -->`
        const permittedAdjudicator =
          (expectedVerdict === 'REJECT_FINDING' &&
            sameGitHubLogin(adjudication.user?.login, reviewerLogin)) ||
          (expectedVerdict === 'OWNER_REJECTED_FINDING' &&
            sameGitHubLogin(adjudication.user?.login, channel.ownerGitHubLogin))
        if (
          !permittedAdjudicator ||
          !adjudication.body?.includes(expectedMarker) ||
          Number.isNaN(adjudicationAt) ||
          adjudicationAt < reviewSubmittedAt
        ) {
          throw new Error(`${finding.findingId} lacks independent published adjudication`)
        }
      }
    }
  }
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
  return {
    headSha,
    reviewUrl: publishedReviewUrl,
    resultDigest,
    findingCount: reviewSummary.findingCount,
    rounds: reviewSummary.rounds,
  }
}
