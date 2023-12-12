import { forwardRef, useContext, useEffect, useState } from 'react'
import { scaleLinear } from 'd3'

import { Axis } from '../Axis'
import { cn } from '../../../lib/utils'
import { LumpValue, VuMeterProps, VuMeterRef } from './types'
import { VuMeterContext, VuMeterContextProvider } from './context'
import { checkPropsIsValid } from './utils'
import {
  DEFAULT_COLOR,
  LOW_COLOR,
  MEDIUM_COLOR,
  HIGH_COLOR,
  DEFAULT_LUMPS_QUANTITY,
  MIN,
  MAX,
  MIN_THRESHOLD,
  MAX_THRESHOLD,
} from './constants'
import styles from './styles.module.css'

export const VuMeter = forwardRef<VuMeterRef, VuMeterProps>((props, ref) => {
  const {
    value,
    lumpsQuantity = DEFAULT_LUMPS_QUANTITY,
    lumpColors = {
      defaultColor: DEFAULT_COLOR,
      lowColor: LOW_COLOR,
      mediumColor: MEDIUM_COLOR,
      highColor: HIGH_COLOR,
    },
    lumpClassName,
    lumpsClassName,
    vertical = true,
    showAxis = false,
    axisProps,
    onChange,
    ...restProps
  }: VuMeterProps = props

  useEffect(() => {
    checkPropsIsValid({ value })
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

  const getLumpColor = (index: number, lumpValue: LumpValue) => {
    const minThresholdValue = scale(MIN_THRESHOLD)
    const maxThresholdValue = scale(MAX_THRESHOLD)

    if (lumpValue === 0) return lumpColors.defaultColor
    if (index < minThresholdValue) return lumpColors.lowColor
    if (index < maxThresholdValue) return lumpColors.mediumColor
    return lumpColors.highColor
  }

  const contextValue = {
    vertical,
    lumpClassName,
    lumpsClassName,
    getLumpColor,
  }

  useEffect(() => {
    onChange && onChange(value)
    updateLumps()
  }, [value, onChange])

  return (
    <VuMeterContextProvider value={contextValue}>
      <div ref={ref} className={cn(styles['echo-vumeter'], restProps.className)}>
        {isStereo ? (
          <StereoVuMeter stereoLumps={stereoLumps as LumpValue[][]} />
        ) : (
          <MonoVuMeter lumps={lumps as LumpValue[]} />
        )}

        {showAxis && (
          <Axis
            min={MIN}
            max={MAX}
            className={cn('absolute', vertical ? 'ml-8' : 'mt-1')}
            vertical={vertical}
            {...axisProps}
          />
        )}
      </div>
    </VuMeterContextProvider>
  )
})

const MonoVuMeter = ({ lumps }: { lumps: LumpValue[] }) => {
  const { vertical, lumpClassName, lumpsClassName, getLumpColor } = useContext(VuMeterContext)!

  return (
    <div
      className={cn(
        styles['echo-vumeter-lumps'],
        vertical && styles['echo-vumeter-lumps__vertical'],
        lumpsClassName,
      )}
    >
      {lumps.map((lumpValue: LumpValue, index: number) => (
        <div
          key={index}
          className={cn(
            styles['echo-vumeter-lump'],
            vertical && styles['echo-vumeter-lump__vertical'],
            lumpClassName,
          )}
          style={{
            backgroundColor: getLumpColor(index, lumpValue),
          }}
        />
      ))}
    </div>
  )
}

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
