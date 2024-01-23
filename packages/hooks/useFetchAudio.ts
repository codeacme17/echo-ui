import { useState, useEffect } from 'react'
import { logger } from '../lib/log'

export interface UseFetchAudioProps {
  url: string
  requestOptions?: RequestInit
  onSuccess?: () => void
  onError?: () => void
}

export const useFetchAudio = (props: UseFetchAudioProps) => {
  const { url, requestOptions, onSuccess, onError } = props

  const [pending, setPending] = useState(true)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [response, setResponse] = useState<Response | null>(null)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)

  useEffect(() => {
    if (error) logger.error(errorMessage)
  }, [error])

  const fetchAudio = async () => {
    try {
      const response = await fetch(url, requestOptions)
      setResponse(response)
      setPending(false)
      if (response.ok) {
        setFetched(true)
        decodeBuffer(await response.arrayBuffer())
        onSuccess && onSuccess()
      } else {
        setError(true)
        onError && onError()
      }
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const decodeBuffer = async (arrayBuffer: ArrayBuffer) => {
    if (error) return

    try {
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      setAudioBuffer(audioBuffer)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  return { pending, fetched, error, errorMessage, response, audioBuffer, fetchAudio }
}
