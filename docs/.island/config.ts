import { defineConfig, DefaultTheme } from 'islandjs'
import { createRequire } from 'module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const version = require('../../package.json').version

export default defineConfig({
  lang: 'en-US',
  title: 'Echo UI',
  icon: '/logo.png',
  enableSpa: true,
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
    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2023-present leyoonafr',
    // },
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
        text: getText('可控组件', 'Controller'),
        items: [
          {
            text: getText('Button 按钮', 'Button'),
            link: getLink('/component/button'),
          },
          {
            text: getText('Checkbox 多选框', 'Checkbox'),
            link: getLink('/component/checkbox'),
          },
          {
            text: getText('Input 输入框', 'Input'),
            link: getLink('/component/input'),
          },
          {
            text: getText('Knob 旋钮', 'Knob'),
            link: getLink('/component/knob'),
          },
          {
            text: getText('Radio 单选框', 'Radio'),
            link: getLink('/component/radio'),
          },
          {
            text: getText('Slider 滑动输入条', 'Slider'),
            link: getLink('/component/slider'),
          },
          {
            text: getText('Switch 开关', 'Switch'),
            link: getLink('/component/switch'),
          },
        ],
      },
      {
        text: getText('可视组件', 'Visualization'),
        items: [
          {
            text: getText('Light 指示灯', 'Light'),
            link: getLink('/component/light'),
          },
          {
            text: getText('Spectrogram 频谱图', 'Spectrogram'),
            link: getLink('/component/spectrogram'),
          },
          {
            text: getText('VU Meter 音量表', 'VU Meter'),
            link: getLink('/component/VuMeter'),
          },
        ],
      },
      {
        text: getText('容器组件', 'Contianer'),
        items: [
          {
            text: getText('Card 卡片', 'Card'),
            link: getLink('/component/Card'),
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
