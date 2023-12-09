import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  GuideSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['index'],
    },
  ],
  componentSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['components'],
    },
    {
      type: 'category',
      label: 'Visualization',
      collapsed: false,
      items: ['components/visualization/VuMeter'],
    },
  ],
}

export default sidebars
