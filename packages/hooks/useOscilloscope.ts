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

/**
 * `useOscilloscope` is a custom React hook that integrates with Tone.js to create an oscilloscope.
 * It is designed to capture and display real-time waveform data from an audio source.
 *
 * @param {UseOscilloscopeProps} props - The configuration properties for the oscilloscope.
 * @param {number} [props.fftSize=1024] - The FFT size, must be a power of 2. Default is 1024.
 * @param {Function} props.onReady - Callback executed when the oscilloscope is ready.
 * @param {Function} props.onError - Callback executed in case of an error.
 *
 * @returns {object} An object containing various properties and methods for the oscilloscope:
 * - init: Method to initialize the oscilloscope.
 * - analyser: The Tone.Analyser instance used by the oscilloscope.
 * - data: The current waveform data captured by the oscilloscope.
 * - getData: Method to retrieve the current waveform data.
 * - observe: Method to start the data observation.
 * - cancelObserve: Method to stop the data observation.
 * - error: Boolean indicating if an error has occurred.
 * - errorMessage: The error message in case of an error.
 *
 * This hook can be useful in audio analysis applications, allowing for real-time visualization of waveform data.
 */
export const useOscilloscope = (props: UseOscilloscopeProps = {}) => {
  const { fftSize = FFT_SIZE, onReady, onError } = props

  const observerId = useRef<number>(0)
  const analyser = useRef<Tone.Analyser | null>(null)
  const [data, setData] = useState<OscilloscopeDataPoint[]>([])
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleError = useCallback(
    (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err)
      setError(true)
      setErrorMessage(message)
      logger.error(message)
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

  const init = useCallback(() => {
    try {
      releaseAnalyser()
      analyser.current = new Tone.Analyser('waveform', fftSize)
      onReady?.()
    } catch (err) {
      handleError(err)
    }
  }, [fftSize, handleError, onReady, releaseAnalyser])

  const getData = useCallback(() => {
    if (!analyser.current || error) return
    try {
      const analyserValue: unknown = analyser.current.getValue()
      const spectrumData =
        analyserValue instanceof Float32Array
          ? analyserValue
          : Array.isArray(analyserValue) && analyserValue[0] instanceof Float32Array
            ? analyserValue[0]
            : null
      if (!spectrumData) return
      const formattedData = Array.from(spectrumData).map((amplitude, index) => {
        return { index, amplitude }
      })
      setData(formattedData)
    } catch (err) {
      handleError(err)
    }
  }, [error, handleError])

  const observer = useCallback(() => {
    if (!analyser.current || error || observerId.current) return

    try {
      const readFrame = () => {
        getData()
        observerId.current = requestAnimationFrame(readFrame)
      }
      getData()
      observerId.current = requestAnimationFrame(readFrame)
    } catch (err) {
      handleError(err)
    }
  }, [error, getData, handleError])

  return {
    init,
    analyser,
    data,
    getData,
    observer,
    cancelObserve,
    error,
    errorMessage,
  }
}
