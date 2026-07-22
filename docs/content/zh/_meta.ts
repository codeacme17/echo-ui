import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  index: {
    display: 'hidden',
    title: '首页',
    type: 'page',
    theme: {
      breadcrumb: false,
      copyPage: false,
      layout: 'full',
      pagination: false,
      sidebar: false,
      timestamp: false,
      toc: false,
    },
  },
  guide: {
    href: '/zh/guide/introduction/',
    title: '指南',
    type: 'page',
  },
  component: {
    href: '/zh/component/button/',
    title: '组件',
    type: 'page',
  },
  hook: {
    href: '/zh/hook/useFetchAudio/',
    title: 'Hook',
    type: 'page',
  },
  community: {
    items: {
      discussions: {
        href: 'https://github.com/codeacme17/echo-ui/discussions',
        title: '讨论',
      },
      issues: {
        href: 'https://github.com/codeacme17/echo-ui/issues',
        title: '问题反馈',
      },
      discord: {
        href: 'https://discord.gg/R9JX9twvXF',
        title: 'Discord',
      },
    },
    title: '链接',
    type: 'menu',
  },
}

export default meta
