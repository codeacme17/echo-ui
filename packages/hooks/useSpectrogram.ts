import * as Tone from 'tone'
import { useEffect, useRef, useState, useCallback } from 'react'
import { logger } from '../lib/log'
import type { SpectrogramDataPoint } from '../main'

export interface UseSpectrogramProps {
  fftSize?: number
  onReady?: () => void
  onError?: () => void
}

const FFT_SIZE = 1024

/**
 * useSpectrogram is a custom React hook for analyzing and visualizing audio frequencies using Tone.js.
 * It creates an FFT (Fast Fourier Transform) based analyzer to process audio data and provide spectrogram data points.
 *
 * @param {UseSpectrogramProps} props - The configuration properties for the hook.
 * @param {number} props.fftSize - The size of the FFT. Represents the window size in samples that is used when performing a FFT.
 *                                - Default value is 1024.
 *
 * @returns {object} An object containing various properties and methods to interact with the spectrogram:
 * - analyser: An instance of Tone.Analyser used for analyzing audio frequencies.
 * - data: An array of spectrogram data points.
 * - fftSize: The size of the FFT, can be updated dynamically.
 * - init: A method to initialize the analyser.
 * - getData: A method to fetch the latest spectrogram data from the analyser.
 * - setFftSize: A method to update the size of the FFT.
 * - observe: A method to start observing and updating the spectrogram data.
 * - cancelObserve: A method to stop observing the spectrogram data.
 * - error: A boolean indicating whether an error has occurred.
 * - errorMessage: A string containing the error message if an error has occurred.
 */
export const useSpectrogram = (props: UseSpectrogramProps = {}) => {
  const { fftSize: _fftSize = FFT_SIZE } = props

  const analyser = useRef<Tone.Analyser | null>(null)
  const observerId = useRef<number>(0)

  const [data, setData] = useState<SpectrogramDataPoint[]>([])
  const [fftSize, setFftSize] = useState(_fftSize)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleError = useCallback((err: unknown) => {
    setError(true)
    setErrorMessage(err as string)
    logger.error(err as string)
  }, [])

  useEffect(() => {
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
      handleError(err)
    }
  }, [fftSize, handleError, error])

  const init = useCallback(() => {
    try {
      analyser.current = new Tone.Analyser('fft', fftSize)
    } catch (err) {
      handleError(err)
    }
  }, [fftSize, handleError])

  const getData = useCallback(() => {
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
      handleError(err)
    }
  }, [error, handleError])

  const observe = useCallback(() => {
    if (!analyser.current || error) return

    getData()
    observerId.current = requestAnimationFrame(observe)
  }, [getData, error])

  const cancelObserve = useCallback(() => {
    if (observerId.current && !error) {
      setData([])
      cancelAnimationFrame(observerId.current)
    }
  }, [error])

  return {
    analyser: analyser.current,
    data,
    fftSize,
    init,
    getData,
    setFftSize,
    observe,
    cancelObserve,
    error,
    errorMessage,
  }
}
