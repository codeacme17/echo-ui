import { hookNames } from './hook-manifest.mjs'

export const locales = /** @type {const} */ (['en', 'zh'])
export const guideRoutes = [
  'guide/introduction',
  'guide/installation',
  'guide/declaration',
  'guide/about',
]
export const controllerRoutes = [
  'button',
  'checkbox',
  'envelope',
  'input',
  'knob',
  'radio',
  'slider',
  'switch',
]
export const displayRoutes = [
  'lfo',
  'light',
  'oscilloscope',
  'spectrogram',
  'vumeter',
  'waveform',
  'card',
]
export const hookRoutes = hookNames.map((hook) => `hook/${hook}`)
export const componentRoutes = [...controllerRoutes, ...displayRoutes].map(
  (component) => `component/${component}`,
)
export const localizedContentRoutes = ['', ...guideRoutes, ...componentRoutes, ...hookRoutes]
export const publicRoutes = [
  '/',
  ...locales.flatMap((locale) =>
    localizedContentRoutes.map((route) => `/${locale}/${route ? `${route}/` : ''}`),
  ),
]
export const publicAssets = [
  '/logo.png',
  '/logo-light.png',
  '/temp.png',
  '/wechat.jpg',
  '/audios/demo-loop.mp3',
  ...Array.from({ length: 9 }, (_, index) => `/audios/loop-${index + 1}.mp3`),
]
export const legacyRedirects = locales.flatMap((locale) =>
  localizedContentRoutes.filter(Boolean).map((route) => {
    const legacyRoute = route
      .replace('component/envelope', 'component/Envelope')
      .replace('component/lfo', 'component/LFO')

    return {
      source: `/${locale}/${legacyRoute}.html`,
      target: `/${locale}/${route}/`,
    }
  }),
)
