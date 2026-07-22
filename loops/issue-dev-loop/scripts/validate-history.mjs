#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { DEFAULT_LOOP_ROOT, parseArguments } from './runtime.mjs'
import { execFileAsync } from './lib/common.mjs'

const args = parseArguments(process.argv.slice(2))
const loopRoot = args['loop-root'] ? path.resolve(args['loop-root']) : DEFAULT_LOOP_ROOT
const repositoryRoot = path.resolve(loopRoot, '..', '..')
const relativeIndex = path.relative(repositoryRoot, path.join(loopRoot, 'logs', 'index.jsonl'))
const baseRef = args['base-ref'] ?? 'origin/dev'
const current = await readFile(path.join(repositoryRoot, relativeIndex), 'utf8')
const base = await execFileAsync('git', ['show', `${baseRef}:${relativeIndex}`], {
  cwd: repositoryRoot,
  maxBuffer: 1024 * 1024,
})
if (!current.startsWith(base.stdout)) {
  throw new Error('logs/index.jsonl must preserve the dev history as an exact prefix')
}
process.stdout.write('append-only history verified\n')
