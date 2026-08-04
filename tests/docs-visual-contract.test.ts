import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { componentVariantInventory } from '../docs/app/_components/component-variants'

const repositoryRoot = resolve(import.meta.dirname, '..')
const readRepositoryFile = (path: string) => readFile(resolve(repositoryRoot, path), 'utf8')

interface CategoryContract {
  borderRadius: string
  borderWidth: string
  desktopWidth: number
  mobileWidth: number
  selector: string
}

interface VisualBaseline {
  categoryContracts: Record<'controller' | 'guide' | 'hook' | 'visualization', CategoryContract>
  profiles: string[]
  routes: Record<'controller' | 'guide' | 'home' | 'hook' | 'visualization', string>
  shell: {
    desktop: {
      articleWidth: number
      headerHeight: number
      sidebarWidth: number
      tocWidth: number
    }
    mobile: {
      contentWidth: number
      headerHeight: number
      menuHeight: number
    }
  }
  viewports: Record<'desktop' | 'mobile', { height: number; width: number }>
}

const loadBaseline = async () =>
  JSON.parse(
    await readRepositoryFile('docs/visual-baselines/island-v1.json'),
  ) as VisualBaseline

describe('maintained Island visual contract', () => {
  it('covers every required category in both themes and viewports', async () => {
    const baseline = await loadBaseline()

    expect(baseline.profiles).toEqual(
      ['desktop', 'mobile'].flatMap((viewport) =>
        ['light', 'dark'].map((theme) => `${viewport}-${theme}`),
      ),
    )
    expect(Object.keys(baseline.routes)).toEqual([
      'home',
      'guide',
      'controller',
      'visualization',
      'hook',
    ])
    expect(Object.keys(baseline.categoryContracts)).toEqual([
      'guide',
      'controller',
      'visualization',
      'hook',
    ])

    for (const contract of Object.values(baseline.categoryContracts)) {
      expect(contract.desktopWidth).toBe(baseline.shell.desktop.articleWidth)
      expect(contract.mobileWidth).toBe(baseline.shell.mobile.contentWidth)
      expect(contract.borderRadius).toBe('8px')
      expect(contract.borderWidth).toBe('1px')
    }
  })

  it('binds the measured shell geometry to the maintained docs CSS', async () => {
    const [baseline, theme] = await Promise.all([
      loadBaseline(),
      readRepositoryFile('docs/app/[lang]/island-theme.css'),
    ])

    expect(theme).toContain(
      `--island-nav-height-desktop: ${baseline.shell.desktop.headerHeight}px`,
    )
    expect(theme).toContain(
      `--island-nav-height-mobile: ${baseline.shell.mobile.headerHeight}px`,
    )
    expect(theme).toContain(`--island-sidebar-width: ${baseline.shell.desktop.sidebarWidth}px`)
    expect(theme).toContain(`width: ${baseline.shell.desktop.articleWidth}px`)
    expect(theme).toContain(`width: ${baseline.shell.desktop.tocWidth}px`)
    expect(theme).toContain('padding: 44px 16px 96px 24px')
    expect(theme).toContain('padding: 16px 16px 32px')
    expect(
      baseline.viewports.mobile.width - 24 - 16 - 16 - 16,
    ).toBe(baseline.shell.mobile.contentWidth)
    expect(theme).toContain(`height: ${baseline.shell.mobile.menuHeight}px`)
    expect(theme).toContain(baseline.categoryContracts.guide.selector)
  })

  it('binds route-specific markers and counts to live documentation renderers', async () => {
    const [baseline, matrix, hookDemo] = await Promise.all([
      loadBaseline(),
      readRepositoryFile('docs/app/_components/component-variant-matrix.tsx'),
      readRepositoryFile('docs/app/_components/hook-demo.tsx'),
    ])

    expect(matrix).toContain('data-component-variant-matrix={component}')
    expect(hookDemo).toContain('data-hook-demo={hook}')
    expect(componentVariantInventory.button).toHaveLength(
      Number(
        (baseline.categoryContracts.controller as CategoryContract & {
          variantCount: number
        }).variantCount,
      ),
    )
    expect(componentVariantInventory.spectrogram).toHaveLength(
      Number(
        (baseline.categoryContracts.visualization as CategoryContract & {
          variantCount: number
        }).variantCount,
      ),
    )

    for (const route of Object.values(baseline.routes)) {
      expect(route).toMatch(/^\/en\/(?:$|.+\/$)/)
    }
  })
})
