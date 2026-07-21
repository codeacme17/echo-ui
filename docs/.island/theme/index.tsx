import React from 'react'
import { Analytics } from '@vercel/analytics/react'
import {
  HomeLayout as DefaultHomeLayout,
  Layout as DefaultLayout,
  NotFoundLayout,
  setup,
} from 'islandjs/theme'
import '../../../packages/index.css'

const Layout = () => {
  return (
    <main className="px-2">
      <DefaultLayout />
      <Analytics />
    </main>
  )
}

const HomeLayout = () => {
  return <DefaultHomeLayout />
}

// IslandJS requires setup to be exported beside the theme components.
// eslint-disable-next-line react-refresh/only-export-components
export { Layout, HomeLayout, NotFoundLayout, setup }
