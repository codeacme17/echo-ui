#!/usr/bin/env node

import { spawn } from 'node:child_process'

import {
  assertDescendantCommandPolicy,
  assertPushTargetsRepository,
  assertSafeRemoteGitConfiguration,
  hardenedGitArguments,
} from './lib/github-identity.mjs'
import { loadTrustedControlPlane } from './lib/trusted-control-plane.mjs'

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
  const executableName = tool === 'credential' ? 'gh' : tool
  if (!['git', 'gh'].includes(executableName)) {
    throw new Error(`unsupported authenticated tool: ${tool}`)
  }
  if (
    tool === 'credential' &&
    (args.length !== 1 || !['get', 'store', 'erase'].includes(args[0]))
  ) {
    throw new Error('Git credential helper requires one supported operation')
  }
  const trustedControlPlane = await loadTrustedControlPlane()
  const executable = trustedControlPlane.executables[executableName]
  const executableArgs =
    tool === 'credential'
      ? ['auth', 'git-credential', ...args]
      : tool === 'git'
        ? hardenedGitArguments(args, {
            expectedRepository: authorization?.expectedRepository,
          })
        : args
  if (tool !== 'credential') {
    if (tool === 'git' && args[0] === 'push') {
      const branch = authorization?.issue?.branch
      const expectedRollback = [
        'push',
        `--force-with-lease=refs/heads/${branch}:${authorization?.issue?.baseSha}`,
        'origin',
        `:refs/heads/${branch}`,
      ]
      if (
        authorization?.rootIntent !== 'start' ||
        authorization?.issue?.status !== 'starting' ||
        args.length !== expectedRollback.length ||
        args.some((argument, index) => argument !== expectedRollback[index])
      ) {
        throw new Error('authenticated descendant processes cannot push')
      }
    }
    assertDescendantCommandPolicy({
      role,
      tool,
      args,
      authorization,
    })
    if (tool === 'git' && ['push', 'fetch', 'ls-remote'].includes(args[0])) {
      await assertSafeRemoteGitConfiguration({
        realGit: executable,
        environment: process.env,
      })
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
