import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { scaleLinear } from 'd3'
import { cn } from '../../../lib/utils'
import {
  LumpValue,
  MonoVuMeterProps,
  MonoVuMeterRef,
  StereoVuMeterProps,
  StereoVuMeterRef,
  VuMeterProps,
  VuMeterRef,
} from './types'
import { VuMeterContext, VuMeterContextProvider } from './context'
import { checkPropsIsValid } from './utils'
import { useStyle } from './styles'
import { DEFAULT_LUMPS_QUANTITY, MIN, MAX, MIN_THRESHOLD, MAX_THRESHOLD } from './constants'
import { Axis } from '../Axis'

export const VuMeter = forwardRef<VuMeterRef, VuMeterProps>((props, ref) => {
  const {
    value,
    horizontal = false,
    compact = false,
    lumpsQuantity = DEFAULT_LUMPS_QUANTITY,
    hideAxis = false,
    axisProps,
    classNames,
    styles,
    onChange,
    ...restProps
  }: VuMeterProps = props

  useImperativeHandle(ref, () => vuMeterRef.current as VuMeterRef)

  const monoRef = useRef<HTMLDivElement | null>(null)
  const stereoRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    checkPropsIsValid(props)
  }, [])

  const vuMeterRef = useRef<VuMeterRef | null>(null)

  const isStereo = Array.isArray(value)
  const [lumps, setLumps] = useState<LumpValue[]>(Array(lumpsQuantity).fill(0))
  const [stereoLumps, setStereoLumps] = useState<LumpValue[][]>([
    Array(lumpsQuantity).fill(0),
    Array(lumpsQuantity).fill(0),
  ])
  const scale = scaleLinear().domain([MIN, MAX]).range([0, lumps.length])

  const updateLumps = () => {
    if (isStereo) {
      const leftDBValue = scale(value[0])
      const rightDBValue = scale(value[1])
      const newLumps = [
        stereoLumps[0].map((_, index) => (index < leftDBValue ? 1 : 0)),
        stereoLumps[1].map((_, index) => (index < rightDBValue ? 1 : 0)),
      ]
      setStereoLumps(newLumps)
    } else {
      const dBValue = scale(value)
      const newLumps = lumps.map((_, index) => (index < dBValue ? 1 : 0))
      setLumps(newLumps)
    }
  }

  useEffect(() => {
    onChange && onChange(value)
    updateLumps()
  }, [value, onChange])

  const { base, lumps: _lumps, lump, axis } = useStyle({ horizontal, isStereo, compact })

  const contextValue = {
    horizontal,
    styles,
    classNames,
    minThresholdValue: scale(MIN_THRESHOLD),
    maxThresholdValue: scale(MAX_THRESHOLD),
    _lumps,
    lump,
  }

  return (
    <VuMeterContextProvider value={contextValue}>
      <div
        {...restProps}
        ref={vuMeterRef}
        className={cn(base(), restProps.className)}
        style={{
          ...restProps.style,
          display: 'flex',
          position: 'relative',
        }}
      >
        {isStereo ? (
          <StereoVuMeter ref={stereoRef} stereoLumps={stereoLumps as LumpValue[][]} />
        ) : (
          <MonoVuMeter ref={monoRef} lumps={lumps as LumpValue[]} />
        )}

        {!hideAxis && (
          <Axis
            vertical={!horizontal}
            tickSize={0}
            {...axisProps}
            relatedRef={isStereo ? stereoRef : monoRef}
            className={cn(axis(), classNames?.axis)}
            style={{
              ...styles?.axis,
              position: 'absolute',
              height: '100%',
              width: '100%',
            }}
            min={MIN}
            max={MAX}
          />
        )}
      </div>
    </VuMeterContextProvider>
  )
})

const StereoVuMeter = forwardRef<StereoVuMeterRef, StereoVuMeterProps>((props, ref) => {
  const { stereoLumps } = props
  const { horizontal } = useContext(VuMeterContext)!

  return (
    <div ref={ref} className={cn('flex gap-0.5 w-full', horizontal && 'flex-col')}>
      {stereoLumps.map((lumps: LumpValue[], index: number) => (
        <MonoVuMeter key={index} lumps={lumps} />
      ))}
    </div>
  )
})

const MonoVuMeter = forwardRef<MonoVuMeterRef, MonoVuMeterProps>((props, ref) => {
  const { lumps } = props
  const { horizontal, styles, classNames, minThresholdValue, maxThresholdValue, _lumps, lump } =
    useContext(VuMeterContext)!

  const dataValue = (lumpValue: LumpValue, index: number) => {
    if (lumpValue === 1 && index <= minThresholdValue) return 'low'
    if (lumpValue === 1 && index > maxThresholdValue) return 'high'
    if (lumpValue === 1 && index <= maxThresholdValue) return 'medium'
    return 'none'
  }

  return (
    <div
      ref={ref}
      className={cn(_lumps(), classNames?.lumps)}
      style={{
        ...styles?.lumps,
        flexDirection: horizontal ? 'row' : 'column-reverse',
      }}
    >
      {lumps.map((lumpValue: LumpValue, index: number) => (
        <span
          key={index}
          data-active={dataValue(lumpValue, index)}
          className={cn(
            lump(),
            `data-[active=low]:bg-amber-500
            data-[active=medium]:bg-amber-400
            data-[active=high]:bg-amber-200
            dark:data-[active=low]:bg-amber-600
            dark:data-[active=medium]:bg-amber-500
            dark:data-[active=high]:bg-amber-300`,
            classNames?.lump,
          )}
          style={styles?.lump}
        />
      ))}
    </div>
  )
})
