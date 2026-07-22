import { useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

export interface UseFetchAudioProps {
  url: string
  requestOptions?: RequestInit
  onSuccess?: () => void
  onError?: () => void
}

/** Fetches and decodes audio while owning the temporary decoding context and request lifetime. */
export const useFetchAudio = (props: UseFetchAudioProps) => {
  const { url, requestOptions, onSuccess, onError } = props

  const [pending, setPending] = useState(true)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [response, setResponse] = useState<Response | null>(null)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const activeController = useRef<AbortController | null>(null)
  const requestVersion = useRef(0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      requestVersion.current += 1
      activeController.current?.abort()
      activeController.current = null
    }
  }, [])

  const fetchAudio = async () => {
    activeController.current?.abort()
    const controller = new AbortController()
    activeController.current = controller
    const version = requestVersion.current + 1
    requestVersion.current = version
    const externalSignal = requestOptions?.signal
    const signal = externalSignal
      ? AbortSignal.any([controller.signal, externalSignal])
      : controller.signal

    if (mounted.current) {
      setPending(true)
      setFetched(false)
      setError(false)
      setErrorMessage('')
      setAudioBuffer(null)
    }

    let audioContext: AudioContext | null = null
    try {
      const nextResponse = await fetch(url, { ...requestOptions, signal })
      if (!nextResponse.ok) throw new Error(nextResponse.statusText)

      audioContext = new AudioContext()
      const decodedAudio = await audioContext.decodeAudioData(await nextResponse.arrayBuffer())
      if (!mounted.current || version !== requestVersion.current) return

      setResponse(nextResponse)
      setAudioBuffer(decodedAudio)
      setFetched(true)
      onSuccess?.()
    } catch (err) {
      if (controller.signal.aborted || !mounted.current || version !== requestVersion.current)
        return
      const message = err instanceof Error ? err.message : String(err)
      setError(true)
      setErrorMessage(message)
      logger.error(err instanceof Error ? String(err) : message)
      onError?.()
    } finally {
      if (audioContext) await audioContext.close()
      if (mounted.current && version === requestVersion.current) {
        setPending(false)
        activeController.current = null
      }
    }
  }

  return { pending, fetched, error, errorMessage, response, audioBuffer, fetchAudio }
}
