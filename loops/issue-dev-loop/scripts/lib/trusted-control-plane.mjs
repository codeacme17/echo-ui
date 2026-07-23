import { createHash } from 'node:crypto'
import { constants } from 'node:fs'
import { access, lstat, readFile, realpath } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))
const loopRoot = path.resolve(moduleDirectory, '..', '..')
const bundleRoot = path.dirname(loopRoot)

async function verifiedExecutable(target, name) {
  if (!path.isAbsolute(target ?? '')) {
    throw new Error(`trusted control plane ${name} executable must be absolute`)
  }
  await access(target, constants.X_OK)
  const resolved = await realpath(target)
  const stats = await lstat(resolved)
  if (!stats.isFile() || stats.isSymbolicLink()) {
    throw new Error(`trusted control plane ${name} executable must be a regular file`)
  }
  return resolved
}

export async function loadTrustedControlPlane() {
  const manifestPath = path.join(loopRoot, 'trusted-control-plane.json')
  let manifest
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(
        'GitHub identities require an installed trusted control plane; run install-trusted-control-plane.mjs from owner-merged dev',
      )
    }
    throw error
  }
  const manifestLoopRoot = path.resolve(manifest.controlPlaneRoot ?? '')
  const manifestBundleRoot = path.resolve(manifest.bundleRoot ?? '')
  const [installedLoopRoot, installedBundleRoot, declaredLoopRoot, declaredBundleRoot] =
    await Promise.all([
      realpath(loopRoot),
      realpath(bundleRoot),
      realpath(manifestLoopRoot).catch(() => null),
      realpath(manifestBundleRoot).catch(() => null),
    ])
  if (
    manifest.schemaVersion !== 1 ||
    declaredLoopRoot !== installedLoopRoot ||
    declaredBundleRoot !== installedBundleRoot ||
    !Array.isArray(manifest.files) ||
    manifest.files.length === 0
  ) {
    throw new Error('trusted control plane manifest does not match this installation')
  }
  for (const entry of manifest.files) {
    const relativePath = entry?.path
    const target = path.resolve(bundleRoot, relativePath ?? '')
    if (
      typeof relativePath !== 'string' ||
      path.isAbsolute(relativePath) ||
      !target.startsWith(`${bundleRoot}${path.sep}`) ||
      !/^[0-9a-f]{64}$/i.test(entry.sha256 ?? '')
    ) {
      throw new Error('trusted control plane manifest contains an unsafe file entry')
    }
    const stats = await lstat(target)
    if (!stats.isFile() || stats.isSymbolicLink()) {
      throw new Error(`trusted control plane file is not regular: ${relativePath}`)
    }
    const digest = createHash('sha256')
      .update(await readFile(target))
      .digest('hex')
    if (digest !== entry.sha256) {
      throw new Error(`trusted control plane integrity check failed: ${relativePath}`)
    }
  }
  return {
    bundleRoot: manifestBundleRoot,
    loopRoot: manifestLoopRoot,
    sourceCommit: manifest.sourceCommit,
    executables: {
      node: await verifiedExecutable(manifest.executables?.node, 'node'),
      git: await verifiedExecutable(manifest.executables?.git, 'git'),
      gh: await verifiedExecutable(manifest.executables?.gh, 'gh'),
    },
  }
}
