import React from 'react'
import { Analytics } from '@vercel/analytics/react'
import {
  HomeLayout as DefaultHomeLayout,
  Layout as DefaultLayout,
  NotFoundLayout,
  setup,
} from 'islandjs/theme'
import 'echo-ui/dist/style.css'

const Banner = () => {
  return (
    <section className="max-w-[1152px] mx-auto  pt-10 pb-20">
      <div className="w-full flex justify-center">
        <img src="/temp.png" className="shadow-2xl rounded-xl" />
      </div>
    </section>
  )
}

const Layout = () => {
  return (
    <main className="px-2">
      <DefaultLayout />
      <Analytics />
    </main>
  )
}

const HomeLayout = () => {
  return (
    <>
      <DefaultHomeLayout />
      {/* <Banner /> */}
    </>
  )
}

export { Layout, HomeLayout, NotFoundLayout, setup }
