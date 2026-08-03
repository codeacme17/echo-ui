import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Footer, Layout, LocaleSwitch, Navbar, ThemeSwitch } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import type { FC, ReactNode } from 'react'
import '@nafr/echo-ui/style.css'
import { IslandMobileMenu } from '../_components/island-mobile-menu'
import './styles.css'
import './island-theme.css'

export const metadata: Metadata = {
  description: 'A high-performance UI framework designed for the Web Audio API.',
  metadataBase: new URL('https://echoui.dev'),
  title: {
    default: 'Echo UI',
    template: '%s | Echo UI',
  },
}

type LayoutProps = Readonly<{
  children: ReactNode
  params: Promise<{
    lang: string
  }>
}>

const messagesByLocale = {
  en: {
    copyright: 'Copyright © 2023-present leyoonafr',
    edit: '📝 Edit this page on GitHub',
    footer: 'Released under the MIT License.',
    name: 'English',
    search: 'Search',
    toc: {
      backToTop: 'Back to top',
      title: 'On this page',
    },
    themeSwitch: {
      dark: 'Dark',
      light: 'Light',
      system: 'System',
    },
  },
  zh: {
    copyright: 'Copyright © 2023-present leyoonafr',
    edit: '📝 在 GitHub 上编辑此页',
    footer: '基于 MIT 许可证发布。',
    name: '简体中文',
    search: '搜索',
    toc: {
      backToTop: '返回顶部',
      title: '本页目录',
    },
    themeSwitch: {
      dark: '深色',
      light: '浅色',
      system: '跟随系统',
    },
  },
} as const

const locales = Object.entries(messagesByLocale).map(([locale, messages]) => ({
  locale,
  name: messages.name,
}))

const RootLayout: FC<LayoutProps> = async ({ children, params }) => {
  const { lang } = await params
  const messages = messagesByLocale[lang as keyof typeof messagesByLocale] ?? messagesByLocale.en
  const navbar = (
    <Navbar logo={<strong className="echo-docs-logo">Echo UI</strong>} logoLink={`/${lang}`}>
      <LocaleSwitch className="island-locale-switch" lite />
      <ThemeSwitch className="island-theme-switch" lite />
    </Navbar>
  )
  const search = (
    <div className="island-search">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </svg>
      <Search placeholder={messages.search} />
    </div>
  )
  const footer = (
    <Footer>
      <span>{messages.footer}</span>
      <span>{messages.copyright}</span>
    </Footer>
  )

  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <Head
        color={{
          hue: 38,
          saturation: 98,
          lightness: { dark: 62, light: 48 },
        }}
      />
      <body>
        <Layout
          copyPageButton={false}
          docsRepositoryBase="https://github.com/codeacme17/echo-ui/tree/main/docs"
          editLink={messages.edit}
          feedback={{ content: null }}
          footer={footer}
          i18n={locales}
          navbar={navbar}
          pageMap={await getPageMap(`/${lang}`)}
          search={search}
          sidebar={{ toggleButton: false }}
          themeSwitch={messages.themeSwitch}
          toc={messages.toc}
        >
          <IslandMobileMenu lang={lang === 'zh' ? 'zh' : 'en'} />
          {children}
        </Layout>
        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout
