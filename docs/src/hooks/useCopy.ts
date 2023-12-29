import { useState } from 'react'

export const useCopy = (content: string) => {
  const [copySuccess, setCopySuccess] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return { copySuccess, copyToClipboard }
}
