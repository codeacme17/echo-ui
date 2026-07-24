import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { controllerRoutes, displayRoutes } from '../docs/route-manifest.mjs'
import {
  closeStaticServer,
  createDocsStaticServer,
  listenOnRandomPort,
} from './docs-static-server.mjs'
import { launchBrowser } from './launch-browser.mjs'

const basePath = process.env.DOCS_BASE_PATH ?? ''
const componentRoutes = [...controllerRoutes, ...displayRoutes]
const baseline = JSON.parse(
  await readFile(new URL('../docs/visual-baselines/island-v1.json', import.meta.url), 'utf8'),
)
assert.deepEqual(Object.keys(baseline.routes), [
  'home',
  'guide',
  'controller',
  'visualization',
  'hook',
])
assert.deepEqual(Object.keys(baseline.categoryContracts), [
  'guide',
  'controller',
  'visualization',
  'hook',
])

assert.ok(!basePath || (basePath.startsWith('/') && !basePath.endsWith('/')))

const server = createDocsStaticServer({ basePath })

const px = (value) => Number.parseFloat(value)
const withBasePath = (path) => `${basePath}${path}`
const within = (actual, expected, tolerance = 1) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be within ${tolerance}px of ${expected}`,
  )
const withinOneOf = (actual, expectedValues, tolerance = 1) =>
  assert.ok(
    expectedValues.some((expected) => Math.abs(actual - expected) <= tolerance),
    `Expected ${actual} to be within ${tolerance}px of one of ${expectedValues.join(', ')}`,
  )

const profiles = baseline.profiles.map((name) => {
  const [viewportName, colorScheme] = name.split('-')
  return {
    colorScheme,
    desktop: viewportName === 'desktop',
    name,
    viewport: baseline.viewports[viewportName],
  }
})

const readContract = (page) =>
  page.evaluate(() => {
    const measure = (selector) => {
      const element = document.querySelector(selector)
      if (!element) return null
      const style = getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return {
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        borderColor: style.borderColor,
        borderRadius: style.borderRadius,
        borderWidth: style.borderWidth,
        color: style.color,
        display: style.display,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        height: rect.height,
        justifyContent: style.justifyContent,
        lineHeight: style.lineHeight,
        margin: style.margin,
        overflow: style.overflow,
        padding: style.padding,
        paddingTop: style.paddingTop,
        position: style.position,
        width: rect.width,
        x: rect.x,
        y: rect.y,
      }
    }

    return {
      article: measure('article main'),
      body: measure('body'),
      codeBlock: measure('article main div.nextra-code:has(> pre)'),
      demo: measure('section[data-controller-demo], section[data-display-demo]'),
      demoLabel: document.querySelector(
        'section[data-controller-demo] > header > span, section[data-display-demo] > header > span',
      )?.textContent,
      demoStatus: measure(
        'section[data-controller-demo] > header > p, section[data-display-demo] > header > p',
      ),
      demoSurface: measure('section[data-controller-demo] > div:last-child'),
      editLink: measure('a[href*="github.com/codeacme17/echo-ui"][href*="/tree/main/docs/"]'),
      externalLinkArrow: measure('article main a[target="_blank"] > svg'),
      footer: measure('footer'),
      footerText: document.querySelector('footer')?.textContent?.trim(),
      h1: measure('article main h1'),
      h2: measure('article main h2'),
      h2Text: document.querySelector('article main h2')?.textContent?.replace('#', '').trim(),
      header: measure('header'),
      headerExternalLinks: [
        ...document.querySelectorAll('.nextra-navbar a[target="_blank"]'),
      ].filter((link) => getComputedStyle(link).display !== 'none').length,
      headerThemeSwitch: measure('.nextra-navbar button[title="Change theme"]'),
      inlineCode: measure('article main p code'),
      installPackage: measure('article main aside[aria-label="Installation"]'),
      islandMobileMenu: measure('.island-mobile-menu'),
      logo: measure('.echo-docs-logo'),
      navLabels: [
        ...document.querySelectorAll('.nextra-navbar > nav > .nextra-scrollbar > :is(a, button)'),
      ]
        .filter((item) => getComputedStyle(item).display !== 'none')
        .map((item) => item.textContent?.trim()),
      paragraph: measure('article main p'),
      paginationCount: document.querySelectorAll('article a[class*="max-w-[50%]"]').length,
      pre: measure('article main pre'),
      search: measure('.nextra-navbar input[type="search"]'),
      searchPlaceholder: document.querySelector('.nextra-navbar input[type="search"]')?.placeholder,
      sidebarActive: measure('aside.nextra-sidebar li.active > a'),
      sidebarFooter: measure('aside.nextra-sidebar .nextra-sidebar-footer'),
      sidebarSeparators: [
        ...document.querySelectorAll('aside.nextra-sidebar li:not(:has(a, button))'),
      ].map((item) => item.textContent?.trim()),
      sidebar: measure('aside.nextra-sidebar'),
      table: measure('article main table'),
      tableHead: measure('article main th'),
      theme: document.documentElement.className,
      toc: measure('nav[aria-label="table of contents"]'),
    }
  })

const assertContentContract = (contract, colorScheme, lang = 'en') => {
  const dark = colorScheme === 'dark'
  assert.match(contract.theme, new RegExp(`\\b${colorScheme}\\b`))
  assert.ok(contract.body?.fontFamily.startsWith('Poppins'))
  assert.equal(
    contract.body?.backgroundColor,
    dark ? baseline.shell.colors.darkBackground : baseline.shell.colors.lightBackground,
  )
  assert.equal(
    contract.body?.color,
    dark ? baseline.shell.colors.darkText : baseline.shell.colors.lightText,
  )

  assert.equal(contract.h1?.fontWeight, '600')
  assert.equal(contract.h1?.lineHeight, '40px')
  assert.equal(contract.h1?.margin, '0px 0px 10px -10px')
  assert.equal(contract.h2?.fontSize, '24px')
  assert.equal(contract.h2?.fontWeight, '600')
  assert.equal(contract.h2?.lineHeight, '32px')
  assert.equal(contract.h2?.margin, '48px 0px 5px -8px')
  assert.equal(contract.h2?.borderWidth, '0px')
  assert.equal(contract.paragraph?.fontSize, '16px')
  assert.equal(contract.paragraph?.lineHeight, '28px')
  assert.equal(contract.paragraph?.margin, '16px 0px')

  assert.equal(
    contract.inlineCode?.backgroundColor,
    dark ? 'rgb(58, 58, 58)' : 'rgb(241, 241, 241)',
  )
  assert.equal(contract.inlineCode?.borderRadius, '4px')
  assert.equal(contract.inlineCode?.borderWidth, '0px')
  assert.equal(contract.inlineCode?.color, 'rgb(233, 160, 13)')
  assert.equal(contract.inlineCode?.fontSize, '14px')
  assert.equal(contract.inlineCode?.padding, '3px 6px')

  assert.equal(contract.codeBlock?.backgroundColor, dark ? 'rgb(24, 24, 24)' : 'rgb(241, 239, 239)')
  assert.equal(contract.codeBlock?.borderRadius, '8px')
  assert.equal(contract.codeBlock?.margin, '16px 0px')
  assert.equal(contract.codeBlock?.padding, '20px')
  assert.equal(contract.pre?.backgroundColor, dark ? 'rgb(24, 24, 24)' : 'rgb(241, 239, 239)')
  assert.equal(contract.pre?.borderRadius, '0px')
  assert.equal(contract.pre?.borderWidth, '0px')
  assert.equal(contract.pre?.fontFamily, '"JetBrains Mono", monospace')
  assert.equal(contract.pre?.fontSize, '13.6px')
  assert.equal(contract.pre?.lineHeight, '20.4px')
  assert.equal(contract.pre?.margin, '0px')
  assert.equal(contract.pre?.padding, '0px')

  assert.equal(contract.table?.fontSize, '13.6px')
  assert.equal(contract.table?.margin, '20px 0px')
  assert.equal(contract.tableHead?.backgroundColor, dark ? 'rgb(26, 26, 26)' : 'rgb(249, 249, 249)')
  assert.equal(contract.tableHead?.fontWeight, '600')
  assert.equal(contract.tableHead?.padding, '12px 16px')

  assert.equal(contract.demo?.backgroundImage, 'none')
  assert.equal(contract.demo?.backgroundColor, 'rgba(0, 0, 0, 0)')
  assert.equal(contract.demo?.borderRadius, '8px')
  assert.equal(contract.demo?.borderWidth, '1px')
  assert.equal(contract.demoLabel, lang === 'zh' ? '预览' : 'Preview')
  assert.equal(contract.demoStatus?.position, 'absolute')
  if (contract.demoSurface) {
    assert.equal(contract.demoSurface.backgroundImage, 'none')
    assert.equal(contract.demoSurface.borderRadius, '8px')
    assert.equal(contract.demoSurface.display, 'flex')
    assert.match(contract.demoSurface.fontFamily, /JetBrains Mono/)
    assert.equal(contract.demoSurface.justifyContent, 'center')
    assert.equal(contract.demoSurface.padding, '20px')
  }
  assert.notEqual(contract.footer?.display, 'none')
  assert.match(contract.footerText ?? '', /MIT/)
  assert.match(contract.footerText ?? '', /Copyright/)
  assert.ok(contract.paginationCount > 0)
  assert.equal(contract.externalLinkArrow?.display ?? 'none', 'none')
  assert.ok(contract.headerThemeSwitch)
  assert.equal(contract.installPackage, null)
  assert.equal(contract.h2Text, lang === 'zh' ? '导入' : 'Import')
  assert.deepEqual(
    contract.navLabels,
    lang === 'zh' ? ['指南', '组件', 'Hook', '链接'] : ['Guide', 'Component', 'Hook', 'Links'],
  )
  assert.equal(contract.sidebarActive?.backgroundColor, 'rgba(0, 0, 0, 0)')
  assert.equal(contract.sidebarActive?.color, 'rgb(253, 170, 4)')
  assert.equal(contract.sidebarActive?.fontWeight, '400')
  assert.notEqual(contract.sidebarFooter?.display, 'none')
  assert.deepEqual(
    contract.sidebarSeparators,
    lang === 'zh' ? ['可控组件', '可视化', '容器'] : ['Controller', 'Visualization', 'Container'],
  )
}

const assertDesktopShell = (contract, colorScheme, lang = 'en') => {
  assert.equal(contract.header?.position, 'fixed')
  within(contract.header?.height ?? 0, baseline.shell.desktop.headerHeight)
  assert.equal(contract.sidebar?.position, 'fixed')
  assert.equal(
    contract.sidebar?.backgroundColor,
    colorScheme === 'dark' ? 'rgb(23, 23, 23)' : 'rgb(249, 249, 249)',
  )
  within(contract.sidebar?.width ?? 0, baseline.shell.desktop.sidebarWidth)
  within(contract.sidebar?.height ?? 0, 900)
  within(px(contract.sidebar?.paddingTop ?? '0'), 60)
  within(contract.sidebar?.x ?? -1, 0)
  within(contract.sidebar?.y ?? -1, 0)
  within(contract.logo?.x ?? 0, 32)
  assert.equal(contract.logo?.color, contract.body?.color)
  assert.equal(contract.searchPlaceholder, lang === 'zh' ? '搜索' : 'Search')
  within(contract.search?.x ?? 0, 328)
  within(contract.article?.width ?? 0, baseline.shell.desktop.articleWidth)
  within(contract.article?.x ?? 0, baseline.shell.desktop.articleX)
  within(contract.article?.y ?? 0, baseline.shell.desktop.articleY)
  within(contract.toc?.width ?? 0, baseline.shell.desktop.tocWidth)
  within(contract.toc?.x ?? 0, baseline.shell.desktop.tocX)
  within(contract.toc?.y ?? 0, baseline.shell.desktop.tocY)
  assert.ok(
    (contract.editLink?.width ?? 0) > 0,
    'Desktop documentation pages must expose a visible edit-page control.',
  )
  assert.equal(contract.h1?.fontSize, '32px')
  assert.equal(contract.islandMobileMenu?.display, 'none')
}

const assertMobileShell = (contract) => {
  assert.equal(contract.header?.position, 'relative')
  within(contract.header?.height ?? 0, baseline.shell.mobile.headerHeight)
  within(contract.header?.width ?? 0, 374)
  within(contract.header?.x ?? 0, 8)
  within(contract.header?.y ?? 0, 0)
  within(contract.logo?.x ?? 0, 40)
  assert.ok(
    contract.sidebar?.display === 'none' ||
      (contract.sidebar?.x ?? 0) + (contract.sidebar?.width ?? 0) <= 1,
    'The closed mobile sidebar must remain off canvas.',
  )
  assert.equal(contract.toc?.display, 'none')
  assert.equal(contract.islandMobileMenu?.display, 'flex')
  within(contract.islandMobileMenu?.height ?? 0, baseline.shell.mobile.menuHeight)
  within(contract.islandMobileMenu?.width ?? 0, 374)
  within(contract.islandMobileMenu?.x ?? 0, 8)
  within(contract.islandMobileMenu?.y ?? 0, 56)
  within(contract.article?.width ?? 0, baseline.shell.mobile.contentWidth)
  within(contract.article?.x ?? 0, baseline.shell.mobile.contentX)
  within(contract.article?.y ?? 0, baseline.shell.mobile.contentY)
  assert.equal(contract.h1?.fontSize, '28px')
}

const address = await listenOnRandomPort(server)
assert.ok(address && typeof address === 'object')

let browser
let activeContext

try {
  browser = await launchBrowser()

  for (const profile of profiles) {
    activeContext = await browser.newContext({
      colorScheme: profile.colorScheme,
      viewport: profile.viewport,
    })
    const page = await activeContext.newPage()
    page.on('pageerror', (error) => {
      console.error(`Browser page error: ${error.stack ?? error.message}`)
    })
    const buttonResponse = await page.goto(
      `http://127.0.0.1:${address.port}${withBasePath('/en/component/button/')}`,
      { waitUntil: 'networkidle' },
    )
    assert.ok(buttonResponse?.ok(), 'The English Button route should render for parity checks.')
    const contract = await readContract(page)
    assertContentContract(contract, profile.colorScheme)
    if (profile.desktop) assertDesktopShell(contract, profile.colorScheme)
    else {
      assertMobileShell(contract)
      await page.locator('.island-mobile-menu').click()
      await page.waitForFunction(() => {
        const mobileNav = document.querySelector('.nextra-mobile-nav')
        return mobileNav && mobileNav.getBoundingClientRect().top >= 0
      })
      assert.equal(await page.locator('.island-mobile-menu').getAttribute('aria-expanded'), 'true')
      assert.equal(
        await page.locator('.island-mobile-menu').getAttribute('aria-controls'),
        'island-mobile-navigation',
      )
      await page.locator('.nextra-hamburger').click()
      await page.waitForFunction(
        () =>
          document.querySelector('.island-mobile-menu')?.getAttribute('aria-expanded') === 'false',
      )
    }

    for (const lang of ['en', 'zh']) {
      for (const [category, baselineRoute] of Object.entries(baseline.routes)) {
        if (category === 'home') continue
        const categoryBaseline = baseline.categoryContracts[category]
        const localizedRoute = baselineRoute.replace('/en/', `/${lang}/`)
        const response = await page.goto(
          `http://127.0.0.1:${address.port}${withBasePath(localizedRoute)}`,
          { waitUntil: 'networkidle' },
        )
        assert.ok(
          response?.ok(),
          `${profile.name} ${lang} ${category} baseline route should render.`,
        )
        if (category === 'visualization') {
          await page.waitForFunction(
            (expected) =>
              document.querySelectorAll(
                '[data-component-variant-matrix="spectrogram"] section [role="tabpanel"] svg',
              ).length >= expected,
            categoryBaseline.renderedGraphCount,
          )
        }
        const categoryContract = await page.evaluate(
          ({ currentCategory, selector }) => {
            const marker = document.querySelector(selector)
            const markerBounds = marker?.getBoundingClientRect()
            const markerStyle = marker ? getComputedStyle(marker) : undefined

            return {
              calloutIconCount:
                currentCategory === 'guide'
                  ? [
                      ...document.querySelectorAll('article main .nextra-callout svg'),
                    ].filter(
                      (icon) =>
                        getComputedStyle(icon).display !== 'none' &&
                        icon.getClientRects().length > 0,
                    ).length
                  : undefined,
              clientWidth: document.documentElement.clientWidth,
              documentStart: document.documentElement.outerHTML.slice(0, 200),
              hasHeading: Boolean(document.querySelector('article main h1')),
              lang: document.documentElement.lang,
              marker: markerBounds
                ? {
                    borderRadius: markerStyle?.borderRadius,
                    borderWidth: markerStyle?.borderWidth,
                    height: markerBounds.height,
                    padding: markerStyle?.padding,
                    width: markerBounds.width,
                  }
                : null,
              renderedGraphCount:
                currentCategory === 'visualization'
                  ? document.querySelectorAll(
                      '[data-component-variant-matrix="spectrogram"] section [role="tabpanel"] svg',
                    ).length
                  : undefined,
              scrollWidth: document.documentElement.scrollWidth,
              statusCount:
                currentCategory === 'hook'
                  ? document.querySelectorAll('section[data-hook-demo="usePlayer"] > header > p')
                      .length
                  : undefined,
              tabCount:
                currentCategory === 'controller'
                  ? document.querySelectorAll(
                      '[data-component-variant-matrix="button"] [role="tab"]',
                    ).length
                  : undefined,
              theme: document.documentElement.className,
              title: document.title,
              url: location.href,
              variantCount:
                currentCategory === 'controller' || currentCategory === 'visualization'
                  ? document.querySelectorAll(
                      `[data-component-variant-matrix="${currentCategory === 'controller' ? 'button' : 'spectrogram'}"] > section`,
                    ).length
                  : undefined,
            }
          },
          { currentCategory: category, selector: categoryBaseline.selector },
        )
        assert.equal(
          categoryContract.lang,
          lang,
          `${profile.name} ${lang} ${category} should keep the localized document language at ${categoryContract.url} (${categoryContract.title}): ${categoryContract.documentStart}`,
        )
        assert.match(categoryContract.theme, new RegExp(`\\b${profile.colorScheme}\\b`))
        assert.equal(categoryContract.hasHeading, true)
        assert.ok(
          categoryContract.marker,
          `${profile.name} ${lang} ${category} should expose its maintained visual surface.`,
        )
        within(
          categoryContract.marker?.width ?? 0,
          profile.desktop ? categoryBaseline.desktopWidth : categoryBaseline.mobileWidth,
        )
        assert.equal(categoryContract.marker?.borderRadius, categoryBaseline.borderRadius)
        assert.equal(categoryContract.marker?.borderWidth, categoryBaseline.borderWidth)
        if (categoryBaseline.minimumHeight) {
          assert.ok(
            (categoryContract.marker?.height ?? 0) >= categoryBaseline.minimumHeight,
            `${profile.name} ${lang} ${category} surface should retain its minimum visual height.`,
          )
        }
        if (categoryBaseline.padding) {
          assert.equal(categoryContract.marker?.padding, categoryBaseline.padding)
        }
        if (categoryBaseline.iconCount !== undefined) {
          assert.equal(categoryContract.calloutIconCount, categoryBaseline.iconCount)
        }
        if (categoryBaseline.variantCount !== undefined) {
          assert.equal(categoryContract.variantCount, categoryBaseline.variantCount)
        }
        if (categoryBaseline.tabCount !== undefined) {
          assert.equal(categoryContract.tabCount, categoryBaseline.tabCount)
        }
        if (categoryBaseline.renderedGraphCount !== undefined) {
          assert.ok(
            categoryContract.renderedGraphCount >= categoryBaseline.renderedGraphCount,
            `${profile.name} ${lang} ${category} should render every maintained graph.`,
          )
        }
        if (categoryBaseline.statusCount !== undefined) {
          assert.equal(categoryContract.statusCount, categoryBaseline.statusCount)
        }
        assert.ok(
          categoryContract.scrollWidth <= categoryContract.clientWidth,
          `${profile.name} ${lang} ${category} baseline must not overflow.`,
        )
      }

      for (const route of componentRoutes) {
        const response = await page.goto(
          `http://127.0.0.1:${address.port}${withBasePath(`/${lang}/component/${route}/`)}`,
          { waitUntil: 'load' },
        )
        assert.ok(response?.ok(), `${lang}/${route} should render from the static export.`)
        const routeContract = await page.evaluate(() => {
          const demos = [
            ...document.querySelectorAll(
              'section[data-controller-demo], section[data-display-demo]',
            ),
          ]
          return {
            backgrounds: demos.map((demo) => getComputedStyle(demo).backgroundImage),
            clientWidth: document.documentElement.clientWidth,
            hasHeading: Boolean(document.querySelector('article main h1')),
            hasSignalDot: Boolean(
              document.querySelector('section[data-display-demo] [class*="signalDot"]'),
            ),
            labels: demos.map((demo) => demo.querySelector(':scope > header > span')?.textContent),
            lang: document.documentElement.lang,
            scrollWidth: document.documentElement.scrollWidth,
            theme: document.documentElement.className,
          }
        })
        assert.equal(routeContract.lang, lang)
        assert.match(routeContract.theme, new RegExp(`\\b${profile.colorScheme}\\b`))
        assert.equal(routeContract.hasHeading, true)
        assert.ok(
          routeContract.backgrounds.length > 0,
          `${lang}/${route} should keep its live demo.`,
        )
        assert.ok(routeContract.backgrounds.every((background) => background === 'none'))
        assert.ok(
          routeContract.labels.every((label) => label === (lang === 'zh' ? '预览' : 'Preview')),
        )
        assert.equal(routeContract.hasSignalDot, false)
        assert.ok(
          routeContract.scrollWidth <= routeContract.clientWidth,
          `${lang}/${route} should not overflow the ${profile.viewport.width}px viewport.`,
        )
        const fullRouteContract = await readContract(page)
        assertContentContract(fullRouteContract, profile.colorScheme, lang)
        if (profile.desktop) assertDesktopShell(fullRouteContract, profile.colorScheme, lang)
        else assertMobileShell(fullRouteContract)
      }

      const homeResponse = await page.goto(
        `http://127.0.0.1:${address.port}${withBasePath(`/${lang}/`)}`,
        { waitUntil: 'load' },
      )
      assert.ok(homeResponse?.ok(), `${lang} home should render from the static export.`)
      const homeContract = await page.evaluate(() => {
        const rect = (selector) => {
          const element = document.querySelector(selector)
          if (!element) return null
          const bounds = element.getBoundingClientRect()
          return {
            backgroundColor: getComputedStyle(element).backgroundColor,
            display: getComputedStyle(element).display,
            height: bounds.height,
            width: bounds.width,
            x: bounds.x,
            y: bounds.y,
          }
        }
        const home = document.querySelector('.echo-home')
        const hero = document.querySelector('.echo-home__hero')
        const heroRect = hero?.getBoundingClientRect()
        return {
          featureCount: document.querySelectorAll('.echo-home__feature').length,
          firstFeature: rect('.echo-home__feature'),
          hasSignalLab: Boolean(document.querySelector('.echo-home__signal')),
          heroActions: rect('.echo-home__actions'),
          heroImage: rect('.echo-home__image img'),
          heroImageSource: document.querySelector('.echo-home__image img')?.currentSrc,
          heroName: rect('.echo-home__title'),
          heroTagline: rect('.echo-home__tagline'),
          heroText: rect('.echo-home__hero-text'),
          heroWidth: heroRect?.width,
          heroX: heroRect?.x,
          homeExists: Boolean(home),
          menuButton: rect('.island-mobile-menu'),
          title: [
            document.querySelector('.echo-home__title')?.textContent,
            document.querySelector('.echo-home__hero-text')?.textContent,
          ]
            .filter(Boolean)
            .join(' '),
        }
      })
      assert.equal(homeContract.homeExists, true)
      assert.equal(homeContract.hasSignalLab, false)
      assert.equal(homeContract.featureCount, 6)
      assert.equal(
        homeContract.firstFeature?.backgroundColor,
        profile.colorScheme === 'dark' ? 'rgb(30, 30, 30)' : 'rgb(249, 249, 249)',
      )
      assert.match(homeContract.heroImageSource ?? '', /\/logo\.png$/)
      assert.equal(homeContract.menuButton?.display, 'none')
      assert.equal(
        homeContract.title,
        lang === 'zh' ? 'Echo UI 一款为 WAA 而生的 UI 组件库' : 'Echo UI A UI library born for WAA',
      )
      if (profile.desktop) {
        within(homeContract.heroWidth ?? 0, 1152)
        within(homeContract.heroX ?? 0, 144)
        within(homeContract.heroImage?.width ?? 0, 256)
        within(homeContract.heroImage?.height ?? 0, 256)
        within(homeContract.heroImage?.x ?? 0, 880)
        within(homeContract.heroImage?.y ?? 0, 168)
        within(homeContract.firstFeature?.width ?? 0, 368)
        within(homeContract.firstFeature?.height ?? 0, 222)
        within(homeContract.firstFeature?.x ?? 0, 144)
        within(homeContract.firstFeature?.y ?? 0, 516)
      } else {
        within(homeContract.heroImage?.width ?? 0, 256)
        within(homeContract.heroImage?.height ?? 0, 256)
        within(homeContract.heroImage?.x ?? 0, 67)
        within(homeContract.heroImage?.y ?? 0, 160)
        within(homeContract.heroName?.height ?? 0, 36)
        within(homeContract.heroName?.y ?? 0, 416)
        within(homeContract.heroText?.height ?? 0, 72)
        within(homeContract.heroText?.x ?? 0, 32)
        within(homeContract.heroText?.y ?? 0, 452)
        within(homeContract.heroTagline?.y ?? 0, 524)
        within(homeContract.heroActions?.x ?? 0, 26)
        within(homeContract.heroActions?.y ?? 0, 550)
        within(homeContract.firstFeature?.width ?? 0, 374)
        // Chromium's fallback CJK font may fit the first description on one line on Linux.
        withinOneOf(homeContract.firstFeature?.height ?? 0, [174, 198])
        within(homeContract.firstFeature?.x ?? 0, 8)
        within(homeContract.firstFeature?.y ?? 0, 680)
      }
    }

    await activeContext.close()
    activeContext = undefined
  }

  activeContext = await browser.newContext({
    colorScheme: 'light',
    viewport: { height: 900, width: 800 },
  })
  const tabletPage = await activeContext.newPage()
  const tabletResponse = await tabletPage.goto(
    `http://127.0.0.1:${address.port}${withBasePath('/en/component/button/')}`,
    { waitUntil: 'networkidle' },
  )
  assert.ok(tabletResponse?.ok(), 'The tablet regression route should render.')
  const tabletContract = await readContract(tabletPage)
  const tabletViewport = await tabletPage.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  assert.equal(tabletContract.header?.position, 'fixed')
  assert.equal(tabletContract.islandMobileMenu?.display, 'none')
  assert.ok(
    (tabletContract.article?.x ?? 0) >=
      (tabletContract.sidebar?.x ?? 0) + (tabletContract.sidebar?.width ?? 0),
    'The 800px article must not sit underneath the fixed sidebar.',
  )
  assert.ok(
    tabletViewport.scrollWidth <= tabletViewport.clientWidth,
    'The 800px documentation shell must not overflow horizontally.',
  )
  await activeContext.close()
  activeContext = undefined
} finally {
  await activeContext?.close()
  await browser?.close()
  await closeStaticServer(server)
}

console.log('Nextra UI contract passed across 120 component and 8 localized home checks.')
