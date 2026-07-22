#!/usr/bin/env node

import { detectWork, parseArguments } from '../scripts/runtime.mjs'

const args = parseArguments(process.argv.slice(2))

detectWork({
  issuesFile: args['issues-file'],
  pullRequestsFile: args['prs-file'],
  repo: args.repo,
})
  .then((result) => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`))
  .catch((error) => {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  })
