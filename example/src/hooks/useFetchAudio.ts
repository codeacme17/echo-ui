import { useState, useEffect } from 'react'

interface UseFetchAudioProps {
  url: string
  requestOptions?: RequestInit
}

export const useFetchAudio = (props: UseFetchAudioProps) => {
  const { url, requestOptions } = props

  const [pending, setPending] = useState(true)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [response, setResponse] = useState<Response | null>(null)
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null)

  useEffect(() => {
    fetchAudio()
  }, [])

  useEffect(() => {
    if (error) console.error(errorMessage)
  }, [error])

  const fetchAudio = async () => {
    try {
      const response = await fetch(url, requestOptions)
      setResponse(response)
      setPending(false)
      if (response.ok) {
        setFetched(true)
        setArrayBuffer(await response.arrayBuffer())
      } else {
        setError(true)
        setErrorMessage(response.statusText)
      }
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  return { pending, fetched, error, errorMessage, response, arrayBuffer }
}
