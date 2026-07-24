import { cp, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  closeStaticServer,
  createDocsStaticServer,
  listenOnRandomPort,
} from './docs-static-server.mjs'
import { launchBrowser } from './launch-browser.mjs'

const repositoryRoot = resolve(import.meta.dirname, '..')
const evidenceRoot = resolve(repositoryRoot, 'screen-shots', '20260724T132107Z-issue-108-743034')
const server = createDocsStaticServer({ basePath: '' })
const address = await listenOnRandomPort(server)

if (!address || typeof address !== 'object') throw new Error('Docs evidence server did not start.')

await mkdir(evidenceRoot, { recursive: true })
await Promise.all([
  cp(
    resolve(repositoryRoot, 'docs/screenshots/nextra-en-dark.png'),
    resolve(evidenceRoot, 'before-migration-preview-en-dark.png'),
  ),
  cp(
    resolve(repositoryRoot, 'docs/screenshots/nextra-zh-light.png'),
    resolve(evidenceRoot, 'before-migration-preview-zh-light.png'),
  ),
])

const browser = await launchBrowser()
const origin = `http://127.0.0.1:${address.port}`

const capture = async ({ colorScheme, expectedPath, file, path, prepare, viewport }) => {
  const context = await browser.newContext({ colorScheme, viewport })
  const page = await context.newPage()
  await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' })
  if (expectedPath && new URL(page.url()).pathname !== expectedPath) {
    throw new Error(`${path} should resolve to ${expectedPath}, received ${page.url()}.`)
  }
  await prepare?.(page)
  await page.screenshot({ path: resolve(evidenceRoot, file) })
  await context.close()
}

try {
  await capture({
    colorScheme: 'light',
    expectedPath: '/en/',
    file: 'after-root-redirect-en-light-desktop.png',
    path: '/',
    viewport: { height: 900, width: 1440 },
  })
  await capture({
    colorScheme: 'dark',
    file: 'after-introduction-zh-dark-mobile-nav.png',
    path: '/zh/guide/introduction/',
    prepare: async (page) => {
      await page.locator('.island-mobile-menu').click()
      await page.waitForFunction(
        () =>
          document.querySelector('.island-mobile-menu')?.getAttribute('aria-expanded') === 'true',
      )
    },
    viewport: { height: 844, width: 390 },
  })
  await capture({
    colorScheme: 'dark',
    file: 'after-about-en-dark-desktop-wechat.png',
    path: '/en/guide/about/',
    prepare: async (page) => {
      await page.getByAltText('Echo UI WeChat community QR code').first().scrollIntoViewIfNeeded()
    },
    viewport: { height: 900, width: 1440 },
  })
  await capture({
    colorScheme: 'light',
    file: 'after-button-zh-light-mobile-code-copy.png',
    path: '/zh/component/button/',
    prepare: async (page) => {
      const firstExample = page.locator('[data-component-variant-matrix] section').first()
      await firstExample.scrollIntoViewIfNeeded()
      await firstExample.getByRole('tab', { name: '代码' }).click()
      await firstExample.getByRole('button', { name: '复制源码' }).click()
    },
    viewport: { height: 844, width: 390 },
  })
  await capture({
    colorScheme: 'dark',
    file: 'after-knob-en-dark-mobile.png',
    path: '/en/component/knob/',
    prepare: async (page) => {
      await page.locator('[data-component-variant-matrix]').scrollIntoViewIfNeeded()
    },
    viewport: { height: 844, width: 390 },
  })
  await capture({
    colorScheme: 'light',
    file: 'after-spectrogram-zh-light-desktop-links.png',
    path: '/zh/component/spectrogram/',
    prepare: async (page) => {
      await page.getByRole('button', { name: '链接' }).click()
    },
    viewport: { height: 900, width: 1440 },
  })
  await capture({
    colorScheme: 'light',
    file: 'after-introduction-en-light-desktop-pagination-footer.png',
    path: '/en/guide/introduction/',
    prepare: async (page) => {
      await page.locator('footer').scrollIntoViewIfNeeded()
    },
    viewport: { height: 900, width: 1440 },
  })
  await capture({
    colorScheme: 'light',
    file: 'after-introduction-en-light-desktop-edit.png',
    path: '/en/guide/introduction/',
    prepare: async (page) => {
      await page
        .locator('a[href*="github.com/codeacme17/echo-ui"][href*="/tree/main/docs/"]')
        .scrollIntoViewIfNeeded()
    },
    viewport: { height: 900, width: 1440 },
  })
  await capture({
    colorScheme: 'light',
    file: 'after-locale-switch-en-light-desktop.png',
    path: '/en/guide/introduction/',
    prepare: async (page) => {
      await page.locator('.nextra-navbar .island-locale-switch').click()
    },
    viewport: { height: 900, width: 1440 },
  })
  await capture({
    colorScheme: 'light',
    file: 'after-theme-switch-en-dark-desktop.png',
    path: '/en/guide/introduction/',
    prepare: async (page) => {
      await page.locator('.nextra-navbar .island-theme-switch').click()
      await page.getByRole('option', { name: 'Dark' }).click()
      await page.waitForFunction(() => document.documentElement.classList.contains('dark'))
    },
    viewport: { height: 900, width: 1440 },
  })
  await capture({
    colorScheme: 'dark',
    file: 'after-use-player-en-dark-desktop-audio.png',
    path: '/en/hook/usePlayer/',
    prepare: async (page) => {
      const demo = page.locator('section[data-hook-demo="usePlayer"]')
      await demo.scrollIntoViewIfNeeded()
      const action = demo.getByRole('button').first()
      if (await action.isVisible()) {
        await action.click()
        await page.waitForTimeout(500)
      }
    },
    viewport: { height: 900, width: 1440 },
  })
} finally {
  await browser.close()
  server.closeAllConnections()
  await closeStaticServer(server)
}

console.log(`Captured documentation UI evidence in ${evidenceRoot}.`)
