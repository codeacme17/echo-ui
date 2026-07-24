import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { componentVariantInventory } from '../docs/app/_components/component-variants'

const repositoryRoot = resolve(import.meta.dirname, '..')
const readRepositoryFile = (path: string) => readFile(resolve(repositoryRoot, path), 'utf8')

describe('Island documentation parity', () => {
  it('routes the root directly to the default English documentation', async () => {
    const rootPage = await readRepositoryFile('docs/app/(landing)/page.tsx')

    expect(rootPage).toContain("permanentRedirect('/en/')")
    expect(rootPage).not.toContain('Choose your documentation language')
  })

  it.each(['en', 'zh'] as const)(
    'restores the %s Island links, guide grouping, and page affordances',
    async (lang) => {
      const [meta, guideMeta, layout, theme] = await Promise.all([
        readRepositoryFile(`docs/content/${lang}/_meta.ts`),
        readRepositoryFile(`docs/content/${lang}/guide/_meta.ts`),
        readRepositoryFile('docs/app/[lang]/layout.tsx'),
        readRepositoryFile('docs/app/[lang]/island-theme.css'),
      ])

      expect(meta).toContain("github: {\n        href: 'https://github.com/codeacme17/echo-ui'")
      expect(meta).toContain("discord: {\n        href: 'https://discord.gg/R9JX9twvXF'")
      expect(meta).toContain("twitter: {\n        href: 'https://twitter.com/codeacme17'")
      expect(meta).not.toMatch(/discussions:|issues:/)

      expect(guideMeta).toContain("type: 'separator'")
      expect(guideMeta).toContain(lang === 'zh' ? "title: '指南'" : "title: 'Guide'")
      expect(guideMeta).toContain(lang === 'zh' ? "title: '关于'" : "title: 'About'")

      expect(layout).toContain('editLink=')
      expect(layout).not.toContain('editLink={null}')
      expect(layout).not.toContain('navigation={false}')
      expect(theme).not.toContain('footer {\n  display: none')
      expect(theme).not.toContain('.nextra-sidebar-footer {\n  display: none')
    },
  )

  it.each(['en', 'zh'] as const)(
    'preserves the %s guide hierarchy and community content',
    async (lang) => {
      const [introduction, about, declaration] = await Promise.all([
        readRepositoryFile(`docs/content/${lang}/guide/introduction.mdx`),
        readRepositoryFile(`docs/content/${lang}/guide/about.mdx`),
        readRepositoryFile(`docs/content/${lang}/guide/declaration.mdx`),
      ])

      const features = introduction.match(/^- \*\*.+\*\*[:：]/gm) ?? []
      expect(features).toHaveLength(5)
      expect(introduction).not.toMatch(/^### /m)
      expect(about).toContain('/wechat.jpg')
      expect(about).toMatch(/WeChat/)
      expect(declaration).toMatch(
        lang === 'zh' ? /每个页面.*编辑链接|编辑链接.*每个页面/ : /edit link on each page/,
      )
    },
  )

  it('keeps every legacy component variant in the shared live-example inventory', () => {
    const expectedLabels = {
      button: [
        'Default',
        'Toggle State',
        'Disabled State',
        'Size',
        'Rounded Corners',
        'Button Group',
      ],
      checkbox: ['Default', 'Disabled State', 'Size', 'Color', 'Checkbox Group'],
      envelope: ['ADSR Envelope', 'AHDSR Envelope', 'Delay'],
      input: [
        'Default',
        'Disabled State',
        'Bilateral Mode',
        'Text Mode',
        'Size',
        'Rounded Corners',
        'Progress Bar Color',
        'Minimum and Maximum Values',
        'Step and Sensitivity',
      ],
      knob: [
        'Default',
        'Disabled',
        'Bilateral Rotation Mode',
        'Rotation Angle Range',
        'Labels',
        'Step and Sensitivity',
        'Size-Related',
        'Color-Related',
        'Knob Group',
      ],
      radio: ['Default', 'Disabled State', 'Size', 'Color', 'Radio Group'],
      slider: [
        'Default',
        'Disabled State',
        'Vertical Mode',
        'Bilateral Mode',
        'Adding Coordinates',
        'Step',
        'Custom Styling',
        'Uncontrolled Mode',
      ],
      switch: ['Default', 'Toggled State', 'Disabled State', 'Size', 'Custom Styling'],
      lfo: ['Default', 'Delay'],
      light: ['Default', 'On State', 'Light Color', 'Size'],
      oscilloscope: ['Default'],
      spectrogram: ['Audio Data', 'Axis', 'Grid', 'Use Case: EQ3'],
      vumeter: [
        'Default',
        'Horizontal Mode',
        'Stereo Mode',
        'Compact Mode',
        'Number of Volume Bars',
        'Custom Colors',
      ],
      waveform: ['Default'],
      card: ['Default', 'Active State', 'Real-World Scenario'],
    }

    expect(
      Object.fromEntries(
        Object.entries(componentVariantInventory).map(([component, variants]) => [
          component,
          variants.map((variant) => variant.label.en),
        ]),
      ),
    ).toEqual(expectedLabels)

    for (const variants of Object.values(componentVariantInventory)) {
      for (const variant of variants) {
        expect(variant.label.zh).not.toBe('')
        expect(variant.source).toMatch(/^</)
      }
    }
  })

  it('auto-hydrates graph previews and binds every typed variant to a renderer', async () => {
    const matrix = await readRepositoryFile('docs/app/_components/component-variant-matrix.tsx')

    expect(matrix).toContain('useDelayedGraphData')
    expect(matrix).toContain("data={id === 'eq3' ? eq3Spectrum : spectrum}")
    expect(matrix).toContain('satisfies VariantRendererMap')
    expect(matrix).not.toContain('Render sample spectrum')
    expect(matrix).not.toContain('Render sample waveform')
  })

  it('uses the Island API column order and exposes representative runtime data attributes', async () => {
    const [apiReference, controllerApi, displayApi] = await Promise.all([
      readRepositoryFile('docs/app/_components/api-reference.tsx'),
      readRepositoryFile('docs/app/_components/controller-api.tsx'),
      readRepositoryFile('docs/app/_components/display-api.tsx'),
    ])

    expect(apiReference).toMatch(
      /localeLabels\.name[\s\S]+localeLabels\.description[\s\S]+localeLabels\.type[\s\S]+localeLabels\.defaultValue/,
    )
    expect(controllerApi).toMatch(/<DataAttributes[^>]+component=\{controller\}[^>]+lang=\{lang\}/)
    expect(controllerApi).toContain("'data-dragging'")
    expect(controllerApi).toContain("'data-direction'")
    expect(displayApi).toMatch(/<DataAttributes[^>]+component=\{display\}[^>]+lang=\{lang\}/)
    expect(displayApi).toContain("'data-active'")
    expect(displayApi).toContain("'data-toggled'")
  })

  it('uses a maintained Island visual baseline across every required category and profile', async () => {
    const [baselineSource, verifier] = await Promise.all([
      readRepositoryFile('docs/visual-baselines/island-v1.json'),
      readRepositoryFile('scripts/verify-docs-ui.mjs'),
    ])
    const baseline = JSON.parse(baselineSource) as {
      categoryContracts: Record<string, unknown>
      profiles: string[]
      routes: Record<string, string>
      source: { commit: string }
    }

    expect(baseline.source.commit).toBe('86f2008^')
    expect(baseline.profiles).toEqual([
      'desktop-light',
      'desktop-dark',
      'mobile-light',
      'mobile-dark',
    ])
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
    expect(verifier).toContain('visual-baselines/island-v1.json')
    expect(verifier).toContain('baseline.categoryContracts')
  })

  it('removes example transitions for reduced-motion users', async () => {
    const exampleStyles = await readRepositoryFile('docs/app/_components/example-frame.module.css')

    expect(exampleStyles).toContain('@media (prefers-reduced-motion: reduce)')
    expect(exampleStyles).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]+transition: none/,
    )
  })
})
