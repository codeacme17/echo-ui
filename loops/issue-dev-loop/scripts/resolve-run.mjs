#!/usr/bin/env node

import { appendFile, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { DEFAULT_LOOP_ROOT, parseArguments } from './runtime.mjs'

const args = parseArguments(process.argv.slice(2))
const loopRoot = args['loop-root'] ? path.resolve(args['loop-root']) : DEFAULT_LOOP_ROOT
const branch = args.branch
if (typeof branch !== 'string' || branch.trim() === '') throw new Error('--branch is required')

const runsRoot = path.join(loopRoot, 'logs', 'runs')
const matches = []
for (const entry of await readdir(runsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  try {
    const run = JSON.parse(await readFile(path.join(runsRoot, entry.name, 'run.json'), 'utf8'))
    if (run.branch === branch && run.finishedAt === null) matches.push(run)
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
}
if (matches.length > 1) throw new Error(`multiple active runs found for ${branch}`)

const result = matches[0]
  ? { hasRun: true, runId: matches[0].runId }
  : { hasRun: false, runId: null }
if (process.env.GITHUB_OUTPUT) {
  await appendFile(
    process.env.GITHUB_OUTPUT,
    `has_run=${result.hasRun}\nrun_id=${result.runId ?? ''}\n`,
    'utf8',
  )
}
process.stdout.write(`${JSON.stringify(result)}\n`)
