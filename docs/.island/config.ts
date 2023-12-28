import { defineConfig, DefaultTheme } from 'islandjs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const version = require('../../package.json').version

export default defineConfig({
  lang: 'en-US',
  title: 'Echo UI',
  icon: '/logo.png',
  vite: {
    server: { port: 1800 },
  },
  markdown: {
    rehypePlugins: [],
    remarkPlugins: [],
  },
  route: {
    exclude: ['src/**/*'],
  },
  // plugins: [pluginCheckLinks({})],
  themeConfig: {
    locales: {
      '/zh/': {
        lang: 'zh',
        label: '简体中文',
        lastUpdatedText: '上次更新',
        nav: getNavbar('zh'),
        sidebar: getSidebar('zh'),
        title: 'Echo UI',
        outlineTitle: '目录',
        description: '为 Web Audio API 设计的高性能 UI 框架',
        editLink: {
          pattern: 'https://github.com/codeacme17/echo-ui/tree/master/docs/:path',
          text: '📝 在 GitHub 上编辑此页',
        },
      },
      '/en/': {
        lang: 'en',
        label: 'English',
        lastUpdated: 'Last Updated',
        nav: getNavbar('en'),
        sidebar: getSidebar('en'),
        title: 'Echo UI',
        description: 'A high-performance UI framework designed for Web Audio API',
        lastUpdatedText: 'Last Updated',
        editLink: {
          pattern: 'https://github.com/codeacme17/echo-ui/tree/master/docs/:path',
          text: '📝 Edit this page on GitHub',
        },
      },
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/codeacme17/echo-ui',
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present leyoonafr',
    },
  },
})

function getSidebar(lang: 'zh' | 'en'): DefaultTheme.Sidebar {
  const { getLink, getText } = getI18nHelper(lang)

  return {
    [getLink('/guide/')]: [
      {
        text: getText('指南', 'Guide'),
        items: [
          {
            text: getText('介绍', 'Introduction'),
            link: getLink('/guide/introduction'),
          },
          {
            text: getText('安装', 'Installation'),
            link: getLink('/guide/installation'),
          },
        ],
      },
    ],
    [getLink('/component/')]: [
      {
        text: getText('组件', 'Config'),
        items: [
          {
            text: getText('按钮', 'Button'),
            link: getLink('/component/button'),
          },
        ],
      },
    ],
  }
}

function getNavbar(lang: 'zh' | 'en') {
  const { getLink, getText } = getI18nHelper(lang)

  return [
    {
      text: getText('指南', 'Guide'),
      link: getLink('/guide/introduction'),
      activeMatch: '/guide/',
    },
    {
      text: getText('组件', 'Component'),
      link: getLink('/component/button'),
      activeMatch: '/component/',
    },
  ]
}

function getI18nHelper(lang: 'zh' | 'en') {
  const cn = lang === 'zh'
  const prefix = cn ? '/zh' : '/en'
  const getLink = (str: string) => `${prefix}${str}`
  const getText = (cnText: string, enText: string) => (cn ? cnText : enText)

  return { getText, getLink }
}
