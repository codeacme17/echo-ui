#!/usr/bin/env node

import { DEFAULT_LOOP_ROOT } from './lib/common.mjs'
import { readOwnerChannel, runWithGitHubRole } from './lib/github-identity.mjs'
import { loadTrustedControlPlane } from './lib/trusted-control-plane.mjs'

function parseCommandLine(argv) {
  const values = [...argv]
  let loopRoot = DEFAULT_LOOP_ROOT
  if (values[0] === '--loop-root') {
    if (!values[1]) throw new Error('--loop-root requires a path')
    loopRoot = values[1]
    values.splice(0, 2)
  }
  const role = values.shift()
  if (values.shift() !== '--') {
    throw new Error(
      'usage: with-github-identity.mjs [--loop-root <path>] <automation|reviewer> -- <command> [args...]',
    )
  }
  const command = values.shift()
  if (!command) throw new Error('a command is required after --')
  return { loopRoot, role, command, args: values }
}

async function main() {
  const options = parseCommandLine(process.argv.slice(2))
  const trustedControlPlane = await loadTrustedControlPlane()
  const channel = await readOwnerChannel(trustedControlPlane.loopRoot)
  process.exitCode = await runWithGitHubRole({ channel, trustedControlPlane, ...options })
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
