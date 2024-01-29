import * as Tone from 'tone'
import { useCallback, useEffect, useRef, useState } from 'react'
import { OscilloscopeDataPoint } from '../main'
import { logger } from '../lib/log'

export interface UseOscilloscopeProps {
  fftSize?: number
  onReady?: () => void
  onError?: () => void
}

const FFT_SIZE = 1024

export const useOscilloscope = (props: UseOscilloscopeProps = {}) => {
  const { fftSize = FFT_SIZE, onReady, onError } = props

  const analyser = useRef<Tone.Analyser>()
  const observerId = useRef<number>(0)
  const [data, setData] = useState<OscilloscopeDataPoint[]>([])
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    return () => {
      analyser.current?.dispose()
      cancelObserve()
    }
  }, [])

  const handleError = useCallback((err: unknown) => {
    setError(true)
    setErrorMessage(err as string)
    logger.error(err as string)
    onError && onError()
  }, [])

  const init = useCallback(() => {
    try {
      analyser.current = new Tone.Analyser('waveform', fftSize)
      onReady && onReady()
    } catch (err) {
      handleError(err)
    }
  }, [fftSize])

  const getData = () => {
    if (!analyser.current || error) return
    const spectrumData = analyser.current.getValue()

    if (spectrumData instanceof Float32Array) {
      const formattedData = Array.from(spectrumData).map((amplitude, index) => {
        return { index, amplitude }
      })
      setData(formattedData)
    }
  }

  const observer = useCallback(() => {
    if (!analyser.current || error) return

    try {
      observerId.current = requestAnimationFrame(observer)
      getData()
    } catch (err) {
      handleError(err)
    }
  }, [])

  const cancelObserve = useCallback(() => {
    if (!observerId.current) return
    setData([])
    cancelAnimationFrame(observerId.current)
  }, [])

  return {
    init,
    analyser: analyser.current,
    data,
    getData,
    observer,
    cancelObserve,
    error,
    errorMessage,
  }
}
