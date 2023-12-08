import { useEffect, useState } from 'react'
import { scaleLinear } from 'd3'

import { cn } from '../../../lib/utils'
import { LumpValue, VuMeterProps } from './types'
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
import './styles.css'

import { Axis } from '../Axis'

export const VuMeter = ({
  value,
  onChange,

  lumpsQuantity = DEFAULT_LUMPS_QUANTITY,
  lumpColors = {
    defaultColor: DEFAULT_COLOR,
    lowColor: LOW_COLOR,
    mediumColor: MEDIUM_COLOR,
    highColor: HIGH_COLOR,
  },
  lumpClassName,
  lumpsClassName,

  showAxis = false,
  axisClassName,
  ...props
}: VuMeterProps) => {
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

  useEffect(() => {
    onChange && onChange(value)
    updateLumps()
  }, [value, onChange])

  useEffect(() => {
    checkPropsIsValid(value)
  }, [])

  return (
    <div className={cn('echo-vumeter', props.className)}>
      {isStereo ? (
        <StereoVuMeter
          stereoLumps={stereoLumps as LumpValue[][]}
          lumpClassName={lumpClassName}
          lumpsClassName={lumpsClassName}
          getLumpColor={getLumpColor}
        />
      ) : (
        <MonoVuMeter
          lumps={lumps as LumpValue[]}
          lumpClassName={lumpClassName}
          lumpsClassName={lumpsClassName}
          getLumpColor={getLumpColor}
        />
      )}

      {showAxis && (
        <Axis
          min={MIN}
          max={MAX}
          lumpsQuantity={lumpsQuantity}
          axisClassName={axisClassName}
          vertical
        />
      )}
    </div>
  )
}

const MonoVuMeter = ({
  lumps,
  lumpClassName = '',
  lumpsClassName = '',
  getLumpColor,
}: {
  lumps: LumpValue[]
  lumpClassName?: string
  lumpsClassName?: string
  getLumpColor: (index: number, lumpValue: LumpValue) => string
}) => {
  return (
    <div className={cn('echo-vumeter-lumps', lumpsClassName)}>
      {lumps.map((lumpValue: LumpValue, index: number) => (
        <div
          key={index}
          className={cn('echo-vumeter-lump', 'w-6', lumpClassName)}
          style={{
            backgroundColor: getLumpColor(index, lumpValue),
          }}
        />
      ))}
    </div>
  )
}

const StereoVuMeter = ({
  stereoLumps,
  lumpClassName = '',
  lumpsClassName = '',
  getLumpColor,
}: {
  stereoLumps: LumpValue[][]
  lumpClassName?: string
  lumpsClassName?: string
  getLumpColor: (index: number, lumpValue: LumpValue) => string
}) => {
  return (
    <div className="flex gap-0.5 w-full">
      {stereoLumps.map((lumps: LumpValue[], index: number) => (
        <MonoVuMeter
          key={index}
          lumps={lumps}
          lumpClassName={cn('w-3', lumpClassName)}
          lumpsClassName={lumpsClassName}
          getLumpColor={getLumpColor}
        />
      ))}
    </div>
  )
}
