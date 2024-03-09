import { useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

export interface UseWaveformProps {
  audioBuffer: AudioBuffer | null
  channel?: 1 | 2
  samples?: number
}

const CHANNEL = 2
const SAMPLES = 512 * 2

/**
 * useWaveform is a custom React hook that processes an audio buffer to generate waveform data.
 * This hook simplifies the raw audio data into a set of samples, which can be used for visualizing
 * the audio waveform in a user interface.
 *
 * @param {UseWaveformProps} props - The configuration properties for the waveform processing.
 * @param {AudioBuffer | null} props.audioBuffer - The audio buffer containing the raw audio data to be processed.
 * @param {1 | 2} [props.channel=2] - The channel number to be processed (1 for mono, 2 for stereo). Defaults to 2 (stereo).
 * @param {number} [props.samples=1024] - The number of samples to be generated from the audio data. Defaults to 1024.
 *
 * @returns {object} An object containing the waveform data and any error information:
 * - data: An array of numbers (for mono) or an array of arrays of numbers (for stereo), representing the simplified waveform data.
 * - error: A boolean indicating if an error has occurred during processing.
 * - errorMessage: A string containing the error message if an error has occurred.
 *
 * This hook is useful for applications that require audio visualization, such as audio players,
 * editors, or any application dealing with audio data analysis.
 */
export const useWaveform = (props: UseWaveformProps) => {
  const { audioBuffer, channel = CHANNEL, samples = SAMPLES } = props

  const [data, setData] = useState<number[][] | number[]>([])
  const audioDuration = useRef(0)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (data.length) return
    loadAndDecodeAudio()
    getAudioDuration()
  }, [channel, samples, audioBuffer])

  useEffect(() => {
    if (error) logger.error(errorMessage)
  }, [error])

  const getAudioDuration = () => {
    if (error || !audioBuffer) return

    try {
      audioDuration.current = audioBuffer.duration
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

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

  return { data, audioDuration, error, errorMessage }
}
