#!/usr/bin/env node

import path from 'node:path'

import { parseArguments } from './lib/common.mjs'
import { validateHistoricalTarget } from './lib/validation.mjs'

const args = parseArguments(process.argv.slice(2))
const loopRoot = args['loop-root'] ? path.resolve(args['loop-root']) : undefined
const result = await validateHistoricalTarget({ loopRoot })
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
