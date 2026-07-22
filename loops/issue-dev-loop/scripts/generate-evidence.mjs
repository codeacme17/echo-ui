#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { DEFAULT_LOOP_ROOT, parseArguments } from './runtime.mjs'
import { assertNonEmpty, execFileAsync, pathExists } from './lib/common.mjs'

const args = parseArguments(process.argv.slice(2))
const loopRoot = args['loop-root'] ? path.resolve(args['loop-root']) : DEFAULT_LOOP_ROOT
const runId = assertNonEmpty(args['run-id'], '--run-id')
const headSha = assertNonEmpty(args['head-sha'], '--head-sha')
const status = assertNonEmpty(args.status, '--status')
if (!['passed', 'failed', 'blocked'].includes(status)) throw new Error('unsupported --status')

const run = JSON.parse(
  await readFile(path.join(loopRoot, 'logs', 'runs', runId, 'run.json'), 'utf8'),
)
if (!run.briefDigest || !run.implementationCommit) {
  throw new Error('evidence generation requires the frozen brief and implementation gates')
}
if (!/^[0-9a-f]{40}$/i.test(headSha)) throw new Error('evidence headSha must be a full Git SHA')
if (process.env.GITHUB_ACTIONS === 'true') {
  const repositoryRoot = path.resolve(loopRoot, '..', '..')
  const currentHead = await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot })
  if (currentHead.stdout.trim() !== headSha) {
    throw new Error('evidence headSha does not match the checked-out Git commit')
  }
  await execFileAsync('git', ['merge-base', '--is-ancestor', run.implementationCommit, headSha], {
    cwd: repositoryRoot,
  })
}
const frozenBrief = await readFile(
  path.join(loopRoot, 'handoffs', runId, 'implementation-brief.md'),
  'utf8',
)
if (createHash('sha256').update(frozenBrief).digest('hex') !== run.briefDigest) {
  throw new Error('frozen implementation brief changed after freeze-brief')
}
const screenshotRoot = path.join(loopRoot, 'screen-shots', runId)
const screenshotMetadataPath = path.join(screenshotRoot, 'manifest.json')
let screenshots = []

function readImageDimensions(contents) {
  const isPng =
    contents.length >= 24 &&
    contents.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
    contents.subarray(12, 16).toString('ascii') === 'IHDR'
  if (isPng) {
    return {
      format: 'png',
      width: contents.readUInt32BE(16),
      height: contents.readUInt32BE(20),
    }
  }
  const isWebp =
    contents.length >= 30 &&
    contents.subarray(0, 4).toString('ascii') === 'RIFF' &&
    contents.subarray(8, 12).toString('ascii') === 'WEBP'
  if (!isWebp) return null
  const chunk = contents.subarray(12, 16).toString('ascii')
  if (chunk === 'VP8X') {
    return {
      format: 'webp',
      width: 1 + contents.readUIntLE(24, 3),
      height: 1 + contents.readUIntLE(27, 3),
    }
  }
  if (
    chunk === 'VP8 ' &&
    contents.length >= 30 &&
    contents.subarray(23, 26).equals(Buffer.from([157, 1, 42]))
  ) {
    return {
      format: 'webp',
      width: contents.readUInt16LE(26) & 0x3fff,
      height: contents.readUInt16LE(28) & 0x3fff,
    }
  }
  if (chunk === 'VP8L' && contents.length >= 25 && contents[20] === 47) {
    return {
      format: 'webp',
      width: 1 + (((contents[22] & 0x3f) << 8) | contents[21]),
      height:
        1 + (((contents[24] & 0x0f) << 10) | (contents[23] << 2) | ((contents[22] & 0xc0) >> 6)),
    }
  }
  return null
}

if (await pathExists(screenshotMetadataPath)) {
  const metadata = JSON.parse(await readFile(screenshotMetadataPath, 'utf8'))
  if (!Array.isArray(metadata.screenshots))
    throw new Error('screenshot manifest needs screenshots[]')
  screenshots = metadata.screenshots
  for (const screenshot of screenshots) {
    const target = path.resolve(loopRoot, screenshot.path)
    if (!target.startsWith(`${screenshotRoot}${path.sep}`) || !(await pathExists(target))) {
      throw new Error(`missing or unsafe screenshot path: ${screenshot.path}`)
    }
    const stats = await lstat(target)
    if (!stats.isFile() || stats.isSymbolicLink()) {
      throw new Error(`screenshot must be a regular file: ${screenshot.path}`)
    }
    if (!['before', 'after'].includes(screenshot.phase)) {
      throw new Error('screenshot phase must be before or after')
    }
    for (const field of ['name', 'scenario', 'route', 'viewport', 'capturedAt', 'sourceSha']) {
      assertNonEmpty(screenshot[field], `screenshot.${field}`)
    }
    const normalizedScreenshotPath = path.normalize(screenshot.path)
    const expectedPathPrefix = path.join('screen-shots', runId, screenshot.phase) + path.sep
    const expectedSourceSha = screenshot.phase === 'before' ? run.baseSha : run.implementationCommit
    if (
      path.isAbsolute(screenshot.path) ||
      !normalizedScreenshotPath.startsWith(expectedPathPrefix) ||
      screenshot.sourceSha !== expectedSourceSha ||
      !/^[0-9a-f]{40}$/i.test(screenshot.sourceSha) ||
      Number.isNaN(Date.parse(screenshot.capturedAt))
    ) {
      throw new Error('screenshot metadata must match its source commit and include a capture time')
    }
    const contents = await readFile(target)
    const dimensions = readImageDimensions(contents)
    const expectedExtension = dimensions?.format === 'png' ? '.png' : '.webp'
    if (
      !dimensions ||
      path.extname(screenshot.path).toLowerCase() !== expectedExtension ||
      dimensions.width < 320 ||
      dimensions.height < 200 ||
      dimensions.width > 10000 ||
      dimensions.height > 10000
    ) {
      throw new Error(`screenshot is not a meaningful PNG/WebP capture: ${screenshot.path}`)
    }
    screenshot.width = dimensions.width
    screenshot.height = dimensions.height
    screenshot.headSha = headSha
    screenshot.sha256 = createHash('sha256').update(contents).digest('hex')
  }
}
if (run.uiEvidenceRequired) {
  const pairs = new Map()
  for (const screenshot of screenshots) {
    const key = `${screenshot.scenario}\u0000${screenshot.route}\u0000${screenshot.viewport}`
    if (!pairs.has(key)) pairs.set(key, new Set())
    pairs.get(key).add(screenshot.phase)
  }
  if (pairs.size === 0 || [...pairs.values()].some((phases) => phases.size !== 2)) {
    throw new Error('UI changes require paired before/after screenshots for every scenario')
  }
}

const output = path.resolve(assertNonEmpty(args.output, '--output'))
const runEvents = (
  await readFile(path.join(loopRoot, 'logs', 'runs', runId, 'events.jsonl'), 'utf8')
)
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line))
const implementationEvent = runEvents.findLast(
  (event) =>
    event.type === 'implementation_completed' &&
    event.payload?.commitSha === run.implementationCommit,
)
if (!implementationEvent?.payload?.resultPath) {
  throw new Error('evidence generation requires the latest $implement result')
}
const implementationResultPath = path.resolve(loopRoot, implementationEvent.payload.resultPath)
if (
  !implementationResultPath.startsWith(`${path.join(loopRoot, 'logs', 'runs', runId)}${path.sep}`)
) {
  throw new Error('latest $implement result path is outside the run directory')
}
const implementationResult = JSON.parse(await readFile(implementationResultPath, 'utf8'))
const targetedChecks = implementationResult.checks
  .filter((check) => !/^pnpm verify(?:\s|$)/.test(check.command))
  .map((check) => ({
    command: check.command,
    status: check.status,
    exitCode: check.status === 'passed' ? 0 : 1,
    startedAt: implementationResult.startedAt,
    finishedAt: implementationResult.finishedAt,
    artifactUrl: null,
  }))
const manifest = {
  schemaVersion: 1,
  runId,
  issueNumber: run.issueNumber,
  baseSha: run.baseSha,
  headSha,
  verdict: status,
  checks: [
    ...targetedChecks,
    {
      command: 'pnpm verify',
      status,
      exitCode: status === 'passed' ? 0 : 1,
      startedAt: assertNonEmpty(args['started-at'], '--started-at'),
      finishedAt: assertNonEmpty(args['finished-at'], '--finished-at'),
      artifactUrl: null,
    },
  ],
  screenshots,
  limitations: [],
}

await mkdir(path.dirname(output), { recursive: true })
await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
process.stdout.write(`${output}\n`)
