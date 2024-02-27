import * as d3 from 'd3'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useResizeObserver } from '../../../lib/hooks/useResizeObserver'
import { cn, validValue } from '../../../lib/utils'
import { LFOProps, LFORef } from './types'
import { useStyle } from './styles'
import {
  TYPE,
  DELAY,
  SPEED,
  WIDTH,
  HEIGHT,
  LINE_WIDTH,
  LINE_COLOR,
  MIN,
  MAX,
  FREQUENCY,
} from './constants'

export const LFO = forwardRef<LFORef, LFOProps>((props, ref) => {
  const {
    type = TYPE,
    frequency: _frequency = FREQUENCY,
    delay = DELAY,
    speed: _speed = SPEED,
    min = MIN,
    max = MAX,
    lineWidth = LINE_WIDTH,
    lineColor = LINE_COLOR,
    ...restProps
  } = props

  const speed = validValue(_speed, 0.1, 1)
  const frequency = validValue(_frequency, 0, 1)

  const LFORef = useRef<LFORef | null>(null)
  const xScale = useRef<d3.ScaleLinear<number, number> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number> | null>(null)

  useImperativeHandle(ref, () => LFORef.current as LFORef)

  const dimensions = useResizeObserver(LFORef, WIDTH, HEIGHT, () => {
    generateScales()
    generateWave()
  })

  const generateScales = () => {
    const { width, height } = dimensions.current

    xScale.current = d3
      .scaleLinear()
      .domain([0, 4 * Math.PI * (speed * 10)])
      .range([0, width])
    yScale.current = d3.scaleLinear().domain([min, max]).range([height, 0])
  }

  useEffect(() => {
    generateScales()
    generateWave()
  }, [speed, frequency])

  const generateWave = () => {
    generateSineWave()
  }

  const generateSineWave = () => {
    if (type !== 'sine') return

    const { width, height } = dimensions.current

    const svg = d3.select(LFORef.current).select('svg').attr('width', width).attr('height', height)
    svg.selectAll('*').remove()

    const data = d3.range(0, 4 * Math.PI * (speed * 10), 0.01).map((x) => ({
      x,
      y: Math.sin(x) * frequency * (max - min) * 0.5 + (max + min) / 2,
    }))

    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale.current!(d.x))
      .y((d) => yScale.current!(d.y))

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', lineWidth)
      .attr('d', line)
  }

  const { base, svg } = useStyle()

  return (
    <div
      ref={LFORef}
      className={cn(base(), restProps.className)}
      style={{
        ...restProps.style,
        padding: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <svg className={cn(svg())} />
    </div>
  )
})
