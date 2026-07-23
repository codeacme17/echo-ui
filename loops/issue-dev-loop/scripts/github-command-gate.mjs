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
  let authorization
  try {
    authorization = JSON.parse(process.env.ECHO_UI_LOOP_AUTHORIZATION)
  } catch {
    throw new Error('authenticated command gate has invalid authorization context')
  }
  if (!authorization?.expectedRepository) {
    throw new Error('authenticated command gate has invalid authorization context')
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
      authorization,
    })
    if (tool === 'git' && args[0] === 'push') {
      await assertPushTargetsRepository({
        expectedRepository: authorization.expectedRepository,
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
