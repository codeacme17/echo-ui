import { useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

export interface UseWaveformProps {
  audioBuffer: AudioBuffer | null
  channel?: 1 | 2
  samples?: number
}

const CHANNEL = 2
const SAMPLES = 512 * 2

const simplifyData = (rawData: Float32Array, requestedSamples: number) => {
  const sampleCount = Math.max(1, Math.floor(requestedSamples))
  if (rawData.length === 0) return Array.from({ length: sampleCount }, () => 0)

  return Array.from({ length: sampleCount }, (_, index) => {
    const start = Math.min(Math.floor((index * rawData.length) / sampleCount), rawData.length - 1)
    const end = Math.min(
      Math.max(start + 1, Math.floor(((index + 1) * rawData.length) / sampleCount)),
      rawData.length,
    )
    let sum = 0
    for (let cursor = start; cursor < end; cursor += 1) sum += Math.abs(rawData[cursor])
    return sum / (end - start)
  })
}

/**
 * Reduces the available channels of an AudioBuffer into a fixed number of finite waveform samples.
 */
export const useWaveform = (props: UseWaveformProps) => {
  const { audioBuffer, channel = CHANNEL, samples = SAMPLES } = props

  const [data, setData] = useState<number[][]>([])
  const audioDuration = useRef(0)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!audioBuffer) {
      audioDuration.current = 0
      setData([])
      return
    }

    try {
      const availableChannels = Math.min(channel, audioBuffer.numberOfChannels)
      const nextData = Array.from({ length: availableChannels }, (_, channelIndex) =>
        simplifyData(audioBuffer.getChannelData(channelIndex), samples),
      )
      audioDuration.current = audioBuffer.duration
      setData(nextData)
      setError(false)
      setErrorMessage('')
    } catch (err) {
      setData([])
      setError(true)
      setErrorMessage(err instanceof Error ? err.message : String(err))
    }
  }, [audioBuffer, channel, samples])

  useEffect(() => {
    if (error) logger.error(errorMessage)
  }, [error, errorMessage])

  return { data, audioDuration, error, errorMessage }
}
