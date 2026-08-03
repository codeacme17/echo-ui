import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cleanup, render } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { ComponentVariantMatrix } from '../docs/app/_components/component-variant-matrix'
import type {
  ComponentWithVariants,
  DocumentationLocale,
} from '../docs/app/_components/component-variants'
import { restoreDocsDomObservers, stubDocsDomObservers } from './docs-dom-observers'

const repositoryRoot = resolve(import.meta.dirname, '..')

const expectedLocalizedVariants = {
  button: {
    en: ['Default', 'Toggle State', 'Disabled State', 'Size', 'Rounded Corners', 'Button Group'],
    zh: ['默认', '切换状态', '禁用状态', '尺寸', '圆角', '按钮组'],
  },
  card: {
    en: ['Default', 'Active State', 'Real-World Scenario'],
    zh: ['默认', '激活状态', '实际场景'],
  },
  checkbox: {
    en: ['Default', 'Disabled State', 'Size', 'Color', 'Checkbox Group'],
    zh: ['默认', '禁用状态', '尺寸', '颜色', '多选组'],
  },
  envelope: {
    en: ['ADSR Envelope', 'AHDSR Envelope', 'Delay'],
    zh: ['ADSR 包络', 'AHDSR 包络', 'Delay 延迟'],
  },
  input: {
    en: [
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
    zh: [
      '默认',
      '禁用状态',
      '双边模式',
      '文本模式',
      '尺寸',
      '圆角',
      '进度条颜色',
      '最小值与最大值',
      '步进与灵敏度',
    ],
  },
  knob: {
    en: [
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
    zh: [
      '默认',
      '禁用状态',
      '双向旋转模式',
      '旋转角度范围',
      '标签',
      '步进与灵敏度',
      '尺寸相关',
      '颜色相关',
      '旋钮组',
    ],
  },
  lfo: {
    en: ['Default', 'Delay'],
    zh: ['默认', '延迟设置'],
  },
  light: {
    en: ['Default', 'On State', 'Light Color', 'Size'],
    zh: ['默认', '开启状态', '灯光颜色', '尺寸'],
  },
  oscilloscope: {
    en: ['Default'],
    zh: ['默认'],
  },
  radio: {
    en: ['Default', 'Disabled State', 'Size', 'Color', 'Radio Group'],
    zh: ['默认', '禁用状态', '尺寸', '颜色', '单选组'],
  },
  slider: {
    en: [
      'Default',
      'Disabled State',
      'Vertical Mode',
      'Bilateral Mode',
      'Adding Coordinates',
      'Step',
      'Custom Styling',
      'Uncontrolled Mode',
    ],
    zh: ['默认', '禁用状态', '垂直模式', '双向模式', '加入坐标', '步进', '自定义样式', '非控模式'],
  },
  spectrogram: {
    en: ['Audio Data', 'Axis', 'Grid', 'Use Case: EQ3'],
    zh: ['音频数据', '坐标轴', '网格', '应用场景：EQ3'],
  },
  switch: {
    en: ['Default', 'Toggled State', 'Disabled State', 'Size', 'Custom Styling'],
    zh: ['默认', '开启状态', '禁用状态', '尺寸', '自定义样式'],
  },
  vumeter: {
    en: [
      'Default',
      'Horizontal Mode',
      'Stereo Mode',
      'Compact Mode',
      'Number of Volume Bars',
      'Custom Colors',
    ],
    zh: ['默认', '水平模式', '双声道模式', '紧凑模式', '音量条数量', '自定义颜色'],
  },
  waveform: {
    en: ['Default'],
    zh: ['默认'],
  },
} as const satisfies Record<
  ComponentWithVariants,
  Readonly<Record<DocumentationLocale, readonly string[]>>
>

const cases = (Object.keys(expectedLocalizedVariants) as ComponentWithVariants[]).flatMap(
  (component) =>
    (['en', 'zh'] as const).map((lang) => ({
      component,
      expectedLabels: expectedLocalizedVariants[component][lang],
      lang,
    })),
)

beforeAll(() => {
  vi.useFakeTimers()
  stubDocsDomObservers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
})
afterAll(() => {
  vi.useRealTimers()
  restoreDocsDomObservers()
})

describe('localized component documentation routes', () => {
  it.each(cases)(
    '$lang/component/$component mounts its exact localized variant matrix',
    async ({ component, expectedLabels, lang }) => {
      const routeSource = await readFile(
        resolve(repositoryRoot, `docs/content/${lang}/component/${component}.mdx`),
        'utf8',
      )
      expect(routeSource).toContain(
        `<ComponentVariantMatrix component="${component}" lang="${lang}" />`,
      )

      const { container } = render(<ComponentVariantMatrix component={component} lang={lang} />)
      const matrix = container.querySelector(`[data-component-variant-matrix="${component}"]`)
      expect(matrix?.getAttribute('data-documentation-locale')).toBe(lang)
      expect(matrix?.getAttribute('data-variant-count')).toBe(String(expectedLabels.length))
      expect(
        [...(matrix?.querySelectorAll('[data-example-label]') ?? [])].map((example) =>
          example.getAttribute('data-example-label'),
        ),
      ).toEqual(expectedLabels)
    },
  )
})
