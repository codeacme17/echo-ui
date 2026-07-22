import { describe, expect, it } from 'vitest'
import {
  legacyRedirects,
  locales,
  localizedContentRoutes,
  publicAssets,
  publicRoutes,
} from '../docs-nextra/route-manifest.mjs'

const expectedLocalizedRoutes = [
  '',
  'guide/introduction',
  'guide/installation',
  'guide/declaration',
  'guide/about',
  'component/button',
  'component/checkbox',
  'component/envelope',
  'component/input',
  'component/knob',
  'component/radio',
  'component/slider',
  'component/switch',
  'component/lfo',
  'component/light',
  'component/oscilloscope',
  'component/spectrogram',
  'component/vumeter',
  'component/waveform',
  'component/card',
  'hook/useFetchAudio',
  'hook/useOscilloscope',
  'hook/usePlayer',
  'hook/useSpectrogram',
  'hook/useVuMeter',
  'hook/useWaveform',
]

describe('documentation route inventory', () => {
  it('preserves every bilingual public page and its legacy HTML URL', () => {
    expect(locales).toEqual(['en', 'zh'])
    expect(localizedContentRoutes).toEqual(expectedLocalizedRoutes)
    expect(publicRoutes).toEqual([
      '/',
      ...locales.flatMap((locale) =>
        expectedLocalizedRoutes.map((route) => `/${locale}/${route ? `${route}/` : ''}`),
      ),
    ])
    expect(legacyRedirects).toEqual(
      locales.flatMap((locale) =>
        expectedLocalizedRoutes.filter(Boolean).map((route) => {
          const legacyRoute = route
            .replace('component/envelope', 'component/Envelope')
            .replace('component/lfo', 'component/LFO')

          return {
            source: `/${locale}/${legacyRoute}.html`,
            target: `/${locale}/${route}/`,
          }
        }),
      ),
    )
  })

  it('preserves the public asset and audio URLs from the legacy site', () => {
    expect(publicAssets).toEqual([
      '/logo.png',
      '/logo-light.png',
      '/temp.png',
      '/wechat.jpg',
      '/audios/demo-loop.mp3',
      ...Array.from({ length: 9 }, (_, index) => `/audios/loop-${index + 1}.mp3`),
    ])
  })
})
