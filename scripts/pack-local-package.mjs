import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

export const packLocalPackage = async (packageRoot, destination) => {
  execFileSync('pnpm', ['pack', '--pack-destination', destination], {
    cwd: packageRoot,
    stdio: 'pipe',
  })

  const archiveName = (await readdir(destination)).find((entry) => entry.endsWith('.tgz'))
  assert.ok(archiveName, 'pnpm pack did not create a package archive')
  return join(destination, archiveName)
}
