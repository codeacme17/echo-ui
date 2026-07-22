import * as Tone from 'tone'
import { useCallback, useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

export interface UseVuMeterProps {
  value: number | number[]
  onReady?: () => void
  onError?: () => void
}

const firstMeterValue = (value: unknown) => {
  if (typeof value === 'number') return value
  if (value instanceof Float32Array || Array.isArray(value)) {
    const firstValue = value[0]
    return typeof firstValue === 'number' ? firstValue : -Infinity
  }
  return -Infinity
}

const stereoMeterValue = (value: unknown): number[] => {
  if (typeof value === 'number') return [value, value]
  if (value instanceof Float32Array || Array.isArray(value)) {
    const left = typeof value[0] === 'number' ? value[0] : -Infinity
    const right = typeof value[1] === 'number' ? value[1] : left
    return [left, right]
  }
  return [-Infinity, -Infinity]
}

/**
 * useVuMeter is a custom React hook that integrates with Tone.js to create a VU (Volume Unit) meter.
 * It can be used to monitor audio signal levels, supporting both mono and stereo inputs.
 *
 * @param {UseVuMeterProps} props - The configuration properties for the VU meter.
 * @param {number | number[]} props.value - The initial value(s) for the meter. Pass a single number for mono or an array of numbers for stereo.
 * @param {Function} props.onReady - Callback executed when the meter is ready.
 * @param {Function} props.onError - Callback executed in case of an error.
 *
 * @returns {object} An object containing various properties and methods for the VU meter:
 * - meter: The Tone.js Meter instance. Stereo mode uses Tone 15's multichannel Meter API.
 * - value: The current value(s) of the meter. It's a number for mono or an array of numbers for stereo.
 * - init: Method to initialize the VU meter.
 * - getValue: Method to retrieve the current value(s) from the meter.
 * - observe: Method to start observing and updating the meter's value(s).
 * - cancelObserve: Method to stop observing the meter's value(s).
 * - error: Boolean indicating if an error has occurred.
 * - errorMessage: The error message in case of an error.
 *
 * This hook can be particularly useful in audio applications where monitoring signal levels is necessary,
 * such as in mixing consoles, audio workstations, or other digital audio processing tools.
 */
export const useVuMeter = (props: UseVuMeterProps) => {
  const { value: _value, onReady, onError } = props

  const isStereo = Array.isArray(_value)
  const meter = useRef<Tone.Meter | null>(null)
  const observerId = useRef<number>(0)
  const idleValue = useRef(_value)
  idleValue.current = _value

  const [value, setValue] = useState(_value)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const cancelObserve = useCallback(() => {
    if (!observerId.current) return
    cancelAnimationFrame(observerId.current)
    observerId.current = 0
    setValue(idleValue.current)
  }, [])

  const releaseMeter = useCallback(() => {
    cancelObserve()
    meter.current?.dispose()
    meter.current = null
  }, [cancelObserve])

  useEffect(() => releaseMeter, [releaseMeter])

  useEffect(() => {
    if (!error) return
    logger.error(errorMessage)
    onError?.()
  }, [error, errorMessage, onError])

  const init = useCallback(() => {
    try {
      releaseMeter()
      meter.current = new Tone.Meter({ channelCount: isStereo ? 2 : 1 })
      onReady?.()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [isStereo, onReady, releaseMeter])

  const getValue = useCallback(() => {
    if (error) return
    if (!meter.current) return

    try {
      const meterValue = meter.current.getValue()
      const newValue = isStereo ? stereoMeterValue(meterValue) : firstMeterValue(meterValue)
      setValue(newValue)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [error, isStereo])

  const observe = useCallback(() => {
    if (observerId.current || error) return
    try {
      const readFrame = () => {
        getValue()
        observerId.current = requestAnimationFrame(readFrame)
      }
      getValue()
      observerId.current = requestAnimationFrame(readFrame)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [error, getValue])

  return {
    meter,
    value,
    init,
    getValue,
    observe,
    cancelObserve,
    error,
    errorMessage,
  }
}
