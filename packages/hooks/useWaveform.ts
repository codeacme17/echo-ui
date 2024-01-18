import { useEffect, useState } from 'react'
import { logger } from '../lib/log'

export interface UseWaveformProps {
  audioBuffer: AudioBuffer | null
  channel?: 1 | 2
  samples?: number
}

const CHANNEL = 2
const SAMPLES = 512 * 2

export const useWaveform = (props: UseWaveformProps) => {
  const { audioBuffer, channel = CHANNEL, samples = SAMPLES } = props

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [data, setData] = useState<number[][] | number[]>([])

  useEffect(() => {
    if (data.length) return
    loadAndDecodeAudio()
  }, [channel, samples, audioBuffer])

  useEffect(() => {
    if (error) logger.error(errorMessage)
  }, [error])

  const loadAndDecodeAudio = async () => {
    if (error || !audioBuffer) return

    try {
      const channelData =
        channel === 1
          ? [audioBuffer.getChannelData(0)]
          : [audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)]
      const simplifiedData = channelData.map((data) => simplifyData(data)) as number[][]
      setData(simplifiedData)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const simplifyData = (rawData: Float32Array) => {
    if (error) return

    try {
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
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  return { error, errorMessage, data }
}
