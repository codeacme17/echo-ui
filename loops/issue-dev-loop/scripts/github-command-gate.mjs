#!/usr/bin/env node

import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  assertDescendantCommandPolicy,
  assertPushTargetsRepository,
  resolveExecutable,
} from './lib/github-identity.mjs'

async function main() {
  const [tool, ...args] = process.argv.slice(2)
  const role = process.env.ECHO_UI_LOOP_GITHUB_ROLE
  if (!['automation', 'reviewer'].includes(role)) {
    throw new Error('authenticated command gate is missing its verified runtime context')
  }
  const identityBinDirectory = path.dirname(fileURLToPath(import.meta.url))
  const executableName = tool === 'credential' ? 'gh' : tool
  if (!['git', 'gh'].includes(executableName)) {
    throw new Error(`unsupported authenticated tool: ${tool}`)
  }
  const executable = await resolveExecutable(executableName, process.env, {
    skipDirectories: [path.join(identityBinDirectory, 'identity-bin')],
  })
  const executableArgs = tool === 'credential' ? ['auth', 'git-credential'] : args
  if (tool !== 'credential') {
    assertDescendantCommandPolicy({
      role,
      tool,
      args,
      allowedPushBranch: process.env.ECHO_UI_LOOP_ALLOWED_PUSH_BRANCH || null,
      expectedRepository: process.env.ECHO_UI_LOOP_EXPECTED_REPOSITORY || null,
    })
    if (tool === 'git' && args[0] === 'push') {
      await assertPushTargetsRepository({
        expectedRepository: process.env.ECHO_UI_LOOP_EXPECTED_REPOSITORY,
        realGit: executable,
        environment: process.env,
      })
    }
  }
  const child = spawn(executable, executableArgs, {
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
