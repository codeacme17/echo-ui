import { useEffect, useRef, useState } from 'react'
import { scaleLinear, select, axisRight } from 'd3'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/log'
import './index.css'

interface VuMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  dB: number
  colors?: Colors
  lumpQuantity?: number
  onDBChange?: (value: number) => void
}

type Colors = {
  lowColor: string
  mediumColor: string
  highColor: string
  lowColorDark?: string
  mediumColorDark?: string
  highColorDark?: string
}

type LumpValue = 0 | 1

const MAX = 5
const MAX_THRESHOLD = 0
const MIN_THRESHOLD = -15
const MIN = -60

const LOW_COLOR = '#76f77c'
const MEDIUM_COLOR = '#fed785'
const HIGH_COLOR = '#f7a57c'

export const VuMeter = ({
  dB = MIN,
  lumpQuantity = 30,
  colors = {
    lowColor: LOW_COLOR,
    mediumColor: MEDIUM_COLOR,
    highColor: HIGH_COLOR,
  },
  onDBChange,
  ...props
}: VuMeterProps) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    if (dB > MAX) logger.warn('VuMeter - dB value is higher than MAX (5)')
    if (dB < MIN) logger.warn('VuMeter - dB value is lower than MIN (-60)')
  }, [])

  const [lumps, setLumps] = useState<LumpValue[]>(Array(lumpQuantity).fill(0))

  const scale = scaleLinear().domain([MIN, MAX]).range([0, lumps.length])
  const dBValue = scale(dB)
  const minThresholdValue = scale(MIN_THRESHOLD)
  const maxThresholdValue = scale(MAX_THRESHOLD)

  useEffect(() => {
    onDBChange && onDBChange(dB)
    const newLumps = lumps.map((_, index) => (index < dBValue ? 1 : 0))
    setLumps(newLumps)
  }, [dBValue, onDBChange])

  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (svgRef.current === null) return

    const element = svgRef.current as SVGSVGElement

    // setting up svg
    const { height } = element.getBoundingClientRect()

    console.log(height)

    const svg = select(svgRef.current!).style('overflow', 'visible')

    const yScale = scaleLinear().domain([MIN, MAX]).range([height, 0])
    const yAxis = axisRight(yScale).ticks(10).tickArguments([10, 's'])
    svg.append('g').call(yAxis)
  }, [svgRef])

  const getLumpColor = (index: number, lumpValue: LumpValue) => {
    if (lumpValue === 0) return 'var(--muted)'
    if (index < minThresholdValue) return colors.lowColor
    if (index < maxThresholdValue) return colors.mediumColor
    return colors.highColor
  }

  return (
    <div className="echo-vumeter">
      {lumps.map((lumpValue: LumpValue, index: number) => (
        <div
          key={index}
          className={cn('echo-vumeter-lump', props.className)}
          style={{ backgroundColor: getLumpColor(index, lumpValue) }}
        />
      ))}

      <div className="flex flex-col absolute h-full w-full translate-x-full">
        <svg ref={svgRef} className="h-full w-full fill-muted" />
      </div>
    </div>
  )
}
