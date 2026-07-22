import assert from 'node:assert/strict'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { hookNames } from '../docs-nextra/hook-manifest.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = resolve(repositoryRoot, 'docs-nextra', 'out')
const basePath = process.env.DOCS_BASE_PATH ?? ''
const allControllers = [
  'button',
  'checkbox',
  'envelope',
  'input',
  'knob',
  'radio',
  'slider',
  'switch',
]
const allDisplays = ['lfo', 'light', 'oscilloscope', 'spectrogram', 'vumeter', 'waveform', 'card']
const allHooks = hookNames
const selectedDisplay = process.env.SMOKE_DISPLAY
const selectedHook = process.env.SMOKE_HOOK
const selectedLocale = process.env.SMOKE_LOCALE
const controllers = selectedDisplay || selectedHook ? [] : allControllers
const displays = selectedHook ? [] : selectedDisplay ? [selectedDisplay] : allDisplays
const hooks = selectedDisplay ? [] : selectedHook ? [selectedHook] : allHooks
const locales = selectedLocale ? [selectedLocale] : ['en', 'zh']

assert.ok(
  !selectedDisplay || allDisplays.includes(selectedDisplay),
  'SMOKE_DISPLAY must name a display',
)
assert.ok(!selectedLocale || ['en', 'zh'].includes(selectedLocale), 'SMOKE_LOCALE must be en or zh')
assert.ok(!selectedHook || allHooks.includes(selectedHook), 'SMOKE_HOOK must name a Hook')

assert.ok(!basePath || (basePath.startsWith('/') && !basePath.endsWith('/')))

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
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

const waitForDisplayState = (page, display, state) =>
  page.waitForFunction(
    ({ displayName, expectedState }) =>
      document
        .querySelector(`[data-display-demo="${displayName}"]`)
        ?.getAttribute('data-audio-state') === expectedState,
    { displayName: display, expectedState: state },
    { timeout: 10_000 },
  )

const exerciseDisplay = async (page, display, locale) => {
  const demo = page.locator(`[data-display-demo="${display}"]`)

  if (display === 'card') {
    const toggleName = locale === 'zh' ? '旁通' : 'Bypass'
    await demo.getByRole('button', { name: toggleName }).click()
    assert.equal(await demo.getAttribute('data-audio-state'), 'not-applicable')
    return
  }

  const labels =
    locale === 'zh'
      ? { reconnect: '重新连接音频图', start: '启动信号', stop: '停止信号' }
      : { reconnect: 'Reconnect graph', start: 'Start signal', stop: 'Stop signal' }

  await demo.getByRole('button', { name: labels.start }).click()
  await waitForDisplayState(page, display, 'playing')
  assert.equal(await demo.getAttribute('data-animation-active'), 'true')
  assert.equal(await demo.getAttribute('data-graph-connected'), 'true')
  const initialConnections = Number(await demo.getAttribute('data-connection-count'))
  assert.ok(initialConnections >= 1, `${display} should connect a real audio graph`)

  await demo.getByRole('button', { name: labels.stop }).click()
  await waitForDisplayState(page, display, 'stopped')
  assert.equal(await demo.getAttribute('data-animation-active'), 'false')
  assert.equal(await demo.getAttribute('data-graph-connected'), 'false')

  await demo.getByRole('button', { name: labels.reconnect }).click()
  await waitForDisplayState(page, display, 'ready')
  assert.equal(await demo.getAttribute('data-animation-active'), 'false')
  assert.equal(await demo.getAttribute('data-graph-connected'), 'true')
  assert.ok(
    Number(await demo.getAttribute('data-connection-count')) > initialConnections,
    `${display} should establish a new graph connection`,
  )

  await demo.getByRole('button', { name: labels.start }).click()
  await waitForDisplayState(page, display, 'playing')
  await demo.getByRole('button', { name: labels.stop }).click()
  await waitForDisplayState(page, display, 'stopped')
  assert.equal(await demo.getAttribute('data-graph-connected'), 'false')
}

const waitForHookState = (page, hook, state) =>
  page.waitForFunction(
    ({ hookName, expectedState }) =>
      document
        .querySelector(`[data-hook-demo="${hookName}"]`)
        ?.getAttribute('data-audio-state') === expectedState,
    { hookName: hook, expectedState: state },
    { timeout: 10_000 },
  )

const exerciseHook = async (page, hook, locale) => {
  const demo = page.locator(`[data-hook-demo="${hook}"]`)
  const runsActiveGraph = ['useOscilloscope', 'usePlayer', 'useSpectrogram', 'useVuMeter'].includes(
    hook,
  )
  const labels =
    locale === 'zh'
      ? {
          load: hook === 'useWaveform' ? '生成波形' : '加载音频',
          fail: '模拟音频图故障',
          prepare: '准备音频',
          source: '音频源',
          start: '开始',
          stop: '停止并释放',
          unavailable: '不可用的音频源',
        }
      : {
          load: hook === 'useWaveform' ? 'Generate waveform' : 'Load audio',
          fail: 'Simulate graph failure',
          prepare: 'Prepare audio',
          source: 'Audio source',
          start: 'Start',
          stop: 'Stop and release',
          unavailable: 'Unavailable source',
        }

  if (runsActiveGraph) {
    await demo.getByRole('button', { name: labels.prepare }).click()
    await waitForHookState(page, hook, 'ready')
    await demo.getByRole('button', { name: labels.start }).click()
    await waitForHookState(page, hook, 'playing')
    assert.equal(await demo.getAttribute('data-animation-active'), 'true')
    assert.equal(await demo.getAttribute('data-graph-connected'), 'true')
    assert.ok(Number(await demo.getAttribute('data-connection-count')) >= 1)

    await demo.getByRole('button', { name: labels.fail }).click()
    await waitForHookState(page, hook, 'error')
    assert.equal(await demo.getAttribute('data-animation-active'), 'false')
    assert.equal(await demo.getAttribute('data-graph-connected'), 'false')

    await demo.getByRole('button', { name: labels.prepare }).click()
    await waitForHookState(page, hook, 'ready')
    await demo.getByRole('button', { name: labels.start }).click()
    await waitForHookState(page, hook, 'playing')
    await demo.getByRole('button', { name: labels.stop }).click()
    await waitForHookState(page, hook, 'stopped')
    assert.equal(await demo.getAttribute('data-animation-active'), 'false')
    assert.equal(await demo.getAttribute('data-graph-connected'), 'false')

    await demo.getByRole('button', { name: labels.prepare }).click()
    await waitForHookState(page, hook, 'ready')
    await demo.getByRole('button', { name: labels.start }).click()
    await waitForHookState(page, hook, 'playing')
  } else {
    await demo.getByRole('button', { name: labels.load }).click()
    await waitForHookState(page, hook, 'ready')
    assert.equal(await demo.getAttribute('data-animation-active'), 'false')
    assert.equal(await demo.getAttribute('data-graph-connected'), 'false')
  }

  await demo.getByLabel(labels.source).selectOption('unavailable')
  await waitForHookState(page, hook, 'idle')
  assert.equal(await demo.getAttribute('data-animation-active'), 'false')
  assert.equal(await demo.getAttribute('data-graph-connected'), 'false')
  await demo.getByRole('button', { name: runsActiveGraph ? labels.prepare : labels.load }).click()
  await waitForHookState(page, hook, 'error')
  await demo.getByRole('alert').filter({ hasText: labels.unavailable }).waitFor({ state: 'visible' })
  assert.equal(await demo.getAttribute('data-animation-active'), 'false')
  assert.equal(await demo.getAttribute('data-graph-connected'), 'false')
}

const address = await listen()
assert.ok(address && typeof address === 'object')

const origin = `http://127.0.0.1:${address.port}`
let browser

try {
  browser = await launchBrowser()

  const runComponentRoute = async ({
    allowedBrowserErrors = [],
    apiSelector,
    demoSelector,
    exercise,
    route,
  }) => {
    console.log(`Smoke: ${route}`)
    const page = await browser.newPage()
    const browserErrors = []

    page.on('pageerror', (error) => browserErrors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') browserErrors.push(message.text())
    })

    try {
      const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' })
      assert.ok(response?.ok(), `${route} should return a successful browser response`)
      await page.locator(demoSelector).waitFor({ state: 'visible' })
      await page.locator(apiSelector).first().waitFor({ state: 'visible' })
      await exercise(page)
      const unexpectedBrowserErrors = browserErrors.filter(
        (message) => !allowedBrowserErrors.some((pattern) => pattern.test(message)),
      )
      assert.deepEqual(
        unexpectedBrowserErrors,
        [],
        `${route} should hydrate without unexpected browser errors`,
      )
    } finally {
      await page.close()
    }
  }

  for (const locale of locales) {
    for (const controller of controllers) {
      const route = `${basePath}/${locale}/component/${controller}/`
      await runComponentRoute({
        apiSelector: `[data-controller-api="${controller}"]`,
        demoSelector: `[data-controller-demo="${controller}"]`,
        exercise: (page) => exerciseDemo(page, controller, locale),
        route,
      })
    }

    for (const display of displays) {
      const route = `${basePath}/${locale}/component/${display}/`
      await runComponentRoute({
        apiSelector: `[data-display-api="${display}"]`,
        demoSelector: `[data-display-demo="${display}"]`,
        exercise: (page) => exerciseDisplay(page, display, locale),
        route,
      })
    }

    for (const hook of hooks) {
      const route = `${basePath}/${locale}/hook/${hook}/`
      await runComponentRoute({
        allowedBrowserErrors: [
          /^Echo UI: Error: Not Found/,
          /^Failed to load resource: the server responded with a status of 404/,
        ],
        apiSelector: `[data-hook-api="${hook}"]`,
        demoSelector: `[data-hook-demo="${hook}"]`,
        exercise: (page) => exerciseHook(page, hook, locale),
        route,
      })
    }
  }
} finally {
  await browser?.close()
  await closeServer()
}

console.log('Nextra browser smoke exercised bilingual components, Hooks, and audio lifecycle controls.')
