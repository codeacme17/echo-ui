#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { DEFAULT_LOOP_ROOT, parseArguments } from './runtime.mjs'
import { assertNonEmpty, pathExists } from './lib/common.mjs'

const args = parseArguments(process.argv.slice(2))
const loopRoot = args['loop-root'] ? path.resolve(args['loop-root']) : DEFAULT_LOOP_ROOT
const runId = assertNonEmpty(args['run-id'], '--run-id')
const headSha = assertNonEmpty(args['head-sha'], '--head-sha')
const status = assertNonEmpty(args.status, '--status')
if (!['passed', 'failed', 'blocked'].includes(status)) throw new Error('unsupported --status')

const run = JSON.parse(
  await readFile(path.join(loopRoot, 'logs', 'runs', runId, 'run.json'), 'utf8'),
)
const screenshotRoot = path.join(loopRoot, 'screen-shots', runId)
const screenshotMetadataPath = path.join(screenshotRoot, 'manifest.json')
let screenshots = []
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
  }
}

const output = path.resolve(assertNonEmpty(args.output, '--output'))
const manifest = {
  schemaVersion: 1,
  runId,
  issueNumber: run.issueNumber,
  headSha,
  verdict: status,
  checks: [
    {
      command: 'pnpm verify',
      status,
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
