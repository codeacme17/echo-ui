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
 * - init: A method to initialize the analyser.
 * - analyser: An instance of Tone.Analyser used for analyzing audio frequencies.
 * - data: An array of spectrogram data points.
 * - getData: A method to fetch the latest spectrogram data from the analyser.
 * - observe: A method to start observing and updating the spectrogram data.
 * - cancelObserve: A method to stop observing the spectrogram data.
 * - error: A boolean indicating whether an error has occurred.
 * - errorMessage: A string containing the error message if an error has occurred.
 */
export const useSpectrogram = (props: UseSpectrogramProps = {}) => {
  const { fftSize = FFT_SIZE, onReady, onError } = props

  const analyser = useRef<Tone.Analyser | null>(null)
  const observerId = useRef<number>(0)

  const [data, setData] = useState<SpectrogramDataPoint[]>([])
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleError = useCallback(
    (err: unknown) => {
      setError(true)
      setErrorMessage(err as string)
      logger.error(err as string)
      onError?.()
    },
    [onError],
  )

  const cancelObserve = useCallback(() => {
    if (!observerId.current) return
    cancelAnimationFrame(observerId.current)
    observerId.current = 0
    setData([])
  }, [])

  const releaseAnalyser = useCallback(() => {
    cancelObserve()
    analyser.current?.dispose()
    analyser.current = null
  }, [cancelObserve])

  useEffect(() => releaseAnalyser, [releaseAnalyser])

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
      releaseAnalyser()
      analyser.current = new Tone.Analyser('fft', fftSize)
      onReady?.()
    } catch (err) {
      handleError(err)
    }
  }, [fftSize, handleError, onReady, releaseAnalyser])

  const getData = useCallback(() => {
    if (!analyser.current || error) return

    try {
      const analyserValue: unknown = analyser.current.getValue()
      const spectrogramData =
        analyserValue instanceof Float32Array
          ? analyserValue
          : Array.isArray(analyserValue) && analyserValue[0] instanceof Float32Array
            ? analyserValue[0]
            : null
      if (spectrogramData) {
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
    if (!analyser.current || error || observerId.current) return

    const readFrame = () => {
      getData()
      observerId.current = requestAnimationFrame(readFrame)
    }
    getData()
    observerId.current = requestAnimationFrame(readFrame)
  }, [getData, error])

  return {
    analyser,
    data,
    init,
    getData,
    observe,
    cancelObserve,
    error,
    errorMessage,
  }
}
