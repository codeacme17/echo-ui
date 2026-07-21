import type { Metadata } from 'next'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Footer, Layout, LocaleSwitch, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import type { FC, ReactNode } from 'react'
import '@nafr/echo-ui/style.css'
import './styles.css'

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
    editLink: 'Edit this page on GitHub',
    feedback: 'Report a documentation issue',
    footer: 'Released under the MIT License.',
    name: 'English',
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
    editLink: '在 GitHub 上编辑此页',
    feedback: '反馈文档问题',
    footer: '基于 MIT 许可证发布。',
    name: '简体中文',
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
    <Navbar
      chatLink="https://discord.gg/R9JX9twvXF"
      logo={<strong className="echo-docs-logo">Echo UI</strong>}
      logoLink={`/${lang}`}
      projectLink="https://github.com/codeacme17/echo-ui"
    >
      <LocaleSwitch lite />
    </Navbar>
  )
  const footer = <Footer>{messages.footer}</Footer>

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
          docsRepositoryBase="https://github.com/codeacme17/echo-ui/tree/main/docs-nextra"
          editLink={messages.editLink}
          feedback={{ content: messages.feedback }}
          footer={footer}
          i18n={locales}
          navbar={navbar}
          pageMap={await getPageMap(`/${lang}`)}
          themeSwitch={messages.themeSwitch}
          toc={messages.toc}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

export default RootLayout
