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
