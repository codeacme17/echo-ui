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
    console.log(dB)
    if (dB > MAX)
      logger.warn('VuMeter - dB value is higher than MAX (5)')
    if (dB < MIN)
      logger.warn('VuMeter - dB value is lower than MIN (-60)')
  }, [])

  const [lumps, setLumps] = useState<LumpValue[]>(
    Array(lumpQuantity).fill(0)
  )

  const scale = scaleLinear()
    .domain([MIN, MAX])
    .range([0, lumps.length])
  const dBValue = scale(dB)
  const minThresholdValue = scale(MIN_THRESHOLD)
  const maxThresholdValue = scale(MAX_THRESHOLD)

  useEffect(() => {
    onDBChange && onDBChange(dB)
    const newLumps = lumps.map((_, index) =>
      index < dBValue ? 1 : 0
    )
    setLumps(newLumps)
  }, [dBValue, onDBChange])

  const svgRef = useRef<SVGSVGElement | null>(null)
  const initAxis = () => {
    if (svgRef.current === null) return
    const element = svgRef.current as SVGSVGElement
    const { height } = element.getBoundingClientRect()
    const svg = select(svgRef.current!).style('overflow', 'visible')
    const yScale = scaleLinear().domain([MIN, MAX]).range([height, 0])
    const yAxis = axisRight(yScale)
      .ticks(lumpQuantity / 3)
      .tickSize(0)

    const g = svg.selectAll('.y-axis').data([null])
    g.enter().append('g').classed('y-axis', true).call(yAxis)
    svg.select('.domain').style('display', 'none')
  }
  useEffect(() => {
    initAxis()
  }, [])

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
        <svg
          ref={svgRef}
          className="h-full w-full text-muted-foreground select-none"
        />
      </div>
    </div>
  )
}
