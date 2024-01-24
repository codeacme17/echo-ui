import { useState, useEffect } from 'react'
import { logger } from '../lib/log'

export interface UseFetchAudioProps {
  url: string
  requestOptions?: RequestInit
  onSuccess?: () => void
  onError?: () => void
}

/**
 * useFetchAudio is a custom React hook for fetching and decoding audio data from a specified URL.
 * It handles the entire process from making an HTTP request to processing the audio data.
 *
 * @param {UseFetchAudioProps} props - The configuration properties for fetching the audio.
 * @param {string} props.url - The URL of the audio file to be fetched.
 * @param {RequestInit} [props.requestOptions] - Optional configuration for the fetch request.
 * @param {Function} [props.onSuccess] - Optional callback to be executed when the audio is successfully fetched and decoded.
 * @param {Function} [props.onError] - Optional callback to be executed in case of an error during fetching or decoding.
 *
 * @returns {object} An object containing several states and a function to initiate the audio fetching:
 * - pending: A boolean indicating whether the request is in progress.
 * - fetched: A boolean indicating whether the audio has been successfully fetched and decoded.
 * - error: A boolean indicating if an error has occurred.
 * - errorMessage: A string containing the error message if an error has occurred.
 * - response: The response object from the fetch request.
 * - audioBuffer: The decoded audio data as an AudioBuffer.
 * - fetchAudio: A function that initiates the fetching and decoding process.
 *
 * This hook is useful in scenarios where you need to retrieve audio files from a server and process them for web audio applications.
 */
export const useFetchAudio = (props: UseFetchAudioProps) => {
  const { url, requestOptions, onSuccess, onError } = props

  const [pending, setPending] = useState(true)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [response, setResponse] = useState<Response | null>(null)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)

  useEffect(() => {
    if (!error) return
    logger.error(errorMessage)
    onError && onError()
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
        throw new Error(response.statusText)
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
