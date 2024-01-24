import * as Tone from 'tone'
import { useCallback, useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

export interface UseVuMeterProps {
  value: number | number[]
  onReady?: () => void
  onError?: () => void
}

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
    meter: isStereo ? split.current! : meter.current!,
    value,
    init,
    getValue,
    observe,
    cancelObserve,
    error,
    errorMessage,
  }
}
