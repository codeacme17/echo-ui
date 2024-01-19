import * as Tone from 'tone'
import { useCallback, useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

export interface UseVuMeterProps {
  value: number | number[]
}

export const useVuMeter = (props: UseVuMeterProps) => {
  const { value: _value } = props

  const [value, setValue] = useState(_value)
  const isStereo = Array.isArray(_value)
  const meter = useRef<Tone.Meter | null>(null)
  const meterL = useRef<Tone.Meter | null>(null)
  const meterR = useRef<Tone.Meter | null>(null)
  const split = useRef<Tone.Split | null>(null)
  const observerId = useRef<number>(0)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    init()
    return () => cancelObserve()
  }, [])

  useEffect(() => {
    if (error) logger.error(errorMessage)
  }, [error])

  const init = useCallback(() => {
    try {
      if (!isStereo) {
        meter.current = new Tone.Meter()
      } else {
        split.current = new Tone.Split()
        meterL.current = new Tone.Meter()
        meterR.current = new Tone.Meter()

        split.current.connect(meterL.current, 0)
        split.current.connect(meterR.current, 1)
      }
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [isStereo])

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
    getValue,
    observe,
    cancelObserve,
    error,
    errorMessage,
  }
}
