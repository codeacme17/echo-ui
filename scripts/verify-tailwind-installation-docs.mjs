import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { releaseMatrix } from './release-matrix.mjs'

const repositoryRoot = resolve(import.meta.dirname, '..')
const guides = [
  {
    locale: 'English',
    path: resolve(repositoryRoot, 'docs/content/en/guide/installation.mdx'),
    migrationHeading: '## Migrate from Tailwind CSS 3 to 4',
  },
  {
    locale: 'Chinese',
    path: resolve(repositoryRoot, 'docs/content/zh/guide/installation.mdx'),
    migrationHeading: '## 从 Tailwind CSS 3 迁移到 4',
  },
]

const requiredVersionRows = [
  [
    '`1.1.x`',
    `\`${releaseMatrix.tailwind.tested.tailwind4.replace(/\.\d+$/, '.x')}\``,
    '`3.2.x`',
    '`3.6.x`',
  ],
  [
    '`1.1.x`',
    `\`${releaseMatrix.tailwind.tested.tailwind3.replace(/\.\d+$/, '.x')}\``,
    '`3.2.x`',
    '`3.6.x`',
  ],
  ['`1.0.0`', '`3.3.5`', '`0.1.x`', '`2.x`'],
]

for (const guide of guides) {
  const source = await readFile(guide.path, 'utf8')

  assert.match(source, /Tailwind CSS 4/, `${guide.locale} guide must recommend Tailwind 4`)
  assert.match(source, /Tailwind CSS 3/, `${guide.locale} guide must document Tailwind 3`)
  for (const version of Object.values(releaseMatrix.tailwind.tested)) {
    assert.ok(
      source.includes(version),
      `${guide.locale} guide must claim tested Tailwind ${version}`,
    )
  }
  assert.match(source, /@tailwindcss\/vite/, `${guide.locale} guide must configure the Vite plugin`)
  assert.match(
    source,
    /@import ['"]tailwindcss['"];/,
    `${guide.locale} guide must import Tailwind 4`,
  )
  assert.match(
    source,
    /@import ['"]@nafr\/echo-ui\/theme\.css['"];/,
    `${guide.locale} guide must import Echo UI's published theme`,
  )
  assert.match(
    source,
    /@source ['"]\.\.\/node_modules\/@nafr\/echo-ui\/dist['"];/,
    `${guide.locale} guide must scan the published distribution with Tailwind 4`,
  )
  assert.match(
    source,
    /\.\/node_modules\/@nafr\/echo-ui\/dist\/\*\*\/\*\.\{js,cjs\}/,
    `${guide.locale} guide must scan the published distribution with Tailwind 3`,
  )
  assert.match(source, /@tailwind base;/, `${guide.locale} guide must show Tailwind 3 layers`)
  assert.match(
    source,
    /darkMode: \['class'\]/,
    `${guide.locale} guide must configure class dark mode`,
  )
  assert.match(
    source,
    /import \{ theme \} from ['"]@nafr\/echo-ui\/tailwind-theme['"]/,
    `${guide.locale} guide must use Echo UI's published Tailwind 3 theme`,
  )
  assert.ok(
    source.includes(guide.migrationHeading),
    `${guide.locale} guide must include migration help`,
  )
  assert.match(source, /shadow-sm/, `${guide.locale} migration help must cover shadow semantics`)
  assert.match(
    source,
    /outline-none/,
    `${guide.locale} migration help must cover outline semantics`,
  )
  assert.match(
    source,
    /transition/,
    `${guide.locale} migration help must cover transition semantics`,
  )

  for (const row of requiredVersionRows) {
    assert.ok(
      row.every((cell) => source.includes(cell)),
      `${guide.locale} compatibility table must include ${row.join(', ')}`,
    )
  }
}

console.log('Bilingual Tailwind installation and compatibility contracts are documented.')
