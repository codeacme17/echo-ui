import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import {
  chmod,
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const installerSource = path.resolve(
  testDirectory,
  '..',
  'scripts',
  'install-trusted-control-plane.mjs',
)

async function makeWritable(target) {
  let targetStat
  try {
    targetStat = await lstat(target)
  } catch (error) {
    if (error?.code === 'ENOENT') return
    throw error
  }
  if (!targetStat.isDirectory()) {
    await chmod(target, 0o644)
    return
  }
  await chmod(target, 0o755)
  for (const entry of await readdir(target)) {
    await makeWritable(path.join(target, entry))
  }
}

async function git(repositoryRoot, args) {
  return execFileAsync('git', args, { cwd: repositoryRoot })
}

test('installer atomically publishes a read-only trusted control plane', async (context) => {
  const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-control-plane-install-'))
  context.after(async () => {
    await makeWritable(fixtureRoot)
    await rm(fixtureRoot, { recursive: true, force: true })
  })

  const repositoryRoot = path.join(fixtureRoot, 'repository')
  const loopRoot = path.join(repositoryRoot, 'loops', 'issue-dev-loop')
  const installer = path.join(loopRoot, 'scripts', 'install-trusted-control-plane.mjs')
  const target = path.join(fixtureRoot, 'trusted-control-plane')
  const canonicalTarget = path.join(await realpath(fixtureRoot), 'trusted-control-plane')
  const executableRoot = path.join(fixtureRoot, 'bin')
  const fixtureGh = path.join(executableRoot, 'gh')
  await Promise.all([
    mkdir(path.dirname(installer), { recursive: true }),
    mkdir(path.join(loopRoot, 'triggers'), { recursive: true }),
    mkdir(path.join(repositoryRoot, 'loops', '_shared', 'owner-channel'), { recursive: true }),
    mkdir(executableRoot),
  ])
  await Promise.all([
    cp(installerSource, installer),
    writeFile(path.join(loopRoot, 'triggers', 'detect-work.mjs'), 'export {}\n', 'utf8'),
    writeFile(
      path.join(repositoryRoot, 'loops', '_shared', 'owner-channel', 'channel.json'),
      '{}\n',
      'utf8',
    ),
    writeFile(fixtureGh, '#!/bin/sh\nexit 0\n', { encoding: 'utf8', mode: 0o755 }),
  ])

  await git(repositoryRoot, ['init', '--initial-branch=dev'])
  await git(repositoryRoot, ['add', '.'])
  await git(repositoryRoot, [
    '-c',
    'user.name=Echo UI Test',
    '-c',
    'user.email=echo-ui-test@example.invalid',
    'commit',
    '-m',
    'fixture',
  ])
  const { stdout: sourceCommitOutput } = await git(repositoryRoot, ['rev-parse', 'HEAD'])
  const sourceCommit = sourceCommitOutput.trim()
  await git(repositoryRoot, ['update-ref', 'refs/remotes/origin/dev', sourceCommit])

  const { stdout } = await execFileAsync(process.execPath, [installer, '--target', target], {
    cwd: repositoryRoot,
    env: {
      ...process.env,
      PATH: `${executableRoot}${path.delimiter}${process.env.PATH ?? ''}`,
    },
  })

  const result = JSON.parse(stdout)
  assert.equal(result.bundleRoot, canonicalTarget)
  assert.equal(result.controlPlaneRoot, path.join(canonicalTarget, 'issue-dev-loop'))
  assert.equal(result.sourceCommit, sourceCommit)
  assert.equal((await stat(target)).mode & 0o777, 0o555)
  assert.equal((await stat(path.join(target, 'issue-dev-loop'))).mode & 0o777, 0o555)

  const manifest = JSON.parse(
    await readFile(
      path.join(target, 'issue-dev-loop', 'trusted-control-plane.json'),
      'utf8',
    ),
  )
  assert.equal(manifest.bundleRoot, canonicalTarget)
  assert.equal(manifest.sourceCommit, sourceCommit)
  assert.equal(manifest.executables.gh, await realpath(fixtureGh))
})
