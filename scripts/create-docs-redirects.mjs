import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import { legacyRedirects } from '../docs/route-manifest.mjs'

const repositoryRoot = resolve(import.meta.dirname, '..')
const outputRoot = resolve(repositoryRoot, 'docs', 'out')
const basePath = process.env.DOCS_BASE_PATH ?? ''
const siteOrigin = 'https://echoui.dev'

assert.ok(!basePath || (basePath.startsWith('/') && !basePath.endsWith('/')))

const redirects = [{ source: '/index.html', target: '/en/' }, ...legacyRedirects]

for (const { source, target } of redirects) {
  const outputFile = resolve(outputRoot, source.slice(1))
  assert.ok(outputFile.startsWith(`${outputRoot}${sep}`))

  const destination = `${basePath}${target}`
  const redirectPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0;url=${destination}">
    <link rel="canonical" href="${siteOrigin}${destination}">
    <title>Redirecting to Echo UI documentation</title>
    <script>location.replace(${JSON.stringify(destination)})</script>
  </head>
  <body>
    <p>This documentation page moved to <a href="${destination}">${destination}</a>.</p>
  </body>
</html>
`

  await mkdir(dirname(outputFile), { recursive: true })
  await writeFile(outputFile, redirectPage)
}

console.log(
  `Created the root redirect and ${legacyRedirects.length} legacy documentation redirects.`,
)
