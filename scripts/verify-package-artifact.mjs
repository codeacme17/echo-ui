import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { access, mkdtemp, mkdir, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { packLocalPackage } from './pack-local-package.mjs'
import { releaseMatrix } from './release-matrix.mjs'

const packageRoot = resolve(import.meta.dirname, '..')
const auditRoot = await mkdtemp(join(tmpdir(), 'echo-ui-package-audit-'))

const resolveTarget = (artifactRoot, target) => {
  const normalizedTarget = target.startsWith('./') ? target.slice(2) : target
  assert.match(normalizedTarget, /^dist\//, `Published target must stay in dist: ${target}`)
  return resolve(artifactRoot, normalizedTarget)
}

try {
  const archivePath = await packLocalPackage(packageRoot, auditRoot)
  const extractRoot = join(auditRoot, 'extracted')
  await mkdir(extractRoot)
  execFileSync('tar', ['-xzf', archivePath, '-C', extractRoot])

  const artifactRoot = join(extractRoot, 'package')
  const manifest = JSON.parse(await readFile(join(artifactRoot, 'package.json'), 'utf8'))
  const archiveEntries = execFileSync('tar', ['-tzf', archivePath], { encoding: 'utf8' })
    .trim()
    .split('\n')

  assert.equal(manifest.name, '@nafr/echo-ui')
  assert.equal(manifest.version, releaseMatrix.echoUi)
  assert.deepEqual(manifest.files, ['dist', 'RELEASE_NOTES.md'])
  assert.deepEqual(manifest.sideEffects, ['**/*.css'])
  assert.deepEqual(manifest.peerDependencies, {
    react: releaseMatrix.react.peerRange,
    'react-dom': releaseMatrix.react.peerRange,
  })
  assert.equal(manifest.dependencies.tone, releaseMatrix.tone.range)
  assert.deepEqual(
    Object.keys(manifest.dependencies).filter(
      (name) => manifest.devDependencies?.[name] || manifest.peerDependencies?.[name],
    ),
    [],
    'Runtime dependencies must not be duplicated in development or peer dependencies',
  )
  assert.deepEqual(Object.keys(manifest.dependencies).sort(), [
    'clsx',
    'd3',
    'tailwind-merge',
    'tailwind-variants',
    'tone',
  ])

  const publicTargets = [
    manifest.main,
    manifest.module,
    manifest.types,
    manifest.style,
    manifest.exports['.'].types,
    manifest.exports['.'].import,
    manifest.exports['.'].require,
    manifest.exports['./style.css'],
    manifest.exports['./theme.css'],
    manifest.exports['./tailwind-theme'].types,
    manifest.exports['./tailwind-theme'].import,
  ]
  await Promise.all(publicTargets.map((target) => access(resolveTarget(artifactRoot, target))))
  assert.equal(manifest.main, manifest.exports['.'].require.slice(2))
  assert.equal(manifest.module, manifest.exports['.'].import.slice(2))
  assert.equal(manifest.types, manifest.exports['.'].types.slice(2))
  assert.equal(manifest.style, manifest.exports['./style.css'].slice(2))

  const [declarations, esmBundle, libraryCss, readme, releaseNotes, themeCss, umdBundle] =
    await Promise.all([
      readFile(resolveTarget(artifactRoot, manifest.types), 'utf8'),
      readFile(resolveTarget(artifactRoot, manifest.module), 'utf8'),
      readFile(resolveTarget(artifactRoot, manifest.style), 'utf8'),
      readFile(join(artifactRoot, 'README.md'), 'utf8'),
      readFile(join(artifactRoot, 'RELEASE_NOTES.md'), 'utf8'),
      readFile(resolveTarget(artifactRoot, manifest.exports['./theme.css']), 'utf8'),
      readFile(resolveTarget(artifactRoot, manifest.main), 'utf8'),
    ])
  assert.match(declarations, /export \{ useFetchAudio, useOscilloscope, usePlayer/)
  assert.match(declarations, /UseVuMeterProps/)
  assert.match(esmBundle, /from ["']react["']/)
  assert.match(esmBundle, /from ["']tone["']/)
  assert.match(umdBundle, /require\(["']react["']\)/)
  assert.match(umdBundle, /require\(["']tone["']\)/)
  const esmExternals = [
    ...new Set(
      [...esmBundle.matchAll(/\bfrom ["']([^"']+)["']/g)]
        .map((match) => match[1])
        .filter((specifier) => !specifier.startsWith('.') && !specifier.startsWith('/')),
    ),
  ].sort()
  const umdExternals = [
    ...new Set([...umdBundle.matchAll(/\brequire\(["']([^"']+)["']\)/g)].map((match) => match[1])),
  ].sort()
  assert.deepEqual(esmExternals, ['react', 'tone'])
  assert.deepEqual(umdExternals, ['react', 'tone'])
  assert.doesNotMatch(esmBundle, /node_modules\/react/)
  assert.doesNotMatch(umdBundle, /node_modules\/react/)
  assert.match(libraryCss, /\.bg-button/)
  assert.match(themeCss, /--echo-primary:/)
  assert.match(readme, /\[MIT\]\(\.\/LICENSE\)/)
  assert.doesNotMatch(readme, /LICENSE\.md/)
  assert.match(releaseNotes, /# Echo UI 1\.1\.0 release notes/)
  assert.ok((await stat(archivePath)).size > 100_000)

  assert.ok(archiveEntries.includes('package/package.json'))
  assert.ok(archiveEntries.includes('package/README.md'))
  assert.ok(archiveEntries.includes('package/RELEASE_NOTES.md'))
  assert.ok(archiveEntries.includes('package/LICENSE'))
  assert.ok(archiveEntries.includes('package/dist/echo-ui.js'))
  assert.ok(archiveEntries.includes('package/dist/echo-ui.umd.cjs'))
  assert.ok(archiveEntries.includes('package/dist/echo-ui.css'))
  assert.ok(archiveEntries.includes('package/dist/theme.css'))
  assert.ok(archiveEntries.includes('package/dist/types/packages/main.d.ts'))
  assert.ok(
    archiveEntries.every(
      (entry) =>
        entry.startsWith('package/dist/') ||
        [
          'package/LICENSE',
          'package/README.md',
          'package/RELEASE_NOTES.md',
          'package/package.json',
        ].includes(entry),
    ),
    'The archive contains files outside the documented package surface',
  )
  assert.ok(!archiveEntries.some((entry) => /(?:node_modules|docs\/out|\.tsbuildinfo)/.test(entry)))

  console.log(`Packed Echo UI ${releaseMatrix.echoUi} artifact is verified.`)
} finally {
  await rm(auditRoot, { force: true, recursive: true })
}
