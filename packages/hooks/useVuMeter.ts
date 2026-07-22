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
 * - meter: The Tone.js Meter or Split instance, depending on the input type (mono or stereo).
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
  const meterL = useRef<Tone.Meter | null>(null)
  const meterR = useRef<Tone.Meter | null>(null)
  const split = useRef<Tone.Split | null>(null)
  const observerId = useRef<number>(0)

  const [value, setValue] = useState(_value)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const cancelObserve = useCallback(() => {
    if (!observerId.current) return
    cancelAnimationFrame(observerId.current)
    observerId.current = 0
    setValue(_value)
  }, [_value])

  const releaseMeter = useCallback(() => {
    cancelObserve()
    meter.current?.dispose()
    meterL.current?.dispose()
    meterR.current?.dispose()
    split.current?.dispose()
    meter.current = null
    meterL.current = null
    meterR.current = null
    split.current = null
  }, [cancelObserve])

  useEffect(() => releaseMeter, [releaseMeter])

  useEffect(() => {
    if (!error) return
    logger.error(errorMessage)
    onError?.()
  }, [error])

  const init = useCallback(() => {
    try {
      releaseMeter()
      if (!isStereo) {
        meter.current = new Tone.Meter()
      } else {
        meterL.current = new Tone.Meter()
        meterR.current = new Tone.Meter()
        split.current = new Tone.Split()
        split.current.connect(meterL.current, 0)
        split.current.connect(meterR.current, 1)
      }
      onReady?.()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [isStereo, onReady, releaseMeter])

  const getValue = useCallback(() => {
    if (error) return
    if (!isStereo && !meter.current) return
    if (isStereo && (!meterL.current || !meterR.current)) return

    try {
      const newValue = isStereo
        ? [firstMeterValue(meterL.current!.getValue()), firstMeterValue(meterR.current!.getValue())]
        : firstMeterValue(meter.current!.getValue())
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
    meter: isStereo ? split : meter,
    value,
    init,
    getValue,
    observe,
    cancelObserve,
    error,
    errorMessage,
  }
}
