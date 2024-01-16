import { useEffect, useState } from 'react'

export interface UseWaveformProps {
  arrayBuffer: ArrayBuffer | null
  channel?: 1 | 2
  samples?: number
}

export const useWaveform = (props: UseWaveformProps) => {
  const { arrayBuffer, channel = 2, samples = 512 * 2 } = props

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [data, setData] = useState<number[][] | number[]>([])

  useEffect(() => {
    if (!arrayBuffer || data.length) return
    loadAndDecodeAudio()
  }, [channel, samples, arrayBuffer])

  useEffect(() => {
    if (error) console.error(errorMessage)
  }, [error])

  const loadAndDecodeAudio = async () => {
    if (error) return

    try {
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer as ArrayBuffer)
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
