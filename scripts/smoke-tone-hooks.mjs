import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'
import react from '@vitejs/plugin-react'
import { createServer } from 'vite'

const packageRoot = resolve(import.meta.dirname, '..')
const fixtureRoot = resolve(packageRoot, 'tests', 'fixtures', 'tone-browser')
const server = await createServer({
  configFile: false,
  logLevel: 'error',
  plugins: [react()],
  resolve: {
    alias: { '@nafr/echo-ui': resolve(packageRoot, 'dist', 'echo-ui.js') },
  },
  root: fixtureRoot,
  server: { host: '127.0.0.1', port: 0 },
})

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
  await server.listen()
  const origin = server.resolvedUrls?.local[0]
  assert.ok(origin)
  browser = await launchBrowser()
  const page = await browser.newPage()
  const browserErrors = []
  page.on('pageerror', (error) => browserErrors.push(error.message))
  await page.addInitScript(() => {
    const activeFrames = new Set()
    const requestFrame = window.requestAnimationFrame.bind(window)
    const cancelFrame = window.cancelAnimationFrame.bind(window)
    window.requestAnimationFrame = (callback) => {
      let frameId = 0
      frameId = requestFrame((time) => {
        activeFrames.delete(frameId)
        callback(time)
      })
      activeFrames.add(frameId)
      return frameId
    }
    window.cancelAnimationFrame = (frameId) => {
      activeFrames.delete(frameId)
      cancelFrame(frameId)
    }
    window.__echoActiveAnimationFrames = () => activeFrames.size
  })
  await page.goto(origin, { waitUntil: 'networkidle' })
  await page.locator('[data-tone-harness="ready"]').waitFor()

  await page.evaluate(() => window.__echoToneHarness.initPlayer(0.5, 0.25))
  let playerState = await page.evaluate(() => window.__echoToneHarness.player())
  assert.equal(playerState.toneVersion, '15.1.22')
  assert.equal(playerState.instanceOfConsumerTone, true)

  await page.evaluate(() => window.__echoToneHarness.playPlayer())
  await page.waitForTimeout(80)
  await page.evaluate(() => window.__echoToneHarness.pausePlayer())
  playerState = await page.evaluate(() => window.__echoToneHarness.player())
  assert.ok(playerState.time > 0 && playerState.time < 0.5)
  const pausedAt = playerState.time
  await page.waitForTimeout(60)
  assert.ok(
    Math.abs((await page.evaluate(() => window.__echoToneHarness.player())).time - pausedAt) < 0.03,
  )

  await page.evaluate(() => window.__echoToneHarness.playPlayer())
  await page.evaluate(() => window.__echoToneHarness.seekPlayer(0.3))
  await page.waitForTimeout(40)
  playerState = await page.evaluate(() => window.__echoToneHarness.player())
  assert.ok(playerState.time >= 0.3)
  assert.ok(playerState.percentage >= 60)
  await page.evaluate(() => window.__echoToneHarness.stopPlayer())
  playerState = await page.evaluate(() => window.__echoToneHarness.player())
  assert.equal(playerState.time, 0)
  assert.equal(playerState.percentage, 0)

  await page.evaluate(() => window.__echoToneHarness.initPlayer(0.08, 0.5))
  assert.equal(
    (await page.evaluate(() => window.__echoToneHarness.player())).disposedReplacedPlayers,
    true,
  )
  await page.evaluate(() => window.__echoToneHarness.playPlayer())
  await page.waitForFunction(() => window.__echoToneHarness.player().isFinish, undefined, {
    timeout: 2_000,
  })
  playerState = await page.evaluate(() => window.__echoToneHarness.player())
  assert.equal(playerState.percentage, 100)

  await page.evaluate(() => window.__echoToneHarness.initAnalysis())
  await page.waitForFunction(
    () => {
      const analysis = window.__echoToneHarness.analysis()
      return analysis.oscilloscopeSamples > 0 && analysis.spectrogramSamples > 0
    },
    undefined,
    { timeout: 2_000 },
  )
  const analysis = await page.evaluate(() => window.__echoToneHarness.analysis())
  assert.equal(analysis.contextState, 'running')
  assert.ok(typeof analysis.meter === 'number' && !Number.isNaN(analysis.meter))
  assert.ok(
    Array.isArray(analysis.stereoMeter) &&
      analysis.stereoMeter.every((value) => typeof value === 'number' && !Number.isNaN(value)),
  )

  await page.evaluate(() => window.__echoToneHarness.setWaveform(1, 0.25))
  await page.waitForFunction(() => window.__echoToneHarness.waveform().length === 1)
  let waveform = await page.evaluate(() => window.__echoToneHarness.waveform())
  assert.ok(waveform.flat().every(Number.isFinite))
  await page.evaluate(() => window.__echoToneHarness.setWaveform(2, 0.5))
  await page.waitForFunction(() => window.__echoToneHarness.waveform().length === 2)
  waveform = await page.evaluate(() => window.__echoToneHarness.waveform())
  assert.equal(waveform[0][0], 0.5)
  assert.equal(waveform[1][0], 1)

  await page.evaluate(() => window.__echoToneHarness.release())
  await page.getByText('released').waitFor()
  await page.waitForFunction(
    () =>
      window.__echoReleasedNodes.every((node) => node.disposed) &&
      window.__echoActiveAnimationFrames() === 0,
  )
  assert.deepEqual(browserErrors, [])
  await page.close()
} finally {
  await browser?.close()
  await server.close()
}

console.log('Echo UI hooks passed Tone 15 real-browser behavior and lifecycle smoke.')
