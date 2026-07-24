import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  index: {
    display: 'hidden',
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
    title: 'Component',
    type: 'page',
  },
  hook: {
    href: '/en/hook/useFetchAudio/',
    title: 'Hook',
    type: 'page',
  },
  community: {
    items: {
      github: {
        href: 'https://github.com/codeacme17/echo-ui',
        title: 'GitHub',
      },
      discord: {
        href: 'https://discord.gg/R9JX9twvXF',
        title: 'Discord',
      },
      twitter: {
        href: 'https://twitter.com/codeacme17',
        title: 'Twitter',
      },
    },
    title: 'Links',
    type: 'menu',
  },
}

export default meta
