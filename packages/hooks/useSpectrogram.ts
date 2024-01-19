import * as Tone from 'tone'
import { useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'
import type { SpectrogramDataPoint } from '../main'

export interface UseSpectrogramProps {
  fftSize?: number
}

const FFT_SIZE = 1024

export const useSpectrogram = (props: UseSpectrogramProps = {}) => {
  const { fftSize: _fftSize = FFT_SIZE } = props

  const analyser = useRef<Tone.Analyser | null>(null)
  const observerId = useRef<number>(0)

  const [data, setData] = useState<SpectrogramDataPoint[]>([])
  const [fftSize, setFftSize] = useState(_fftSize)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    init()
    return () => {
      analyser.current?.dispose()
      cancelObserve()
    }
  }, [])

  useEffect(() => {
    if (!analyser.current || error) return

    try {
      analyser.current.size = fftSize
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [fftSize])

  useEffect(() => {
    if (error) logger.error(errorMessage)
  }, [error])

  const init = () => {
    try {
      analyser.current = new Tone.Analyser('fft', fftSize)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const getData = () => {
    if (!analyser.current || error) return

    try {
      const spectrogramData = analyser.current.getValue()
      if (spectrogramData instanceof Float32Array) {
        const formattedData = Array.from(spectrogramData).map((amplitude, frequency) => ({
          frequency,
          amplitude,
        }))
        setData(formattedData)
      }
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const observe = () => {
    if (!analyser.current || error) return

    try {
      getData()
      observerId.current = requestAnimationFrame(observe)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const cancelObserve = () => {
    if (!observerId.current || error) return

    try {
      setData([])
      cancelAnimationFrame(observerId.current)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  return {
    analyser: analyser.current!,
    data,
    fftSize,
    getData,
    setFftSize,
    observe,
    cancelObserve,
    error,
    errorMessage,
  }
}
