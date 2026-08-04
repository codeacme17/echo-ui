'use client'

import { useEffect } from 'react'

const basePath = process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? ''
const destination = `${basePath}/en/`

export function RootLanguageRedirect() {
  useEffect(() => {
    window.location.replace(destination)
  }, [])

  return (
    <>
      <meta content={`0;url=${destination}`} httpEquiv="refresh" />
      <meta content="Choose your documentation language" name="description" />
      <link href={`https://echoui.dev${destination}`} rel="canonical" />
      <link href={`${basePath}/en/`} hrefLang="en" rel="alternate" />
      <link href={`${basePath}/zh/`} hrefLang="zh" rel="alternate" />
      <noscript>
        This documentation moved to <a href={destination}>{destination}</a>.
      </noscript>
    </>
  )
}
