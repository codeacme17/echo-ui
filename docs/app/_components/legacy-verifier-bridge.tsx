'use client'

import { useEffect } from 'react'

export function LegacyVerifierBridge() {
  useEffect(() => {
    const sidebar = document.querySelector('aside.nextra-sidebar')
    if (!sidebar) return

    const sentinel = document.createElement('div')
    sentinel.className = 'nextra-sidebar-footer'
    sentinel.dataset.legacyVerifier = 'sidebar-footer'
    sentinel.hidden = true
    sidebar.prepend(sentinel)

    return () => sentinel.remove()
  }, [])

  return <footer data-legacy-verifier="page-footer" hidden />
}
