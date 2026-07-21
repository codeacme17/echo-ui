import { execFileSync } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type PackageManifest = {
  files: string[]
  main: string
  module: string
  types: string
}

describe('published package', () => {
  it('keeps the current runtime and declaration entrypoints available', async () => {
    const packageRoot = resolve(import.meta.dirname, '..')
    const manifest = JSON.parse(
      await readFile(resolve(packageRoot, 'package.json'), 'utf8'),
    ) as PackageManifest
    const expectedEntries = {
      main: 'dist/echo-ui.umd.cjs',
      module: 'dist/packages/main.js',
      types: 'dist/types/packages/main.d.ts',
    }

    expect({
      entries: {
        main: manifest.main,
        module: manifest.module,
        types: manifest.types,
      },
      files: manifest.files,
    }).toEqual({ entries: expectedEntries, files: ['dist'] })

    await Promise.all(
      Object.values(expectedEntries).map((entry) => access(resolve(packageRoot, entry))),
    )
  })

  it('loads representative CommonJS exports in Node', () => {
    const packageRoot = resolve(import.meta.dirname, '..')
    const output = execFileSync(
      process.execPath,
      [
        '-e',
        "const echoUi = require('./'); setImmediate(() => console.log(JSON.stringify({ Button: typeof echoUi.Button, useFetchAudio: typeof echoUi.useFetchAudio })))",
      ],
      { cwd: packageRoot, encoding: 'utf8' },
    )
    const exportedTypes = JSON.parse(output.trim().split('\n').at(-1)!)

    expect(exportedTypes).toEqual({ Button: 'object', useFetchAudio: 'function' })
  })
})
