import { useEffect, useRef, useState } from 'react'

interface UseWaveformProps {
  url: string
  channel?: 1 | 2
  samples?: number
}

export const useWaveform = (props: UseWaveformProps) => {
  const { url, channel = 2, samples = 512 * 2 } = props

  const [pending, setPending] = useState(true)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [data, setData] = useState<number[][] | number[]>([])
  const response = useRef<Response | null>(null)

  useEffect(() => {
    init()
  }, [url, channel, samples])

  useEffect(() => {
    if (error) console.error(errorMessage)
  }, [error])

  const init = async () => {
    await fetchAudio()
    await loadAndDecodeAudio()
  }

  const fetchAudio = async () => {
    try {
      response.current = await fetch(url)
      setPending(false)
      if (response.current.ok) setFetched(true)
      else {
        setError(true)
        setErrorMessage(response.current.statusText)
      }
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const loadAndDecodeAudio = async () => {
    if (!response.current || error) return

    try {
      const arrayBuffer = await response.current.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const channelData =
        channel === 1
          ? [audioBuffer.getChannelData(0)]
          : [audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)]
      const simplifiedData = channelData.map((data) => simplifyData(data))
      setData(simplifiedData)

      console.log(simplifiedData)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const simplifyData = (rawData: Float32Array) => {
    const blockSize = Math.floor(rawData.length / samples)
    const simplifiedData = []

    for (let i = 0; i < samples; i++) {
      let sum = 0
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockSize * i + j])
      }
      simplifiedData.push(sum / blockSize)
    }
    return simplifiedData
  }

  return { pending, fetched, error, errorMessage, data }
}
