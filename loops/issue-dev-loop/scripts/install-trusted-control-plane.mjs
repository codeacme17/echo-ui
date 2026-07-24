#!/usr/bin/env node

import { execFile } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { constants } from 'node:fs'
import {
  access,
  chmod,
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const sourceLoopRoot = path.resolve(scriptDirectory, '..')
const repositoryRoot = path.resolve(sourceLoopRoot, '..', '..')

function parseTarget(argv) {
  const index = argv.indexOf('--target')
  const value = index === -1 ? null : argv[index + 1]
  if (!value || !path.isAbsolute(value)) {
    throw new Error('usage: install-trusted-control-plane.mjs --target <absolute-empty-directory>')
  }
  return path.resolve(value)
}

async function resolveExecutable(name) {
  for (const directory of (process.env.PATH ?? '').split(path.delimiter)) {
    if (!directory) continue
    const candidate = path.join(directory, name)
    try {
      await access(candidate, constants.X_OK)
      return realpath(candidate)
    } catch (error) {
      if (error?.code !== 'ENOENT' && error?.code !== 'EACCES') throw error
    }
  }
  throw new Error(`required executable is unavailable during trusted installation: ${name}`)
}

async function regularFiles(root) {
  const files = []
  const visit = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name)
      if (entry.isDirectory()) await visit(target)
      else if (entry.isFile() && !entry.isSymbolicLink()) files.push(target)
      else throw new Error(`trusted control plane refuses non-regular source: ${target}`)
    }
  }
  await visit(root)
  return files
}

async function directories(root, output = []) {
  output.push(root)
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (entry.isDirectory()) await directories(path.join(root, entry.name), output)
  }
  return output
}

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`
}

async function main() {
  const requestedTarget = parseTarget(process.argv.slice(2))
  await mkdir(path.dirname(requestedTarget), { recursive: true })
  const [canonicalTargetParent, canonicalRepositoryRoot] = await Promise.all([
    realpath(path.dirname(requestedTarget)),
    realpath(repositoryRoot),
  ])
  const targetBundleRoot = path.join(canonicalTargetParent, path.basename(requestedTarget))
  if (
    targetBundleRoot === canonicalRepositoryRoot ||
    targetBundleRoot.startsWith(`${canonicalRepositoryRoot}${path.sep}`)
  ) {
    throw new Error('trusted control plane must be installed outside the repository')
  }
  try {
    await lstat(targetBundleRoot)
    throw new Error('trusted control plane target already exists; choose a new versioned directory')
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  const temporaryBundleRoot = `${targetBundleRoot}.tmp-${process.pid}-${randomBytes(4).toString('hex')}`
  const targetLoopRoot = path.join(temporaryBundleRoot, 'issue-dev-loop')
  let cleanupBundleRoot = temporaryBundleRoot
  try {
    await mkdir(targetLoopRoot, { recursive: true })
    await cp(path.join(sourceLoopRoot, 'scripts'), path.join(targetLoopRoot, 'scripts'), {
      recursive: true,
      force: false,
      errorOnExist: true,
    })
    await mkdir(path.join(targetLoopRoot, 'triggers'), { recursive: true })
    await cp(
      path.join(sourceLoopRoot, 'triggers', 'detect-work.mjs'),
      path.join(targetLoopRoot, 'triggers', 'detect-work.mjs'),
    )
    const channelTarget = path.join(temporaryBundleRoot, '_shared', 'owner-channel', 'channel.json')
    await mkdir(path.dirname(channelTarget), { recursive: true })
    await cp(
      path.resolve(sourceLoopRoot, '..', '_shared', 'owner-channel', 'channel.json'),
      channelTarget,
    )
    const [gitExecutable, ghExecutable] = await Promise.all([
      resolveExecutable('git'),
      resolveExecutable('gh'),
    ])
    const [sourceCommitResult, sourceBranchResult, mergedDevResult, worktreeStatusResult] =
      await Promise.all([
        execFileAsync(gitExecutable, ['rev-parse', 'HEAD'], { cwd: repositoryRoot }),
        execFileAsync(gitExecutable, ['branch', '--show-current'], { cwd: repositoryRoot }),
        execFileAsync(gitExecutable, ['rev-parse', 'refs/remotes/origin/dev'], {
          cwd: repositoryRoot,
        }),
        execFileAsync(gitExecutable, ['status', '--porcelain'], { cwd: repositoryRoot }),
      ])
    if (
      sourceBranchResult.stdout.trim() !== 'dev' ||
      sourceCommitResult.stdout.trim() !== mergedDevResult.stdout.trim() ||
      worktreeStatusResult.stdout.trim()
    ) {
      throw new Error(
        'trusted control plane installation requires a clean dev checkout at owner-merged origin/dev',
      )
    }
    const installedNode = await realpath(process.execPath)
    const executableDigests = {
      node: createHash('sha256').update(await readFile(installedNode)).digest('hex'),
      git: createHash('sha256').update(await readFile(gitExecutable)).digest('hex'),
      gh: createHash('sha256').update(await readFile(ghExecutable)).digest('hex'),
    }
    const installedLauncher = path.join(targetLoopRoot, 'scripts', 'with-github-identity')
    await writeFile(
      installedLauncher,
      [
        '#!/bin/sh',
        '',
        'unset NODE_OPTIONS',
        'unset NODE_PATH',
        '',
        `exec ${shellQuote(installedNode)} ${shellQuote(
          path.join(targetBundleRoot, 'issue-dev-loop', 'scripts', 'with-github-identity.mjs'),
        )} "$@"`,
        '',
      ].join('\n'),
      { encoding: 'utf8', mode: 0o555 },
    )
    const installedFiles = (await regularFiles(temporaryBundleRoot)).filter(
      (target) => path.basename(target) !== 'trusted-control-plane.json',
    )
    const files = []
    for (const target of installedFiles.sort()) {
      files.push({
        path: path.relative(temporaryBundleRoot, target),
        sha256: createHash('sha256')
          .update(await readFile(target))
          .digest('hex'),
      })
    }
    const manifest = {
      schemaVersion: 1,
      sourceRepository: 'codeacme17/echo-ui',
      sourceCommit: sourceCommitResult.stdout.trim(),
      installedAt: new Date().toISOString(),
      bundleRoot: targetBundleRoot,
      controlPlaneRoot: path.join(targetBundleRoot, 'issue-dev-loop'),
      executables: {
        node: installedNode,
        git: await realpath(gitExecutable),
        gh: await realpath(ghExecutable),
      },
      executableDigests,
      files,
    }
    await writeFile(
      path.join(targetLoopRoot, 'trusted-control-plane.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
      'utf8',
    )
    for (const target of installedFiles) {
      await chmod(
        target,
        target === installedLauncher || target.includes('/identity-bin/') ? 0o555 : 0o444,
      )
    }
    await chmod(path.join(targetLoopRoot, 'trusted-control-plane.json'), 0o444)
    for (const directory of (await directories(temporaryBundleRoot)).reverse()) {
      if (directory !== temporaryBundleRoot) await chmod(directory, 0o555)
    }
    await rename(temporaryBundleRoot, targetBundleRoot)
    cleanupBundleRoot = targetBundleRoot
    await chmod(targetBundleRoot, 0o555)
    process.stdout.write(
      `${JSON.stringify({
        bundleRoot: targetBundleRoot,
        controlPlaneRoot: path.join(targetBundleRoot, 'issue-dev-loop'),
        sourceCommit: manifest.sourceCommit,
      })}\n`,
    )
  } catch (error) {
    try {
      for (const directory of await directories(cleanupBundleRoot)) {
        await chmod(directory, 0o755)
      }
    } catch {
      // Best-effort permission restoration for an interrupted install.
    }
    await rm(cleanupBundleRoot, { recursive: true, force: true })
    throw error
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
