import { defineConfig, DefaultTheme } from 'islandjs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const version = require('../../package.json').version

export default defineConfig({
  lang: 'en-US',
  title: 'Echo UI',
  icon: '/logo.png',
  vite: {
    server: {
      port: 1800,
    },
  },
  markdown: {
    rehypePlugins: [],
    remarkPlugins: [],
  },
  route: {},
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
        prevPageText: '上一页',
        nextPageText: '下一页',
        description: '基于孤岛架构的 SSG 框架',
        editLink: {
          pattern: 'https://github.com/sanyuan0704/island.js/tree/master/docs/:path',
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
        description: 'SSG Framework based on island architecture',
        lastUpdatedText: 'Last Updated',
        editLink: {
          pattern: 'https://github.com/sanyuan0704/island.js/tree/master/docs/:path',
          text: '📝 Edit this page on GitHub',
        },
      },
    },
    // outlineTitle: 'ON THIS PAGE',
    // socialLinks: [
    //   {
    //     icon: 'github',
    //     mode: 'link',
    //     content: 'https://github.com/sanyuan0704/island',
    //   },
    //   {
    //     icon: 'discord',
    //     mode: 'link',
    //     content: 'https://discord.gg/Nvy4YSerjM',
    //   },
    // ],
    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2022-present Xingyuan Yang',
    // },
  },
})

function getSidebar(lang: 'zh' | 'en'): DefaultTheme.Sidebar {
  const { getLink, getText } = getI18nHelper(lang)

  return {
    [getLink('/')]: [
      {
        text: getText('介绍', 'Introduction'),
        items: [
          {
            text: getText('快速开始', 'Getting Started'),
            link: getLink('/guide/getting-started'),
          },
        ],
      },
    ],
    [getLink('/guide/')]: [
      {
        text: getText('介绍', 'Getting Started'),
        items: [
          {
            text: getText('快速开始', 'Getting Started'),
            link: getLink('/guide/getting-started'),
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
      link: getLink('/guide/getting-started'),
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
