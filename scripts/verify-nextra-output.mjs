import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const nextraRoot = resolve(repositoryRoot, 'docs-nextra')
const outputRoot = resolve(nextraRoot, 'out')
const basePath = process.env.DOCS_BASE_PATH ?? ''
const manifest = JSON.parse(await readFile(resolve(nextraRoot, 'package.json'), 'utf8'))

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

assert.equal(manifest.name, '@nafr/echo-ui-docs-nextra')
assert.equal(manifest.dependencies['@nafr/echo-ui'], 'workspace:*')
assert.equal(manifest.scripts.dev, 'next dev --port 1801')
assert.equal(manifest.scripts.build, 'next build --webpack')

const landingPage = await readFile(resolve(outputRoot, 'index.html'), 'utf8')

assert.ok(landingPage.includes('Choose your documentation language'))
assert.ok(landingPage.includes(`href="${withBasePath('/en/')}"`))
assert.ok(landingPage.includes(`href="${withBasePath('/zh/')}"`))
await assertInternalLinksResolve(landingPage, '/')

const pages = [
  {
    file: 'index.html',
    route: '',
    en: {
      description: 'Build expressive Web Audio interfaces with accessible React components.',
      heading: 'A UI library born for Web Audio',
    },
    zh: {
      description: '使用无障碍 React 组件构建富有表现力的 Web Audio 界面。',
      heading: '为 Web Audio 而生的 UI 组件库',
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
      toc: 'Install the package',
    },
    zh: {
      description: '安装当前的 Echo UI 发行版并配置已验证的使用要求。',
      heading: '安装',
      toc: '安装软件包',
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
    controllerLabel: 'Controllers',
    editLink: 'Edit this page on GitHub',
    footer: 'Released under the MIT License.',
    guideLabel: 'Guide',
    tocLabel: 'On this page',
  },
  zh: {
    counterpart: 'en',
    controllerLabel: '控制器',
    editLink: '在 GitHub 上编辑此页',
    footer: '基于 MIT 许可证发布。',
    guideLabel: '指南',
    tocLabel: '本页目录',
  },
}

const controllers = ['button', 'checkbox', 'envelope', 'input', 'knob', 'radio', 'slider', 'switch']

for (const page of pages) {
  for (const [locale, labels] of Object.entries(locales)) {
    const html = await readFile(resolve(outputRoot, locale, page.file), 'utf8')
    const expected = page[locale]
    const localizedRoute = `/${locale}${page.route}/`
    const sourcePath = page.route
      ? `content/${locale}${page.route}.mdx`
      : `content/${locale}/index.mdx`

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
    await assertInternalLinksResolve(html, localizedRoute)

    if (page.route) {
      assert.ok(
        html.includes(labels.tocLabel),
        `${localizedRoute} should label its table of contents`,
      )
      assert.ok(
        html.includes(expected.toc),
        `${localizedRoute} should expose page headings in its TOC`,
      )
      assert.ok(html.includes(labels.editLink), `${localizedRoute} should expose its edit link`)
      assert.ok(
        html.includes(`https://github.com/codeacme17/echo-ui/tree/main/docs-nextra/${sourcePath}`),
        `${localizedRoute} should edit the matching source file`,
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

  assert.ok(installationPage.includes('@nafr/echo-ui@1.0.0'))
  assert.ok(installationPage.includes('React 18.2'))
  assert.ok(!installationPage.match(/Tailwind(?: CSS)? 3(?:\.\d+)? or higher/i))
  assert.ok(!installationPage.includes('Tailwind CSS 3 或更高'))
}

for (const [locale, labels] of Object.entries(locales)) {
  for (const controller of controllers) {
    const html = await readFile(
      resolve(outputRoot, locale, 'component', controller, 'index.html'),
      'utf8',
    )
    const localizedRoute = `/${locale}/component/${controller}/`
    const sourcePath = `content/${locale}/component/${controller}.mdx`

    assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`))
    assert.ok(
      html.includes(`data-controller-demo="${controller}"`),
      `${localizedRoute} should render its interactive local-package demo`,
    )
    assert.ok(
      html.includes(`data-controller-api="${controller}"`),
      `${localizedRoute} should render its public API reference`,
    )
    assert.ok(
      html.includes('pnpm add @nafr/echo-ui'),
      `${localizedRoute} should include installation guidance`,
    )
    assert.ok(
      html.includes(`href="${withBasePath(localizedRoute)}"`),
      `${localizedRoute} navigation should expose the localized route`,
    )
    assert.ok(
      html.includes(`href="${withBasePath(`/${locale}/component/button/`)}"`),
      `${localizedRoute} should expose localized controller navigation`,
    )
    assert.ok(
      html.includes(labels.controllerLabel),
      `${localizedRoute} should label controller navigation`,
    )
    assert.ok(html.includes('title="Change theme"'), `${localizedRoute} should switch themes`)
    assert.ok(html.includes('title="Change language"'), `${localizedRoute} should switch locales`)
    assert.ok(
      html.includes(labels.tocLabel),
      `${localizedRoute} should label its table of contents`,
    )
    assert.ok(html.includes(labels.editLink), `${localizedRoute} should expose its edit link`)
    assert.ok(html.includes(labels.footer), `${localizedRoute} should include a localized footer`)
    assert.ok(
      html.includes(`https://github.com/codeacme17/echo-ui/tree/main/docs-nextra/${sourcePath}`),
      `${localizedRoute} should edit the matching source file`,
    )
    await access(resolve(outputRoot, labels.counterpart, 'component', controller, 'index.html'))
    await assertInternalLinksResolve(html, localizedRoute)

    for (const assetPath of html.matchAll(/(?:href|src)="([^"?]*\/_next\/[^"?]+)(?:\?[^"?]*)?"/g)) {
      assert.ok(assetPath[1].startsWith(`${basePath}/_next/`))
      await access(resolve(outputRoot, decodeURIComponent(assetPath[1].slice(basePath.length + 1))))
    }
  }
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
const css = (
  await Promise.all(cssFiles.map((file) => readFile(resolve(outputRoot, file), 'utf8')))
).join('\n')

assert.ok(css.includes('--echo-primary'), 'static CSS should include Echo UI styles')

console.log(
  'Nextra static output exposes bilingual guides, controller routes, API references, and live Echo UI demos.',
)
