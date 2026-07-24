#!/usr/bin/env node

import { appendFile, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { assertRunId } from './lib/common.mjs'
import { DEFAULT_LOOP_ROOT, parseArguments } from './runtime.mjs'

const args = parseArguments(process.argv.slice(2))
const loopRoot = args['loop-root'] ? path.resolve(args['loop-root']) : DEFAULT_LOOP_ROOT
const branch = args.branch
if (typeof branch !== 'string' || !/^codex\/issue-[1-9][0-9]*$/.test(branch)) {
  throw new Error('--branch must be codex/issue-<number>')
}

const runsRoot = path.join(loopRoot, 'logs', 'runs')
const matches = []
for (const entry of await readdir(runsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  try {
    const run = JSON.parse(await readFile(path.join(runsRoot, entry.name, 'run.json'), 'utf8'))
    const runId = assertRunId(run.runId)
    if (runId !== entry.name) throw new Error('run ID must match its directory')
    if (run.branch === branch && run.finishedAt === null) matches.push(run)
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
}
if (matches.length > 1) throw new Error(`multiple active runs found for ${branch}`)

if (matches[0] && !/^[0-9a-f]{40}$/i.test(matches[0].baseSha ?? '')) {
  throw new Error('active run baseSha must be a full Git SHA')
}
const result = matches[0]
  ? { hasRun: true, runId: matches[0].runId, baseSha: matches[0].baseSha }
  : { hasRun: false, runId: null, baseSha: null }
if (process.env.GITHUB_OUTPUT) {
  await appendFile(
    process.env.GITHUB_OUTPUT,
    `has_run=${result.hasRun}\nrun_id=${result.runId ?? ''}\nbase_sha=${result.baseSha ?? ''}\n`,
    'utf8',
  )
}
process.stdout.write(`${JSON.stringify(result)}\n`)
