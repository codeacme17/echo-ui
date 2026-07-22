import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type Manifest = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  scripts: Record<string, string>
}

const repositoryRoot = resolve(import.meta.dirname, '..')

const readManifest = async (path: string) =>
  JSON.parse(await readFile(resolve(repositoryRoot, path), 'utf8')) as Manifest

describe('production documentation cutover', () => {
  it('uses Nextra as the only documentation toolchain in normal installs and builds', async () => {
    const [
      manifest,
      exampleManifest,
      docsManifest,
      workspace,
      rootTailwind,
      exampleTailwind,
      readme,
    ] = await Promise.all([
      readManifest('package.json'),
      readManifest('example/package.json'),
      readManifest('docs-nextra/package.json'),
      readFile(resolve(repositoryRoot, 'pnpm-workspace.yaml'), 'utf8'),
      readFile(resolve(repositoryRoot, 'tailwind.config.js'), 'utf8'),
      readFile(resolve(repositoryRoot, 'example/tailwind.config.js'), 'utf8'),
      readFile(resolve(repositoryRoot, 'README.md'), 'utf8'),
    ])
    const trackedLegacyDocs = execFileSync('git', ['ls-files', 'docs'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
    }).trim()
    const dependencies = {
      ...manifest.dependencies,
      ...manifest.devDependencies,
    }

    expect(manifest.scripts).toMatchObject({
      'build:docs': 'pnpm --filter @nafr/echo-ui-docs-nextra build',
      'dev:docs': 'pnpm --filter @nafr/echo-ui-docs-nextra dev',
      'preview:docs': 'node scripts/serve-docs.mjs',
      'test:docs':
        'node scripts/verify-nextra-output.mjs && node scripts/smoke-nextra-routes.mjs && node scripts/verify-docs-ui.mjs',
      'typecheck:docs': 'pnpm --filter @nafr/echo-ui-docs-nextra typecheck',
      'verify:frozen': 'pnpm install --frozen-lockfile && pnpm verify',
    })
    expect(
      Object.keys(manifest.scripts).filter((script) => script.includes('docs:nextra')),
    ).toEqual([])
    expect(manifest.scripts.verify).toContain('pnpm build:docs')
    expect(manifest.scripts.verify).toContain('pnpm test:docs')
    expect(manifest.scripts.verify).not.toMatch(/island|docs:nextra/i)

    for (const dependency of [
      '@nextui-org/react',
      '@nextui-org/theme',
      '@vercel/analytics',
      'framer-motion',
      'islandjs',
      'lucide-react',
      'prism-react-renderer',
      'react-live',
    ]) {
      expect(dependencies).not.toHaveProperty(dependency)
    }
    expect(docsManifest.dependencies).toHaveProperty('@vercel/analytics')
    expect(exampleManifest.devDependencies).not.toHaveProperty('@nextui-org/theme')

    expect(workspace).not.toMatch(/-\s*['"]docs['"]/)
    expect(workspace).toContain("- 'docs-nextra'")
    expect(rootTailwind).not.toMatch(/nextui|react-live|\.\/docs\//i)
    expect(exampleTailwind).not.toMatch(/nextui/i)
    expect(readme).toContain('pnpm dev:docs')
    expect(readme).toContain('pnpm test:docs')
    expect(readme).not.toMatch(/docs:nextra|IslandJS/i)
    expect(trackedLegacyDocs).toBe('')

    expect(
      execFileSync('git', ['ls-files', 'scripts/verify-island-style-parity.mjs'], {
        cwd: repositoryRoot,
        encoding: 'utf8',
      }).trim(),
    ).toBe('')
  })
})
