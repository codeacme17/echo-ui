import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const nextraRoot = resolve(repositoryRoot, 'docs-nextra')
const outputRoot = resolve(nextraRoot, 'out')
const manifest = JSON.parse(await readFile(resolve(nextraRoot, 'package.json'), 'utf8'))

assert.equal(manifest.name, '@nafr/echo-ui-docs-nextra')
assert.equal(manifest.dependencies['@nafr/echo-ui'], 'workspace:*')
assert.equal(manifest.scripts.dev, 'next dev --port 1801')
assert.equal(manifest.scripts.build, 'next build')

const landingPage = await readFile(resolve(outputRoot, 'index.html'), 'utf8')

assert.ok(landingPage.includes('Choose your documentation language'))
assert.ok(landingPage.includes('href="/en/"'))
assert.ok(landingPage.includes('href="/zh/"'))

const routes = [
  {
    locale: 'en',
    counterpart: '/zh',
    buttonLabel: 'Echo UI preview button',
    description: 'Preview the Echo UI documentation migration on Nextra.',
    heading: 'Build expressive audio interfaces',
    navigationHref: '/en/',
  },
  {
    locale: 'zh',
    counterpart: '/en',
    buttonLabel: 'Echo UI 预览按钮',
    description: '在 Nextra 中预览 Echo UI 文档迁移。',
    heading: '构建富有表现力的音频界面',
    navigationHref: '/zh/',
  },
]

for (const route of routes) {
  const html = await readFile(resolve(outputRoot, route.locale, 'index.html'), 'utf8')

  assert.match(html, new RegExp(`<html[^>]+lang="${route.locale}"`))
  assert.ok(html.includes(route.heading), `${route.locale} output should include its heading`)
  assert.ok(html.includes(route.description), `${route.locale} output should include metadata`)
  assert.ok(html.includes(route.buttonLabel), `${route.locale} output should render Echo UI`)
  assert.ok(
    html.includes(`href="${route.navigationHref}"`),
    `${route.locale} navigation should keep readers in the localized docs route`,
  )
  assert.ok(html.includes('title="Change theme"'), `${route.locale} output should switch themes`)
  assert.ok(
    html.includes('title="Change language"'),
    `${route.locale} output should switch locales`,
  )
  assert.ok(
    html.includes(`href="${route.counterpart}`),
    `${route.locale} output should link to ${route.counterpart}`,
  )

  for (const assetPath of html.matchAll(/(?:href|src)="(\/_next\/[^"?]+)(?:\?[^"?]*)?"/g)) {
    await access(resolve(outputRoot, assetPath[1].slice(1)))
  }
}

const outputFiles = await readdir(outputRoot, { recursive: true })
const cssFiles = outputFiles.filter((file) => file.endsWith('.css'))
const css = (
  await Promise.all(cssFiles.map((file) => readFile(resolve(outputRoot, file), 'utf8')))
).join('\n')

assert.ok(css.includes('--echo-primary'), 'static CSS should include Echo UI styles')

console.log('Nextra static output exposes bilingual routes, navigation, metadata, and Echo UI.')
