import { useEffect, useState } from 'react'

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.className === 'dark' ? true : false,
  )

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
