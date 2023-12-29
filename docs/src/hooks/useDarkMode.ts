import { useEffect, useState } from 'react'
import { usePageData } from 'islandjs/runtime'

export const useDarkMode = () => {
  const pageData = usePageData()

  const [darkMode, setDarkMode] = useState(pageData ? pageData.siteData.appearance : false)

  useEffect(() => {
    const targetNode = document.documentElement
    const config = {
      attributes: true,
      attributeFilter: ['class'],
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setDarkMode(targetNode.className.includes('dark'))
        }
      })
    })

    observer.observe(targetNode, config)

    return () => {
      observer.disconnect()
    }
  }, [])

  return darkMode
}
