import { useEffect, useRef, useState } from 'react'
import { scaleLinear, select, axisRight } from 'd3'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/log'
import { LumpValue, VuMeterProps } from './type'
import './index.css'

const MAX = 5
const MAX_THRESHOLD = 0
const MIN_THRESHOLD = -15
const MIN = -60

const LOW_COLOR = '#76f77c'
const MEDIUM_COLOR = '#fed785'
const HIGH_COLOR = '#f7a57c'

export const VuMeter = ({
  dB,
  onDBChange,

  lumpsQuantity = 30,
  lumpColors = {
    lowColor: LOW_COLOR,
    mediumColor: MEDIUM_COLOR,
    highColor: HIGH_COLOR,
  },
  lumpClassName,
  lumpsClassName,

  isStero = false,

  showAxis = false,
  axisClassName,
  ...props
}: VuMeterProps) => {
  const checkPropsIsValid = () => {
    if (process.env.NODE_ENV !== 'development') return
    // if (dB > MAX)
    //   logger.warn('VuMeter - dB value is higher than MAX (5)')
    // if (dB < MIN)
    //   logger.warn('VuMeter - dB value is lower than MIN (-60)')
  }

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
  const dBValue = !isStero && scale(dB as number)
  const leftDBValue = isStero && scale(dB[0])
  const rightDBValue = isStero && scale(dB[1])
  const minThresholdValue = scale(MIN_THRESHOLD)
  const maxThresholdValue = scale(MAX_THRESHOLD)

  useEffect(() => {
    onDBChange && onDBChange(dB)
    let newLumps: LumpValue[] | LumpValue[][] = []

    if (isStero) {
      console.log(leftDBValue, rightDBValue)
      newLumps = [
        steroLumps[0].map((_, index) =>
          index < leftDBValue ? 1 : 0
        ),
        steroLumps[1].map((_, index) =>
          index < rightDBValue ? 1 : 0
        ),
      ]
      setSteroLumps(newLumps)
    } else {
      newLumps = lumps.map((_, index) => (index < dBValue ? 1 : 0))
      setLumps(newLumps)
    }
  }, [dBValue, onDBChange])

  const getLumpColor = (index: number, lumpValue: LumpValue) => {
    if (lumpValue === 0) return 'var(--muted)'
    if (index < minThresholdValue) return lumpColors.lowColor
    if (index < maxThresholdValue) return lumpColors.mediumColor
    return lumpColors.highColor
  }

  useEffect(() => {
    checkPropsIsValid()
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
        <SoloVuMeter
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

const SoloVuMeter = ({
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
  useEffect(() => {
    console.log(steroLumps, 'steroLumps')
  }, [steroLumps])

  return (
    <div className="flex gap-0.5 w-full">
      {steroLumps.map((lumps: LumpValue[], index: number) => (
        <SoloVuMeter
          key={index}
          lumps={lumps}
          lumpClassName={lumpClassName}
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
