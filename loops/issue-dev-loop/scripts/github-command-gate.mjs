#!/usr/bin/env node

import { spawn } from 'node:child_process'

import { assertDescendantCommandPolicy } from './lib/github-identity.mjs'

async function main() {
  const [tool, ...args] = process.argv.slice(2)
  const role = process.env.ECHO_UI_LOOP_GITHUB_ROLE
  const executable =
    tool === 'git'
      ? process.env.ECHO_UI_LOOP_REAL_GIT
      : tool === 'gh'
        ? process.env.ECHO_UI_LOOP_REAL_GH
        : null
  if (!executable || !['automation', 'reviewer'].includes(role)) {
    throw new Error('authenticated command gate is missing its verified runtime context')
  }
  assertDescendantCommandPolicy({
    role,
    tool,
    args,
    allowedPushBranch: process.env.ECHO_UI_LOOP_ALLOWED_PUSH_BRANCH || null,
  })
  const child = spawn(executable, args, {
    env: process.env,
    stdio: 'inherit',
    shell: false,
  })
  await new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${tool} terminated by signal ${signal}`))
        return
      }
      process.exitCode = code ?? 1
      resolve()
    })
  })
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
