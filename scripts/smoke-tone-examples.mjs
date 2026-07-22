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
  const options = {
    args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
    headless: true,
  }
  if (channel) return chromium.launch({ ...options, channel })
  try {
    return await chromium.launch(options)
  } catch (bundledBrowserError) {
    try {
      return await chromium.launch({ ...options, channel: 'chrome' })
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

  const exerciseToggle = async ({ example, startName, stopName }) => {
    const demo = page.locator(`[data-audio-example="${example}"]`)
    await demo.waitFor({ state: 'visible' })
    await page.waitForFunction(
      ({ exampleName, name }) => {
        const section = document.querySelector(`[data-audio-example="${exampleName}"]`)
        const button = [...(section?.querySelectorAll('button') ?? [])].find(
          (candidate) => candidate.getAttribute('aria-label') === name,
        )
        return button instanceof HTMLButtonElement && !button.disabled
      },
      { exampleName: example, name: startName },
      { timeout: 5_000 },
    )
    await demo.getByRole('button', { name: startName }).click()
    await page.waitForFunction(
      (exampleName) =>
        document
          .querySelector(`[data-audio-example="${exampleName}"]`)
          ?.getAttribute('data-audio-state') !== 'stopped',
      example,
    )
    await demo.getByRole('button', { name: stopName }).click()
    await page.waitForFunction(
      (exampleName) =>
        document
          .querySelector(`[data-audio-example="${exampleName}"]`)
          ?.getAttribute('data-audio-state') === 'stopped',
      example,
    )
  }

  await exerciseToggle({
    example: 'spectrogram-filtered',
    startName: 'Start filtered spectrogram',
    stopName: 'Stop filtered spectrogram',
  })
  await exerciseToggle({
    example: 'spectrogram-default',
    startName: 'Start default spectrogram',
    stopName: 'Stop default spectrogram',
  })
  await exerciseToggle({
    example: 'vu-stereo',
    startName: 'Start stereo VU',
    stopName: 'Pause stereo VU',
  })
  await exerciseToggle({
    example: 'vu-mono',
    startName: 'Start mono VU',
    stopName: 'Pause mono VU',
  })
  await exerciseToggle({
    example: 'player-meter-slider',
    startName: 'Start player meter',
    stopName: 'Stop player meter',
  })
  await exerciseToggle({
    example: 'oscilloscope',
    startName: 'Start oscilloscope',
    stopName: 'Stop oscilloscope',
  })
  await exerciseToggle({
    example: 'waveform',
    startName: 'Start waveform',
    stopName: 'Pause waveform',
  })
  await exerciseToggle({
    example: 'microphone-vu',
    startName: 'Start microphone VU',
    stopName: 'Stop microphone VU',
  })

  await page.waitForTimeout(300)

  assert.deepEqual(browserErrors, [])
  await page.goto('about:blank')
  await page.close()
} finally {
  await browser?.close()
  await new Promise((resolveClose) => server.close(resolveClose))
}

console.log('Tone 15 migrated examples passed real-browser interaction and lifecycle smoke.')
