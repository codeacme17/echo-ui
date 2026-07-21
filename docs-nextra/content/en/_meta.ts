import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  index: {
    title: 'Home',
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
    href: '/en/guide/introduction/',
    title: 'Guide',
    type: 'page',
  },
  component: {
    href: '/en/component/button/',
    title: 'Components',
    type: 'page',
  },
  community: {
    items: {
      discussions: {
        href: 'https://github.com/codeacme17/echo-ui/discussions',
        title: 'Discussions',
      },
      issues: {
        href: 'https://github.com/codeacme17/echo-ui/issues',
        title: 'Issues',
      },
      discord: {
        href: 'https://discord.gg/R9JX9twvXF',
        title: 'Discord',
      },
    },
    title: 'Community',
    type: 'menu',
  },
}

export default meta
