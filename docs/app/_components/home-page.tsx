import Link from 'next/link'

type Locale = 'en' | 'zh'

type HomePageProps = Readonly<{
  locale: Locale
}>

const content = {
  en: {
    actions: {
      primary: 'Get Started',
      secondary: 'GitHub',
    },
    features: [
      {
        description: 'Easily build an audio interaction app with simple configurations',
        icon: '📦',
        title: 'Out-of-the-Box',
      },
      {
        description:
          'Most components are inspired by Ableton Live, providing a better user experience',
        icon: '🎛️',
        title: 'High-Quality Interactions',
      },
      {
        description:
          'Built with React and TailwindCSS, making it easy to customize themes and extend components',
        icon: '✨',
        title: 'Customizable & Easily Extensible',
      },
      {
        description: 'Hook specially designed for audio interaction and analysis applications.',
        icon: '🛠️',
        title: 'Easy-to-use Hook',
      },
      {
        description:
          'All components support responsive layout and can easily adapt to different screen sizes.',
        icon: '📈',
        title: 'Responsive layout',
      },
      {
        description: 'Coming soon',
        icon: '📱',
        title: 'Mobile friendly',
      },
    ],
    tagline: 'Built with React and TailwindCSS',
    title: 'A UI library born for WAA',
  },
  zh: {
    actions: {
      primary: '快速开始',
      secondary: 'GitHub',
    },
    features: [
      {
        description: '只需要简单的配置，就可以轻松构建一款音频交互应用',
        icon: '📦',
        title: '开箱即用',
      },
      {
        description: '大部分组件的交互灵感来自于 Ableton Live，可以提供更好的用户体验',
        icon: '🎛️',
        title: '优质交互',
      },
      {
        description: '基于 React 与 TailwindCSS，可以轻松定制主题或扩展组件',
        icon: '✨',
        title: '可定制 & 易于扩展',
      },
      {
        description: '专门为音频交互、解析而应用设计的 Hook，可以轻松实现音频交互应用',
        icon: '🛠️',
        title: '简便易用的 Hook',
      },
      {
        description: '全部组件都支持响应式布局，可以轻松适配不同的屏幕尺寸',
        icon: '📈',
        title: '响应式布局',
      },
      {
        description: '即将到来',
        icon: '📱',
        title: '移动端友好',
      },
    ],
    tagline: '使用 React 和 TailwindCSS 构建',
    title: '一款为 WAA 而生的 UI 组件库',
  },
} as const

const basePath = process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? ''

export function HomePage({ locale }: HomePageProps) {
  const copy = content[locale]

  return (
    <div className="echo-home">
      <section className="echo-home__hero">
        <div className="echo-home__hero-copy">
          <h1 className="echo-home__title">
            <span>Echo UI</span>
          </h1>
          <p className="echo-home__hero-text">{copy.title}</p>
          <p className="echo-home__tagline">{copy.tagline}</p>
          <div className="echo-home__actions">
            <Link
              className="echo-home__action echo-home__action--primary"
              href={`/${locale}/guide/introduction`}
            >
              {copy.actions.primary}
            </Link>
            <a
              className="echo-home__action echo-home__action--secondary"
              href="https://github.com/codeacme17/echo-ui"
            >
              {copy.actions.secondary}
            </a>
          </div>
        </div>
        <picture className="echo-home__image">
          <img alt="Echo UI" height="256" src={`${basePath}/logo.png`} width="256" />
        </picture>
      </section>

      <section aria-label={locale === 'zh' ? '特性' : 'Features'} className="echo-home__features">
        {copy.features.map((feature) => (
          <article className="echo-home__feature" key={feature.title}>
            <div aria-hidden="true">{feature.icon}</div>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
