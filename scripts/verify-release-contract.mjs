import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { loadConfigFromFile } from 'vite'
import { releaseMatrix } from './release-matrix.mjs'

const repositoryRoot = resolve(import.meta.dirname, '..')
const readJson = (path) => readFile(resolve(repositoryRoot, path), 'utf8').then(JSON.parse)

const [eslintConfig, manifest, docsManifest, exampleManifest, lockfile, notes, nvmrc, viteSource] =
  await Promise.all([
    readFile(resolve(repositoryRoot, 'eslint.config.js'), 'utf8'),
    readJson('package.json'),
    readJson('docs/package.json'),
    readJson('example/package.json'),
    readFile(resolve(repositoryRoot, 'pnpm-lock.yaml'), 'utf8'),
    readFile(resolve(repositoryRoot, 'RELEASE_NOTES.md'), 'utf8'),
    readFile(resolve(repositoryRoot, '.nvmrc'), 'utf8').then((value) => value.trim()),
    readFile(resolve(repositoryRoot, 'vite.config.ts'), 'utf8'),
  ])

const loadedViteConfig = await loadConfigFromFile(
  { command: 'build', mode: 'production' },
  resolve(repositoryRoot, 'vite.config.ts'),
)
assert.ok(loadedViteConfig)
assert.deepEqual(loadedViteConfig.config.build.rolldownOptions.external, [
  'react',
  'react-dom',
  'tone',
])
assert.match(viteSource, /jsxRuntime: command === 'build' \? 'classic' : 'automatic'/)
assert.match(viteSource, /inject:\s*{\s*React: 'react'/)

assert.equal(Number(process.versions.node.split('.')[0]), releaseMatrix.nodeMajor)
assert.equal(
  execFileSync('pnpm', ['--version'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
  releaseMatrix.pnpm,
)
assert.equal(manifest.version, releaseMatrix.echoUi)
assert.equal(manifest.packageManager, `pnpm@${releaseMatrix.pnpm}`)
assert.deepEqual(manifest.engines, { node: '>=24 <25', pnpm: '>=10 <11' })
assert.equal(nvmrc, String(releaseMatrix.nodeMajor))
assert.equal(manifest.peerDependencies.react, releaseMatrix.react.peerRange)
assert.equal(manifest.peerDependencies['react-dom'], releaseMatrix.react.peerRange)
assert.equal(manifest.dependencies.tone, releaseMatrix.tone.range)
assert.equal(manifest.devDependencies.react, releaseMatrix.react.workspace)
assert.equal(manifest.devDependencies['react-dom'], releaseMatrix.react.workspace)
assert.equal(manifest.devDependencies.tailwindcss, releaseMatrix.tailwind.workspace)
assert.equal(docsManifest.dependencies.next, releaseMatrix.next)
assert.equal(docsManifest.dependencies.nextra, releaseMatrix.nextra)
assert.equal(docsManifest.dependencies['nextra-theme-docs'], releaseMatrix.nextra)
assert.equal(docsManifest.dependencies.react, releaseMatrix.react.workspace)
assert.equal(exampleManifest.dependencies.react, releaseMatrix.react.workspace)
assert.equal(exampleManifest.dependencies.tone, releaseMatrix.tone.range)
assert.equal(exampleManifest.devDependencies.tailwindcss, releaseMatrix.tailwind.workspace)
assert.ok(!eslintConfig.includes('docs/.island'), 'ESLint still ignores removed IslandJS output')
assert.match(manifest.scripts.verify, /pnpm lint/)
assert.match(manifest.scripts.verify, /verify-package-artifact/)
assert.equal(manifest.scripts['verify:frozen'], 'pnpm install --frozen-lockfile && pnpm verify')

const deprecatedPackages = ['@nextui-org/react', '@nextui-org/theme', 'islandjs']
const manifests = [manifest, docsManifest, exampleManifest]
for (const packageName of deprecatedPackages) {
  for (const workspaceManifest of manifests) {
    assert.ok(!workspaceManifest.dependencies?.[packageName], `${packageName} remains a dependency`)
    assert.ok(
      !workspaceManifest.devDependencies?.[packageName],
      `${packageName} remains a development dependency`,
    )
  }
  assert.ok(!lockfile.includes(`${packageName}@`), `${packageName} remains in the lockfile`)
}

const trackedFiles = execFileSync('git', ['ls-files'], {
  cwd: repositoryRoot,
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter(Boolean)
assert.deepEqual(
  trackedFiles.filter((path) => /(^|\/)(?:node_modules|dist|out|\.next)(?:\/|$)/.test(path)),
  [],
  'Generated dependency, library, or documentation output must not be tracked',
)
assert.ok(!trackedFiles.some((path) => path.startsWith('docs/.island/')))
assert.ok(!trackedFiles.includes('scripts/verify-island-style-parity.mjs'))

const dependencyTrees = JSON.parse(
  execFileSync(
    'pnpm',
    [
      '--recursive',
      'list',
      'react',
      'react-dom',
      'tone',
      'tailwindcss',
      '--depth',
      'Infinity',
      '--json',
    ],
    { cwd: repositoryRoot, encoding: 'utf8' },
  ),
)
const versions = new Map(
  ['react', 'react-dom', 'tone', 'tailwindcss'].map((name) => [name, new Set()]),
)
const visitDependencies = (node) => {
  for (const group of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    for (const [name, dependency] of Object.entries(node[group] ?? {})) {
      if (versions.has(name) && dependency.version && !dependency.version.startsWith('link:')) {
        versions.get(name).add(dependency.version)
      }
      visitDependencies(dependency)
    }
  }
}
for (const tree of dependencyTrees) visitDependencies(tree)
assert.deepEqual([...versions.get('react')], [releaseMatrix.react.workspace])
assert.deepEqual([...versions.get('react-dom')], [releaseMatrix.react.workspace])
assert.deepEqual([...versions.get('tone')], [releaseMatrix.tone.tested])
assert.deepEqual([...versions.get('tailwindcss')], [releaseMatrix.tailwind.workspace])

const requiredReleaseNotes = [
  '# Echo UI 1.1.0 release notes',
  'Node.js 24',
  'pnpm 10.22.0',
  'React 18.3.1',
  'React 19.2.8',
  'Tailwind CSS 3.4.19',
  'Tailwind CSS 4.3.3',
  'Nextra 4.6.0',
  'Tone.js 15.1.22',
  'legacy documentation redirects',
  '`main`/`module`/`types`/`style`',
  'externalized',
  'classic JSX runtime',
  '`React` injection',
  'pnpm verify:frozen',
]
for (const statement of requiredReleaseNotes) {
  assert.ok(notes.includes(statement), `Release notes must document: ${statement}`)
}

console.log(`Echo UI ${releaseMatrix.echoUi} release contract is verified.`)
