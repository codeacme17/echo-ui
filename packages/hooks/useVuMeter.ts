import * as Tone from 'tone'
import { useCallback, useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

export interface UseVuMeterProps {
  value: number | number[]
  onReady?: () => void
  onError?: () => void
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

  useEffect(() => {
    return () => {
      if (!meter.current) return
      meter.current.dispose()
      cancelObserve()
    }
  }, [])

  useEffect(() => {
    if (!error) return
    logger.error(errorMessage)
    onError && onError()
  }, [error])

  const init = useCallback(() => {
    try {
      if (!isStereo) {
        meter.current = new Tone.Meter()
      } else {
        meterL.current = new Tone.Meter()
        meterR.current = new Tone.Meter()
        split.current = new Tone.Split()
        split.current.connect(meterL.current, 0)
        split.current.connect(meterR.current, 1)
      }
      onReady && onReady()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [])

  const getValue = useCallback(() => {
    if (error) return
    if (!isStereo && !meter.current) return
    if (isStereo && (!meterL.current || !meterR.current)) return

    try {
      let newValue
      if (isStereo) newValue = [meterL.current!.getValue(), meterR.current!.getValue()]
      else newValue = meter.current!.getValue()
      setValue(newValue as number | number[])
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [])

  const observe = useCallback(() => {
    try {
      getValue()
      observerId.current = requestAnimationFrame(observe)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [])

  const cancelObserve = useCallback(() => {
    if (!observerId.current || error) return

    try {
      setValue(_value)
      cancelAnimationFrame(observerId.current)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [_value])

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
