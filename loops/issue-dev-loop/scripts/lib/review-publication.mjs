import path from 'node:path'

function exactlyOne(values, name) {
  const candidates = values.get(name) ?? []
  if (candidates.length !== 1) throw new Error(`${name} must be provided exactly once`)
  return candidates[0]
}

function parseOptions(args) {
  const supported = new Set([
    '--loop-root',
    '--pr',
    '--head',
    '--cycle',
    '--round',
    '--body',
    '--comment',
  ])
  const values = new Map()
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index]
    const value = args[index + 1]
    if (!supported.has(name) || value === undefined) {
      throw new Error('invalid trusted review publisher arguments')
    }
    values.set(name, [...(values.get(name) ?? []), value])
  }
  return values
}

function parsePublication(body, authorization) {
  const matches = [
    ...body.matchAll(
      /<!-- issue-dev-loop:([^:]+):review-cycle:([1-9][0-9]*):round:([12]):head:([0-9a-f]{40}) -->/gi,
    ),
  ]
  if (
    matches.length !== 1 ||
    matches[0][1] !== authorization?.issue?.runId ||
    matches[0][4].toLowerCase() !== authorization?.issue?.headSha?.toLowerCase()
  ) {
    throw new Error('review body must contain one exact run, cycle, round, and head marker')
  }
  return {
    cycle: Number(matches[0][2]),
    round: Number(matches[0][3]),
  }
}

function parseComment(source, { authorization, cycle, round }) {
  let comment
  try {
    comment = JSON.parse(source)
  } catch {
    throw new Error('each --comment must contain one JSON object')
  }
  const keys = Object.keys(comment).sort()
  if (
    JSON.stringify(keys) !== JSON.stringify(['body', 'line', 'path', 'side']) ||
    typeof comment.path !== 'string' ||
    comment.path.length === 0 ||
    path.posix.isAbsolute(comment.path) ||
    comment.path.includes('\\') ||
    comment.path.split('/').includes('..') ||
    !Number.isInteger(comment.line) ||
    comment.line < 1 ||
    !['LEFT', 'RIGHT'].includes(comment.side) ||
    typeof comment.body !== 'string' ||
    !comment.body.includes(
      `<!-- issue-dev-loop:${authorization.issue.runId}:RVW-${cycle}-${round}-`,
    )
  ) {
    throw new Error('review comments must contain one safe exact-head inline finding')
  }
  return comment
}

export function parseReviewPublisherArguments(
  args,
  { authorization, expectedLoopRoot = null } = {},
) {
  if (!authorization?.issue?.runId || !authorization?.expectedRepository) {
    throw new Error('trusted review publisher requires an active issue run')
  }
  const values = parseOptions(args)
  const loopRoot = exactlyOne(values, '--loop-root')
  if (expectedLoopRoot && path.resolve(loopRoot) !== path.resolve(expectedLoopRoot)) {
    throw new Error('trusted review publisher loop root does not match the routed target')
  }
  const prNumber = Number(exactlyOne(values, '--pr'))
  const headSha = exactlyOne(values, '--head').toLowerCase()
  const cycle = Number(exactlyOne(values, '--cycle'))
  const round = Number(exactlyOne(values, '--round'))
  const body = exactlyOne(values, '--body')
  const publication = parsePublication(body, authorization)
  if (
    !Number.isInteger(prNumber) ||
    prNumber !== authorization.issue.prNumber ||
    !/^[0-9a-f]{40}$/.test(headSha) ||
    headSha !== authorization.issue.headSha?.toLowerCase() ||
    !Number.isInteger(cycle) ||
    !Number.isInteger(round) ||
    publication.cycle !== cycle ||
    publication.round !== round
  ) {
    throw new Error('trusted review publisher target does not match the durable PR head')
  }
  const commentSources = values.get('--comment') ?? []
  if (commentSources.length < 1 || commentSources.length > 50) {
    throw new Error('trusted review publisher requires between one and fifty inline comments')
  }
  const comments = commentSources.map((source) =>
    parseComment(source, { authorization, cycle, round }),
  )
  const findingIds = comments.map(
    (comment) =>
      comment.body.match(
        new RegExp(
          `<!-- issue-dev-loop:${authorization.issue.runId}:(RVW-${cycle}-${round}-[1-9][0-9]*) -->`,
        ),
      )?.[1] ?? null,
  )
  if (findingIds.some((findingId) => !findingId) || new Set(findingIds).size !== findingIds.length) {
    throw new Error('trusted review publisher requires unique stable finding markers')
  }
  return {
    endpoint: `repos/${authorization.expectedRepository}/pulls/${prNumber}/reviews`,
    payload: {
      commit_id: headSha,
      event: 'COMMENT',
      body,
      comments,
    },
    publication: { cycle, round, headSha },
  }
}

export function reviewPublisherSyntheticGitHubArguments(request) {
  const args = [
    'api',
    request.endpoint,
    '--method',
    'POST',
    '-f',
    `commit_id=${request.payload.commit_id}`,
    '-f',
    'event=COMMENT',
    '-f',
    `body=${request.payload.body}`,
  ]
  for (const comment of request.payload.comments) {
    args.push(
      '-F',
      `comments[][path]=${comment.path}`,
      '-F',
      `comments[][line]=${comment.line}`,
      '-F',
      `comments[][side]=${comment.side}`,
      '-f',
      `comments[][body]=${comment.body}`,
    )
  }
  return args
}
