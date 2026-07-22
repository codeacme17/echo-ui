import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const repositoryRoot = resolve(import.meta.dirname, '..')

describe('release verification', () => {
  it('certifies the supported modernization matrix and release notes', () => {
    const output = execFileSync(process.execPath, ['scripts/verify-release-contract.mjs'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
    })

    expect(output).toMatch('Echo UI 1.1.0 release contract is verified.')
  })
})
