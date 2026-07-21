'use client'

import type { FC } from 'react'
import { useEffect, useState } from 'react'

type IslandMobileMenuProps = Readonly<{
  lang: 'en' | 'zh'
}>

const mobileNavigationId = 'island-mobile-navigation'

export const IslandMobileMenu: FC<IslandMobileMenuProps> = ({ lang }) => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const mobileNavigation = document.querySelector<HTMLElement>('.nextra-mobile-nav')
    if (!mobileNavigation) return

    mobileNavigation.id = mobileNavigationId
    const updateExpanded = () =>
      setExpanded(mobileNavigation.getBoundingClientRect().top >= 0)
    const observer = new MutationObserver(updateExpanded)
    observer.observe(mobileNavigation, { attributeFilter: ['class'], attributes: true })
    updateExpanded()

    return () => observer.disconnect()
  }, [])

  const toggleNavigation = () => {
    document.querySelector<HTMLButtonElement>('.nextra-hamburger')?.click()
    setExpanded((current) => !current)
  }

  return (
    <button
      aria-controls={mobileNavigationId}
      aria-expanded={expanded}
      className="island-mobile-menu"
      onClick={toggleNavigation}
      type="button"
    >
      <span aria-hidden="true">☰</span>
      {lang === 'zh' ? '菜单' : 'Menu'}
    </button>
  )
}
