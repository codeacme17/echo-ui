import assert from 'node:assert/strict'
import { access, readFile, readdir, stat } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { hookNames } from '../docs/hook-manifest.mjs'
import { legacyRedirects, publicAssets, publicRoutes } from '../docs/route-manifest.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const nextraRoot = resolve(repositoryRoot, 'docs')
const outputRoot = resolve(nextraRoot, 'out')
const basePath = process.env.DOCS_BASE_PATH ?? ''
const manifest = JSON.parse(await readFile(resolve(nextraRoot, 'package.json'), 'utf8'))
const hosting = JSON.parse(await readFile(resolve(repositoryRoot, 'vercel.json'), 'utf8'))

assert.ok(!basePath || (basePath.startsWith('/') && !basePath.endsWith('/')))

const withBasePath = (path) => `${basePath}${path}`
const siteOrigin = 'https://echoui.dev'

const outputFileForUrl = (url) => {
  const expectedPrefix = basePath ? `${basePath}/` : '/'

  assert.ok(
    url.pathname === basePath || url.pathname.startsWith(expectedPrefix),
    `${url.pathname} should stay within the configured base path`,
  )

  const exportedPath = decodeURIComponent(url.pathname.slice(basePath.length)).replace(/^\/+/, '')

  if (!exportedPath) return resolve(outputRoot, 'index.html')
  if (exportedPath.endsWith('/')) return resolve(outputRoot, exportedPath, 'index.html')
  if (extname(exportedPath)) return resolve(outputRoot, exportedPath)

  return resolve(outputRoot, exportedPath, 'index.html')
}

const assertInternalLinksResolve = async (html, pageRoute) => {
  const pageUrl = new URL(withBasePath(pageRoute), siteOrigin)

  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&')
    const targetUrl = new URL(href, pageUrl)

    if (targetUrl.origin !== siteOrigin) continue

    await assert.doesNotReject(
      access(outputFileForUrl(targetUrl)),
      `${pageRoute} should link to an exported page: ${href}`,
    )
  }
}

assert.equal(manifest.name, '@nafr/echo-ui-docs')
assert.equal(manifest.dependencies['@nafr/echo-ui'], 'workspace:*')
assert.equal(manifest.dependencies['@vercel/analytics'], '^1.6.1')
assert.equal(manifest.scripts.dev, 'next dev --port 1801')
assert.equal(manifest.scripts.build, 'next build --webpack')
assert.equal(
  manifest.scripts.postbuild,
  'pagefind --site out --output-path out/_pagefind && node ../scripts/create-docs-redirects.mjs',
)
assert.deepEqual(hosting, {
  buildCommand: 'pnpm build:docs',
  git: {
    deploymentEnabled: {
      '*': false,
      dev: true,
      main: true,
    },
  },
  installCommand: 'pnpm install --frozen-lockfile',
  outputDirectory: 'docs/out',
})

for (const route of publicRoutes) {
  await access(outputFileForUrl(new URL(withBasePath(route), siteOrigin)))
}

for (const { source, target } of legacyRedirects) {
  const redirectPage = await readFile(resolve(outputRoot, source.slice(1)), 'utf8')
  assert.ok(
    redirectPage.includes(`url=${withBasePath(target)}`),
    `${source} should redirect to ${withBasePath(target)}`,
  )
  assert.ok(
    redirectPage.includes(`href="${siteOrigin}${withBasePath(target)}"`),
    `${source} should expose its canonical destination`,
  )
}

for (const asset of publicAssets) {
  assert.ok(
    (await stat(resolve(outputRoot, asset.slice(1)))).size > 0,
    `${asset} should be exported`,
  )
}

await access(resolve(outputRoot, '_pagefind', 'pagefind.js'))

const notFoundPage = await readFile(resolve(outputRoot, '404.html'), 'utf8')
assert.ok(notFoundPage.includes('This page could not be found.'))

const landingPage = await readFile(resolve(outputRoot, 'index.html'), 'utf8')

assert.ok(landingPage.includes(`url=${withBasePath('/en/')}`))
assert.ok(landingPage.includes(`location.replace("${withBasePath('/en/')}")`))
assert.ok(landingPage.includes(`href="${siteOrigin}${withBasePath('/en/')}"`))
assert.ok(!landingPage.includes('Choose your documentation language'))
await assertInternalLinksResolve(landingPage, '/')

const pages = [
  {
    file: 'index.html',
    route: '',
    en: {
      description: 'Build expressive Web Audio interfaces with accessible React components.',
      heading: 'A UI library born for WAA',
    },
    zh: {
      description: '使用无障碍 React 组件构建富有表现力的 Web Audio 界面。',
      heading: '一款为 WAA 而生的 UI 组件库',
    },
  },
  {
    file: join('guide', 'introduction', 'index.html'),
    route: '/guide/introduction',
    en: {
      description: 'Learn why Echo UI exists and what it offers Web Audio developers.',
      heading: 'Introduction',
      toc: 'Why Echo UI?',
    },
    zh: {
      description: '了解 Echo UI 的设计目标以及它为 Web Audio 开发者提供的能力。',
      heading: '介绍',
      toc: '为什么使用 Echo UI？',
    },
  },
  {
    file: join('guide', 'installation', 'index.html'),
    route: '/guide/installation',
    en: {
      description: 'Install the current Echo UI release and configure its verified requirements.',
      heading: 'Installation',
      toc: 'Check requirements and compatibility',
    },
    zh: {
      description: '安装当前的 Echo UI 发行版并配置已验证的使用要求。',
      heading: '安装',
      toc: '检查要求与兼容性',
    },
  },
  {
    file: join('guide', 'declaration', 'index.html'),
    route: '/guide/declaration',
    en: {
      description: 'Understand the intended scope of Echo UI components, hooks, and documentation.',
      heading: 'Declaration',
      toc: 'About the components',
    },
    zh: {
      description: '了解 Echo UI 组件、Hook 和文档的设计边界。',
      heading: '声明',
      toc: '关于组件',
    },
  },
  {
    file: join('guide', 'about', 'index.html'),
    route: '/guide/about',
    en: {
      description: 'Meet the creator of Echo UI and find the project community channels.',
      heading: 'About',
      toc: 'Get in touch',
    },
    zh: {
      description: '了解 Echo UI 的创作者以及项目的社区联系方式。',
      heading: '关于',
      toc: '联系方式',
    },
  },
]

const locales = {
  en: {
    counterpart: 'zh',
    componentLabel: 'Component',
    footer: 'Released under the MIT License.',
    guideLabel: 'Guide',
    hookLabel: 'Hook',
    tocLabel: 'On this page',
  },
  zh: {
    counterpart: 'en',
    componentLabel: '组件',
    footer: '基于 MIT 许可证发布。',
    guideLabel: '指南',
    hookLabel: 'Hook',
    tocLabel: '本页目录',
  },
}

const controllers = ['button', 'checkbox', 'envelope', 'input', 'knob', 'radio', 'slider', 'switch']
const displays = ['lfo', 'light', 'oscilloscope', 'spectrogram', 'vumeter', 'waveform', 'card']
const hooks = hookNames
const variantCounts = {
  button: 6,
  card: 3,
  checkbox: 5,
  envelope: 3,
  input: 9,
  knob: 9,
  lfo: 2,
  light: 4,
  oscilloscope: 1,
  radio: 5,
  slider: 8,
  spectrogram: 4,
  switch: 5,
  vumeter: 6,
  waveform: 1,
}

for (const page of pages) {
  for (const [locale, labels] of Object.entries(locales)) {
    const html = await readFile(resolve(outputRoot, locale, page.file), 'utf8')
    const expected = page[locale]
    const localizedRoute = `/${locale}${page.route}/`
    assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`))
    assert.ok(html.includes(expected.heading), `${localizedRoute} should include its heading`)
    assert.ok(html.includes(expected.description), `${localizedRoute} should include page metadata`)
    assert.ok(
      html.includes(`href="${withBasePath(`/${locale}/`)}"`),
      `${localizedRoute} should link to localized home`,
    )
    assert.ok(
      html.includes(`href="${withBasePath(`/${locale}/guide/introduction/`)}"`),
      `${localizedRoute} should expose localized guide navigation`,
    )
    assert.ok(html.includes(labels.guideLabel), `${localizedRoute} should label guide navigation`)
    assert.ok(html.includes('title="Change theme"'), `${localizedRoute} should switch themes`)
    assert.ok(html.includes('title="Change language"'), `${localizedRoute} should switch locales`)
    await access(resolve(outputRoot, labels.counterpart, page.file))
    assert.ok(html.includes(labels.footer), `${localizedRoute} should include a localized footer`)
    if (!page.route) {
      assert.ok(
        html.includes(`src="${withBasePath('/logo.png')}"`),
        `${localizedRoute} should load its logo from the configured base path`,
      )
    }
    await assertInternalLinksResolve(html, localizedRoute)

    if (page.route) {
      assert.ok(
        html.includes('github.com/codeacme17/echo-ui/tree/main/docs'),
        `${localizedRoute} should expose its edit-page control`,
      )
      assert.match(
        html,
        /<a\b[^>]+x:max-w-\[50%\]/,
        `${localizedRoute} should expose previous/next navigation`,
      )
      assert.ok(
        html.includes(labels.tocLabel),
        `${localizedRoute} should label its table of contents`,
      )
      assert.ok(
        html.includes(expected.toc),
        `${localizedRoute} should expose page headings in its TOC`,
      )
    }

    for (const assetPath of html.matchAll(/(?:href|src)="([^"?]*\/_next\/[^"?]+)(?:\?[^"?]*)?"/g)) {
      assert.ok(assetPath[1].startsWith(`${basePath}/_next/`))
      await access(resolve(outputRoot, decodeURIComponent(assetPath[1].slice(basePath.length + 1))))
    }
  }
}

for (const locale of Object.keys(locales)) {
  const installationPage = await readFile(
    resolve(outputRoot, locale, 'guide', 'installation', 'index.html'),
    'utf8',
  )

  assert.ok(installationPage.includes('@nafr/echo-ui@^1.1.0'))
  assert.ok(installationPage.includes('1.0.0'))
  assert.ok(installationPage.includes('React'))
  assert.ok(installationPage.includes('18.2'))
  assert.ok(installationPage.includes('19'))
  assert.ok(installationPage.includes('Tailwind CSS 4'))
  assert.ok(installationPage.includes('Tailwind CSS 3'))
}

const verifyComponentRoute = async ({ component, kind, labels, locale, navigationAnchor }) => {
  const html = await readFile(
    resolve(outputRoot, locale, 'component', component, 'index.html'),
    'utf8',
  )
  const localizedRoute = `/${locale}/component/${component}/`
  assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`))
  assert.ok(
    html.includes(`data-${kind}-demo="${component}"`),
    `${localizedRoute} should render its live local-package demo`,
  )
  assert.ok(
    html.includes(`data-${kind}-api="${component}"`),
    `${localizedRoute} should render its public API reference`,
  )
  assert.ok(
    html.includes(`data-component-variant-matrix="${component}"`),
    `${localizedRoute} should render its complete Island variant matrix`,
  )
  assert.equal(
    [...html.matchAll(/\bdata-example-label=/g)].length,
    variantCounts[component],
    `${localizedRoute} should render every maintained Island example`,
  )
  assert.ok(html.includes('id="import"'), `${localizedRoute} should include its import section`)
  assert.ok(
    html.includes(`href="${withBasePath(localizedRoute)}"`),
    `${localizedRoute} navigation should expose the localized route`,
  )
  assert.ok(
    html.includes(`href="${withBasePath(`/${locale}/component/${navigationAnchor}/`)}"`),
    `${localizedRoute} should expose localized component navigation`,
  )
  assert.ok(
    html.includes(labels.componentLabel),
    `${localizedRoute} should label component navigation`,
  )
  assert.ok(html.includes('title="Change theme"'), `${localizedRoute} should switch themes`)
  assert.ok(html.includes('title="Change language"'), `${localizedRoute} should switch locales`)
  assert.ok(html.includes(labels.tocLabel), `${localizedRoute} should label its table of contents`)
  assert.ok(html.includes(labels.footer), `${localizedRoute} should include a localized footer`)
  assert.ok(
    html.includes('github.com/codeacme17/echo-ui/tree/main/docs'),
    `${localizedRoute} should expose its edit-page control`,
  )
  assert.match(
    html,
    /<a\b[^>]+x:max-w-\[50%\]/,
    `${localizedRoute} should expose previous/next navigation`,
  )
  await access(resolve(outputRoot, labels.counterpart, 'component', component, 'index.html'))
  await assertInternalLinksResolve(html, localizedRoute)

  for (const assetPath of html.matchAll(/(?:href|src)="([^"?]*\/_next\/[^"?]+)(?:\?[^"?]*)?"/g)) {
    assert.ok(assetPath[1].startsWith(`${basePath}/_next/`))
    await access(resolve(outputRoot, decodeURIComponent(assetPath[1].slice(basePath.length + 1))))
  }
}

for (const [locale, labels] of Object.entries(locales)) {
  for (const controller of controllers) {
    await verifyComponentRoute({
      component: controller,
      kind: 'controller',
      labels,
      locale,
      navigationAnchor: 'button',
    })
  }

  for (const display of displays) {
    await verifyComponentRoute({
      component: display,
      kind: 'display',
      labels,
      locale,
      navigationAnchor: 'lfo',
    })
  }
}

const verifyHookRoute = async ({ hook, labels, locale }) => {
  const html = await readFile(resolve(outputRoot, locale, 'hook', hook, 'index.html'), 'utf8')
  const localizedRoute = `/${locale}/hook/${hook}/`

  assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`))
  assert.ok(html.includes(`<h1`), `${localizedRoute} should include its heading`)
  assert.ok(
    html.includes(`data-hook-api="${hook}"`),
    `${localizedRoute} should render its public Hook contract`,
  )
  for (const sectionId of ['parameters', 'return-value', 'lifecycle', 'errors']) {
    assert.ok(html.includes(`id="${sectionId}"`), `${localizedRoute} should document ${sectionId}`)
  }
  assert.ok(
    html.includes(`packages/hooks/${hook}.ts`),
    `${localizedRoute} should link to the Hook source`,
  )
  assert.ok(
    html.includes(`href="${withBasePath(localizedRoute)}"`),
    `${localizedRoute} navigation should expose the localized Hook route`,
  )
  assert.ok(html.includes(labels.hookLabel), `${localizedRoute} should label Hook navigation`)
  assert.ok(html.includes('title="Change theme"'), `${localizedRoute} should switch themes`)
  assert.ok(html.includes('title="Change language"'), `${localizedRoute} should switch locales`)
  assert.ok(html.includes(labels.tocLabel), `${localizedRoute} should label its table of contents`)
  assert.ok(html.includes(labels.footer), `${localizedRoute} should include a localized footer`)
  await access(resolve(outputRoot, labels.counterpart, 'hook', hook, 'index.html'))
  await assertInternalLinksResolve(html, localizedRoute)
}

for (const [locale, labels] of Object.entries(locales)) {
  for (const hook of hooks) await verifyHookRoute({ hook, labels, locale })
}

for (const sourceRoot of [resolve(nextraRoot, 'app'), resolve(nextraRoot, 'content')]) {
  const sourceFiles = (await readdir(sourceRoot, { recursive: true }))
    .filter((file) => /\.(?:mdx|ts|tsx)$/.test(file))
    .map((file) => resolve(sourceRoot, file))
  const source = (await Promise.all(sourceFiles.map((file) => readFile(file, 'utf8')))).join('\n')

  assert.ok(!source.includes('@nextui-org'), 'Nextra documentation UI should not depend on NextUI')
}

const outputFiles = await readdir(outputRoot, { recursive: true })
const cssFiles = outputFiles.filter((file) => file.endsWith('.css'))
const javascriptFiles = outputFiles.filter((file) => file.endsWith('.js'))
const css = (
  await Promise.all(cssFiles.map((file) => readFile(resolve(outputRoot, file), 'utf8')))
).join('\n')
const javascript = (
  await Promise.all(javascriptFiles.map((file) => readFile(resolve(outputRoot, file), 'utf8')))
).join('\n')

assert.ok(css.includes('--echo-primary'), 'static CSS should include Echo UI styles')
assert.ok(
  javascript.includes('/_vercel/insights/script.js'),
  'static JavaScript should retain the Vercel Analytics loader',
)

console.log(
  'Nextra static output exposes bilingual guides, components, Hooks, API references, and live Echo UI demos.',
)
