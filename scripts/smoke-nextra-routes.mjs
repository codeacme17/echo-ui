import assert from 'node:assert/strict'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = resolve(repositoryRoot, 'docs-nextra', 'out')
const basePath = process.env.DOCS_BASE_PATH ?? ''
const controllers = ['button', 'checkbox', 'envelope', 'input', 'knob', 'radio', 'slider', 'switch']
const locales = ['en', 'zh']

assert.ok(!basePath || (basePath.startsWith('/') && !basePath.endsWith('/')))

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

const fileForRequest = (requestUrl) => {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname)
  const hasExpectedBasePath =
    !basePath || pathname === basePath || pathname.startsWith(`${basePath}/`)
  assert.ok(hasExpectedBasePath, `${pathname} should stay within the configured base path`)
  const relativePath = basePath ? pathname.slice(basePath.length) : pathname
  const normalizedPath = relativePath.replace(/^\/+/, '')
  const requestedPath = resolve(
    outputRoot,
    normalizedPath && !normalizedPath.endsWith('/')
      ? normalizedPath
      : normalizedPath + 'index.html',
  )

  assert.ok(
    requestedPath === outputRoot || requestedPath.startsWith(`${outputRoot}${sep}`),
    'Browser smoke request must stay within the static output directory.',
  )

  return requestedPath
}

const server = createServer(async (request, response) => {
  try {
    let filePath = fileForRequest(request.url ?? '/')
    const fileStats = await stat(filePath)
    if (fileStats.isDirectory()) filePath = resolve(filePath, 'index.html')

    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
    })
    createReadStream(filePath).pipe(response)
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
})

const listen = () =>
  new Promise((resolveListen, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolveListen(server.address()))
  })

const closeServer = () => new Promise((resolveClose) => server.close(resolveClose))

const launchBrowser = async () => {
  const channel = process.env.PLAYWRIGHT_CHANNEL
  if (channel) return chromium.launch({ channel, headless: true })

  try {
    return await chromium.launch({ headless: true })
  } catch (bundledBrowserError) {
    try {
      return await chromium.launch({ channel: 'chrome', headless: true })
    } catch {
      throw new Error(
        'Playwright could not launch Chromium or Chrome. Run `pnpm exec playwright install chromium` or set PLAYWRIGHT_CHANNEL.',
        { cause: bundledBrowserError },
      )
    }
  }
}

const waitForStatus = (page, controller, expectedText) =>
  page.waitForFunction(
    ({ controllerName, text }) =>
      document
        .querySelector(`[data-controller-demo="${controllerName}"] [aria-live="polite"]`)
        ?.textContent?.includes(text),
    { controllerName: controller, text: expectedText },
  )

const exerciseDemo = async (page, controller, locale) => {
  const demo = page.locator(`[data-controller-demo="${controller}"]`)

  switch (controller) {
    case 'button':
      await demo.getByRole('button', { name: 'Square' }).click()
      await waitForStatus(page, controller, 'square')
      break
    case 'checkbox':
      await demo.getByRole('checkbox', { name: 'Chorus' }).check()
      await waitForStatus(page, controller, 'chorus')
      break
    case 'envelope':
      await demo.getByRole('spinbutton', { name: 'attack' }).fill('0.2')
      await waitForStatus(page, controller, 'A 0.20')
      break
    case 'input':
      await demo.getByLabel(locale === 'zh' ? '增益' : 'Gain').fill('4.5')
      await waitForStatus(page, controller, '4.5 dB')
      break
    case 'knob':
      await demo
        .getByRole('slider', { name: locale === 'zh' ? '增益镜像输入' : 'Gain mirror input' })
        .press('ArrowRight')
      await waitForStatus(page, controller, '-2 dB')
      break
    case 'radio':
      await demo.getByRole('radio', { name: locale === 'zh' ? '草稿' : 'Draft' }).check()
      await waitForStatus(page, controller, 'draft')
      break
    case 'slider':
      await demo
        .getByRole('slider', { name: locale === 'zh' ? '干湿比' : 'Wet mix' })
        .press('ArrowRight')
      await waitForStatus(page, controller, '40%')
      break
    case 'switch':
      await demo.getByRole('switch').press('Space')
      await demo.getByRole('switch').waitFor({ state: 'visible' })
      assert.equal(await demo.getByRole('switch').getAttribute('aria-checked'), 'true')
      break
  }
}

const address = await listen()
assert.ok(address && typeof address === 'object')

const origin = `http://127.0.0.1:${address.port}`
let browser

try {
  browser = await launchBrowser()

  for (const locale of locales) {
    for (const controller of controllers) {
      const route = `${basePath}/${locale}/component/${controller}/`
      const page = await browser.newPage()
      const browserErrors = []

      page.on('pageerror', (error) => browserErrors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') browserErrors.push(message.text())
      })

      const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' })
      assert.ok(response?.ok(), `${route} should return a successful browser response`)
      await page.locator(`[data-controller-demo="${controller}"]`).waitFor({ state: 'visible' })
      await page.locator(`[data-controller-api="${controller}"]`).waitFor({ state: 'visible' })
      await exerciseDemo(page, controller, locale)
      assert.deepEqual(browserErrors, [], `${route} should hydrate without browser errors`)

      await page.close()
    }
  }
} finally {
  await browser?.close()
  await closeServer()
}

console.log('Nextra browser smoke loaded and exercised all bilingual controller routes.')
