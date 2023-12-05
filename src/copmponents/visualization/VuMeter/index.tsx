import { useEffect, useRef, useState } from 'react'
import { scaleLinear, select, axisRight } from 'd3'

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
import './style.css'

export const VuMeter = ({
  value,
  onValueChange,

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
  const isStero = Array.isArray(value)

  const [lumps, setLumps] = useState<LumpValue[]>(
    Array(lumpsQuantity).fill(0)
  )
  const [steroLumps, setSteroLumps] = useState<LumpValue[][]>([
    Array(lumpsQuantity).fill(0),
    Array(lumpsQuantity).fill(0),
  ])
  const scale = scaleLinear()
    .domain([MIN, MAX])
    .range([0, lumps.length])

  const updateLumps = () => {
    if (isStero) {
      const leftDBValue = scale(value[0])
      const rightDBValue = scale(value[1])
      const newLumps = [
        steroLumps[0].map((_, index) =>
          index < leftDBValue ? 1 : 0
        ),
        steroLumps[1].map((_, index) =>
          index < rightDBValue ? 1 : 0
        ),
      ]
      setSteroLumps(newLumps)
    } else {
      const dBValue = scale(value)
      const newLumps = lumps.map((_, index) =>
        index < dBValue ? 1 : 0
      )
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
    onValueChange && onValueChange(value)
    updateLumps()
  }, [value, onValueChange])

  useEffect(() => {
    checkPropsIsValid(value)
  }, [])

  return (
    <div className={cn('echo-vumeter', props.className)}>
      {isStero ? (
        <SteroVuMeter
          steroLumps={steroLumps as LumpValue[][]}
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
        <VuMeterAxis
          lumpsQuantity={lumpsQuantity}
          axisClassName={axisClassName}
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

const SteroVuMeter = ({
  steroLumps,
  lumpClassName = '',
  lumpsClassName = '',
  getLumpColor,
}: {
  steroLumps: LumpValue[][]
  lumpClassName?: string
  lumpsClassName?: string
  getLumpColor: (index: number, lumpValue: LumpValue) => string
}) => {
  return (
    <div className="flex gap-0.5 w-full">
      {steroLumps.map((lumps: LumpValue[], index: number) => (
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

const VuMeterAxis = ({
  lumpsQuantity,
  axisClassName,
}: {
  lumpsQuantity: number
  axisClassName?: string
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const initAxis = () => {
    if (svgRef.current === null) return

    const element = svgRef.current as SVGSVGElement
    const { height } = element.getBoundingClientRect()

    // Set axis
    const svg = select(svgRef.current!)
    const yScale = scaleLinear().domain([MIN, MAX]).range([height, 0])
    const yAxis = axisRight(yScale)
      .ticks(lumpsQuantity / 3)
      .tickSize(0)

    // Remove multiple axis
    const g = svg.selectAll('.y-axis').data([null])
    g.enter().append('g').classed('y-axis', true).call(yAxis)

    // Remove axis line
    svg.select('.domain').style('display', 'none')
  }

  useEffect(() => {
    initAxis()
  }, [])

  return (
    <svg
      ref={svgRef}
      className={cn('echo-vumeter-axis', axisClassName)}
    />
  )
}
