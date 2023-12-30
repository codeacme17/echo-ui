import { forwardRef, useContext, useEffect, useState } from 'react'
import { scaleLinear } from 'd3'
import { cn } from '../../../lib/utils'
import { LumpValue, VuMeterProps, VuMeterRef } from './types'
import { VuMeterContext, VuMeterContextProvider } from './context'
import { checkPropsIsValid } from './utils'
import { useStyle } from './styles'
import { DEFAULT_LUMPS_QUANTITY, MIN, MAX, MIN_THRESHOLD, MAX_THRESHOLD } from './constants'
import { Axis } from '../Axis'
import STYLES from './styles.module.css'

export const VuMeter = forwardRef<VuMeterRef, VuMeterProps>((props, ref) => {
  const {
    value,
    lumpsQuantity = DEFAULT_LUMPS_QUANTITY,
    vertical = true,
    hideAxis = false,
    axisProps,
    classNames,
    styles,
    onChange,
    ...restProps
  }: VuMeterProps = props

  useEffect(() => {
    checkPropsIsValid(props)
  }, [])

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

  const { base, lumps: _lumps, lump } = useStyle({ vertical })

  const contextValue = {
    vertical,
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
        ref={ref}
        className={cn(base(), restProps.className)}
        style={{
          ...restProps.style,
          display: 'flex',
          position: 'relative',
        }}
      >
        {isStereo ? (
          <StereoVuMeter stereoLumps={stereoLumps as LumpValue[][]} />
        ) : (
          <MonoVuMeter lumps={lumps as LumpValue[]} />
        )}

        {!hideAxis && (
          <Axis
            vertical={vertical}
            {...axisProps}
            className={cn(vertical ? 'ml-8' : 'mt-2', classNames?.axis)}
            style={{
              ...styles?.axis,
              position: 'absolute',
            }}
            min={MIN}
            max={MAX}
          />
        )}
      </div>
    </VuMeterContextProvider>
  )
})

const StereoVuMeter = ({ stereoLumps }: { stereoLumps: LumpValue[][] }) => {
  const { vertical } = useContext(VuMeterContext)!

  return (
    <div className={cn('flex gap-0.5 w-full', !vertical && 'flex-col')}>
      {stereoLumps.map((lumps: LumpValue[], index: number) => (
        <MonoVuMeter key={index} lumps={lumps} />
      ))}
    </div>
  )
}

const MonoVuMeter = ({ lumps }: { lumps: LumpValue[] }) => {
  const { vertical, styles, classNames, minThresholdValue, maxThresholdValue, _lumps, lump } =
    useContext(VuMeterContext)!

  const dataValue = (lumpValue: LumpValue, index: number) => {
    if (lumpValue === 1 && index <= minThresholdValue) return 'low'
    if (lumpValue === 1 && index > maxThresholdValue) return 'high'
    if (lumpValue === 1 && index <= maxThresholdValue) return 'medium'
    return 'none'
  }

  return (
    <div
      className={cn(_lumps({ vertical }), classNames?.lumps)}
      style={{
        ...styles?.lumps,
        flexDirection: vertical ? 'column-reverse' : 'row',
      }}
    >
      {lumps.map((lumpValue: LumpValue, index: number) => (
        <div
          key={index}
          data-active={dataValue(lumpValue, index)}
          className={cn(
            lump(),
            `data-[active=low]:bg-green-500
            data-[active=medium]:bg-amber-500
            data-[active=high]:bg-red-500
            dark:data-[active=low]:bg-green-300
            dark:data-[active=medium]:bg-amber-300
            dark:data-[active=high]:bg-red-300`,
            vertical && STYLES['echo-vumeter-lump__vertical'],
            classNames?.lump,
          )}
          style={styles?.lump}
        />
      ))}
    </div>
  )
}
