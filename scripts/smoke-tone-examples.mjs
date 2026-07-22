import assert from 'node:assert/strict'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { chromium } from '@playwright/test'

const outputRoot = resolve(import.meta.dirname, '..', 'example', 'dist')
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
}

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
    const relativePath = pathname.replace(/^\/+/, '') || 'index.html'
    let outputFile = resolve(outputRoot, relativePath)
    assert.ok(outputFile === outputRoot || outputFile.startsWith(`${outputRoot}${sep}`))
    const fileStats = await stat(outputFile)
    if (fileStats.isDirectory()) outputFile = resolve(outputFile, 'index.html')
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(outputFile)] ?? 'application/octet-stream',
    })
    createReadStream(outputFile).pipe(response)
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
})

const address = await new Promise((resolveListen, reject) => {
  server.once('error', reject)
  server.listen(0, '127.0.0.1', () => resolveListen(server.address()))
})
assert.ok(address && typeof address === 'object')

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

let browser
try {
  browser = await launchBrowser()
  const page = await browser.newPage()
  const browserErrors = []
  page.on('pageerror', (error) => browserErrors.push(error.message))
  await page.goto(`http://127.0.0.1:${address.port}`, { waitUntil: 'domcontentloaded' })

  const lfo = page.locator('[data-audio-example="lfo"]')
  await lfo.waitFor({ state: 'visible' })
  assert.equal(await lfo.getAttribute('data-tone-version'), '15.1.22')
  for (let cycle = 0; cycle < 2; cycle += 1) {
    await lfo.getByRole('button', { name: 'Start LFO' }).click()
    await page.waitForFunction(
      () =>
        document.querySelector('[data-audio-example="lfo"]')?.getAttribute('data-audio-state') ===
        'playing',
    )
    assert.equal(await lfo.getAttribute('data-audio-state'), 'playing')
    await lfo.getByRole('button', { name: 'Stop LFO' }).click()
    assert.equal(await lfo.getAttribute('data-audio-state'), 'stopped')
  }

  const adsr = page.locator('[data-audio-example="envelope-adsr"]')
  const adsrTrigger = adsr.getByRole('button', { name: 'Hold ADSR envelope' })
  for (let cycle = 0; cycle < 2; cycle += 1) {
    await adsrTrigger.dispatchEvent('mousedown')
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-audio-example="envelope-adsr"]')
          ?.getAttribute('data-audio-state') === 'playing',
    )
    await adsrTrigger.dispatchEvent('mouseup')
    assert.equal(await adsr.getAttribute('data-audio-state'), 'stopped')
  }

  const ahdsr = page.locator('[data-audio-example="envelope-ahdsr"]')
  const ahdsrTrigger = ahdsr.getByRole('button', { name: 'Trigger AHDSR envelope' })
  await ahdsrTrigger.dispatchEvent('mousedown')
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-audio-example="envelope-ahdsr"]')
        ?.getAttribute('data-audio-state') === 'scheduled',
  )
  await ahdsrTrigger.dispatchEvent('mousedown')
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-audio-example="envelope-ahdsr"]')
        ?.getAttribute('data-audio-state') === 'stopped',
    undefined,
    { timeout: 3_000 },
  )

  assert.deepEqual(browserErrors, [])
  await page.close()
} finally {
  await browser?.close()
  await new Promise((resolveClose) => server.close(resolveClose))
}

console.log('Tone 15 LFO and envelope examples passed real-browser lifecycle smoke.')
