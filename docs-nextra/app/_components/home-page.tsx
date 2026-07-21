import Link from 'next/link'

type Locale = 'en' | 'zh'

type HomePageProps = Readonly<{
  locale: Locale
}>

const content = {
  en: {
    actions: {
      primary: 'Read the guide',
      secondary: 'View on GitHub',
    },
    description:
      'Accessible React controls and visualizations for building focused, expressive audio experiences in the browser.',
    eyebrow: 'React components for Web Audio',
    featureHeading: 'Made for the signal path',
    featureIntro:
      'Echo UI brings familiar audio interaction patterns to the web without turning your interface into a generic dashboard.',
    features: [
      {
        description: 'Start with controls, meters, scopes, and waveforms designed for audio workflows.',
        title: 'Out of the box',
      },
      {
        description: 'Interactions borrow from instruments and digital audio workstations, not form builders.',
        title: 'Purposeful interaction',
      },
      {
        description: 'Tune the visual system with CSS variables and Tailwind theme tokens.',
        title: 'Designed to adapt',
      },
      {
        description: 'Hooks cover playback, loading, envelopes, meters, waveforms, scopes, and spectra.',
        title: 'Audio-aware hooks',
      },
      {
        description: 'Components respond to the space available to them across desktop and compact layouts.',
        title: 'Responsive by default',
      },
    ],
    kicker: 'Open source · MIT licensed',
    title: 'A UI library born for Web Audio',
  },
  zh: {
    actions: {
      primary: '阅读指南',
      secondary: '在 GitHub 上查看',
    },
    description: '为浏览器中专注、富有表现力的音频体验提供无障碍 React 控件与可视化组件。',
    eyebrow: '面向 Web Audio 的 React 组件',
    featureHeading: '为信号链路而设计',
    featureIntro:
      'Echo UI 将熟悉的音频交互方式带到 Web，同时保留每个声音工具应有的个性。',
    features: [
      {
        description: '直接使用为音频工作流设计的控件、电平表、示波器和波形图。',
        title: '开箱即用',
      },
      {
        description: '交互灵感来自乐器和数字音频工作站，而不是通用表单。',
        title: '专注的交互',
      },
      {
        description: '通过 CSS 变量和 Tailwind 主题 token 调整视觉系统。',
        title: '可定制、易扩展',
      },
      {
        description: 'Hook 覆盖播放、加载、包络、电平、波形、示波和频谱分析。',
        title: '懂音频的 Hook',
      },
      {
        description: '组件会根据可用空间调整，适应桌面和紧凑布局。',
        title: '默认响应式',
      },
    ],
    kicker: '开源 · MIT 许可',
    title: '为 Web Audio 而生的 UI 组件库',
  },
} as const

export function HomePage({ locale }: HomePageProps) {
  const copy = content[locale]

  return (
    <div className="echo-home">
      <section className="echo-home__hero" aria-labelledby="echo-home-title">
        <div className="echo-home__signal" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="echo-home__hero-copy">
          <p className="echo-home__eyebrow">
            <span aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <h1 id="echo-home-title">{copy.title}</h1>
          <p className="echo-home__lead">{copy.description}</p>
          <div className="echo-home__actions">
            <Link className="echo-home__action echo-home__action--primary" href={`/${locale}/guide/introduction`}>
              {copy.actions.primary}
              <span aria-hidden="true">↗</span>
            </Link>
            <a
              className="echo-home__action echo-home__action--secondary"
              href="https://github.com/codeacme17/echo-ui"
            >
              {copy.actions.secondary}
            </a>
          </div>
        </div>
        <p className="echo-home__kicker">{copy.kicker}</p>
      </section>

      <section className="echo-home__features" aria-labelledby="echo-home-features">
        <header>
          <p>01 — 05</p>
          <div>
            <h2 id="echo-home-features">{copy.featureHeading}</h2>
            <p>{copy.featureIntro}</p>
          </div>
        </header>
        <ol>
          {copy.features.map((feature, index) => (
            <li key={feature.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
