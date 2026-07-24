import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Browser, BrowserContext } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  closeStaticServer,
  createDocsStaticServer,
  listenOnRandomPort,
} from '../scripts/docs-static-server.mjs'
import { launchBrowser } from '../scripts/launch-browser.mjs'

const repositoryRoot = resolve(import.meta.dirname, '..')
const baselinePath = resolve(repositoryRoot, 'docs/visual-baselines/island-v1.json')

interface CategoryContract {
  borderRadius: string
  borderWidth: string
  desktopWidth: number
  iconCount?: number
  minimumHeight?: number
  mobileWidth: number
  renderedGraphCount?: number
  selector: string
  statusCount?: number
  tabCount?: number
  variantCount?: number
}

interface VisualBaseline {
  categoryContracts: Record<'controller' | 'guide' | 'hook' | 'visualization', CategoryContract>
  profiles: string[]
  routes: Record<'controller' | 'guide' | 'home' | 'hook' | 'visualization', string>
  viewports: Record<'desktop' | 'mobile', { height: number; width: number }>
}

let browser: Browser
let server: ReturnType<typeof createDocsStaticServer>
let serverOrigin: string

beforeAll(async () => {
  execFileSync('pnpm', ['build:docs'], {
    cwd: repositoryRoot,
    maxBuffer: 10 * 1024 * 1024,
    stdio: 'pipe',
  })
  server = createDocsStaticServer()
  const address = await listenOnRandomPort(server)
  if (!address || typeof address === 'string') throw new Error('Docs server did not bind to TCP.')
  serverOrigin = `http://127.0.0.1:${address.port}`
  browser = await launchBrowser()
}, 120_000)

afterAll(async () => {
  await browser?.close()
  if (server) await closeStaticServer(server)
}, 30_000)

describe('rendered Island visual baseline', () => {
  it(
    'matches representative routes in both locales, themes, and viewports',
    async () => {
      const baseline = JSON.parse(await readFile(baselinePath, 'utf8')) as VisualBaseline

      for (const profile of baseline.profiles) {
        const [viewportName, colorScheme] = profile.split('-') as [
          'desktop' | 'mobile',
          'dark' | 'light',
        ]
        let context: BrowserContext | undefined

        try {
          context = await browser.newContext({
            colorScheme,
            viewport: baseline.viewports[viewportName],
          })
          const page = await context.newPage()

          for (const lang of ['en', 'zh'] as const) {
            for (const [category, englishRoute] of Object.entries(baseline.routes)) {
              const route = englishRoute.replace('/en/', `/${lang}/`)
              const response = await page.goto(`${serverOrigin}${route}`, {
                waitUntil: 'load',
              })

              expect(response?.ok(), `${profile} ${lang} ${category} should render`).toBe(true)

              if (category === 'home') {
                await page.waitForSelector('.echo-home')
                const home = await page.evaluate(() => ({
                  clientWidth: document.documentElement.clientWidth,
                  featureCount: document.querySelectorAll('.echo-home__feature').length,
                  hasHome: Boolean(document.querySelector('.echo-home')),
                  menuDisplay: getComputedStyle(
                    document.querySelector('.island-mobile-menu') as Element,
                  ).display,
                  scrollWidth: document.documentElement.scrollWidth,
                }))
                expect(home.hasHome).toBe(true)
                expect(home.featureCount).toBe(6)
                expect(home.menuDisplay).toBe('none')
                expect(home.scrollWidth).toBeLessThanOrEqual(home.clientWidth)
                continue
              }

              const contract =
                baseline.categoryContracts[
                  category as keyof VisualBaseline['categoryContracts']
                ]
              await page.waitForSelector(contract.selector)
              if (category === 'visualization') {
                await page.waitForFunction(
                  (expected) =>
                    document.querySelectorAll(
                      '[data-component-variant-matrix="spectrogram"] section [role="tabpanel"] svg',
                    ).length >= expected,
                  contract.renderedGraphCount,
                )
              }

              const rendered = await page.evaluate(
                ({ currentCategory, selector }) => {
                  const marker = document.querySelector(selector)
                  const bounds = marker?.getBoundingClientRect()
                  const style = marker ? getComputedStyle(marker) : undefined
                  return {
                    borderRadius: style?.borderRadius,
                    borderWidth: style?.borderWidth,
                    clientWidth: document.documentElement.clientWidth,
                    graphCount:
                      currentCategory === 'visualization'
                        ? document.querySelectorAll(
                            '[data-component-variant-matrix="spectrogram"] section [role="tabpanel"] svg',
                          ).length
                        : undefined,
                    height: bounds?.height,
                    iconCount:
                      currentCategory === 'guide'
                        ? [
                            ...document.querySelectorAll(
                              'article main .nextra-callout svg',
                            ),
                          ].filter(
                            (icon) =>
                              getComputedStyle(icon).display !== 'none' &&
                              icon.getClientRects().length > 0,
                          ).length
                        : undefined,
                    lang: document.documentElement.lang,
                    scrollWidth: document.documentElement.scrollWidth,
                    statusCount:
                      currentCategory === 'hook'
                        ? document.querySelectorAll(
                            'section[data-hook-demo="usePlayer"] > header > p',
                          ).length
                        : undefined,
                    tabCount:
                      currentCategory === 'controller'
                        ? document.querySelectorAll(
                            '[data-component-variant-matrix="button"] [role="tab"]',
                          ).length
                        : undefined,
                    theme: document.documentElement.className,
                    variantCount:
                      currentCategory === 'controller'
                        ? document.querySelectorAll(
                            '[data-component-variant-matrix="button"] section',
                          ).length
                        : currentCategory === 'visualization'
                          ? document.querySelectorAll(
                              '[data-component-variant-matrix="spectrogram"] section',
                            ).length
                          : undefined,
                    width: bounds?.width,
                  }
                },
                { currentCategory: category, selector: contract.selector },
              )

              expect(rendered.lang).toBe(lang)
              expect(rendered.theme).toMatch(new RegExp(`\\b${colorScheme}\\b`))
              expect(rendered.scrollWidth).toBeLessThanOrEqual(rendered.clientWidth)
              expect(rendered.width).toBeCloseTo(
                viewportName === 'desktop' ? contract.desktopWidth : contract.mobileWidth,
                0,
              )
              expect(rendered.borderRadius).toBe(contract.borderRadius)
              expect(rendered.borderWidth).toBe(contract.borderWidth)
              if (contract.minimumHeight) {
                expect(rendered.height).toBeGreaterThanOrEqual(contract.minimumHeight)
              }
              if (contract.iconCount !== undefined) {
                expect(rendered.iconCount).toBe(contract.iconCount)
              }
              if (contract.statusCount !== undefined) {
                expect(rendered.statusCount).toBe(contract.statusCount)
              }
              if (contract.tabCount !== undefined) {
                expect(rendered.tabCount).toBe(contract.tabCount)
              }
              if (contract.variantCount !== undefined) {
                expect(rendered.variantCount).toBe(contract.variantCount)
              }
              if (contract.renderedGraphCount !== undefined) {
                expect(rendered.graphCount).toBeGreaterThanOrEqual(contract.renderedGraphCount)
              }
            }
          }
        } finally {
          await context?.close()
        }
      }
    },
    180_000,
  )
})
