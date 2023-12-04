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
  lumpsQuantity = 30,
  lumpColors = {
    lowColor: LOW_COLOR,
    mediumColor: MEDIUM_COLOR,
    highColor: HIGH_COLOR,
  },
  showAxis = false,
  isStero = false,
  lumpClassName,
  lumpsClassName,
  axisClassName,
  onDBChange,
  ...props
}: VuMeterProps) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    if (dB > MAX)
      logger.warn('VuMeter - dB value is higher than MAX (5)')
    if (dB < MIN)
      logger.warn('VuMeter - dB value is lower than MIN (-60)')
  }, [])

  const [lumps, setLumps] = useState<LumpValue[]>(
    Array(lumpsQuantity).fill(0)
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

  const getLumpColor = (index: number, lumpValue: LumpValue) => {
    if (lumpValue === 0) return 'var(--muted)'
    if (index < minThresholdValue) return lumpColors.lowColor
    if (index < maxThresholdValue) return lumpColors.mediumColor
    return lumpColors.highColor
  }

  return (
    <div className={cn('echo-vumeter', props.className)}>
      <div className="flex gap-0.5 w-full">
        <div className={cn('echo-vumeter-lumps', lumpsClassName)}>
          {lumps.map((lumpValue: LumpValue, index: number) => (
            <div
              key={index}
              className={cn(
                'echo-vumeter-lump',
                isStero ? 'w-3' : 'w-6',
                lumpClassName
              )}
              style={{
                backgroundColor: getLumpColor(index, lumpValue),
              }}
            />
          ))}
        </div>

        {isStero && (
          <div className={cn('echo-vumeter-lumps', lumpsClassName)}>
            {lumps.map((lumpValue: LumpValue, index: number) => (
              <div
                key={index}
                className={cn(
                  'echo-vumeter-lump',
                  isStero ? 'w-3' : 'w-6',
                  lumpClassName
                )}
                style={{
                  backgroundColor: getLumpColor(index, lumpValue),
                }}
              />
            ))}
          </div>
        )}
      </div>

      {showAxis && (
        <svg
          ref={svgRef}
          className={cn('echo-vumeter-axis', axisClassName)}
        />
      )}
    </div>
  )
}
