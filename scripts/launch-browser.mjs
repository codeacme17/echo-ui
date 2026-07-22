import { chromium } from '@playwright/test'

export const launchBrowser = async () => {
  try {
    return await chromium.launch({ headless: true })
  } catch (bundledBrowserError) {
    try {
      return await chromium.launch({ channel: 'chrome', headless: true })
    } catch {
      throw new Error('Playwright could not launch Chromium or Chrome.', {
        cause: bundledBrowserError,
      })
    }
  }
}
