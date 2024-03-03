import * as d3 from 'd3'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useResizeObserver } from '../../../lib/hooks/useResizeObserver'
import { cn, validValue } from '../../../lib/utils'
import { LFOProps, LFORef } from './types'
import { useStyle } from './styles'
import {
  TYPE,
  DELAY,
  WIDTH,
  HEIGHT,
  LINE_WIDTH,
  LINE_COLOR,
  AMPLITUDE,
  FREQUENCY,
} from './constants'

export const LFO = forwardRef<LFORef, LFOProps>((props, ref) => {
  const {
    type = TYPE,
    frequency: _frequency = FREQUENCY,
    amplitude: _anplitude = AMPLITUDE,
    delay: _delay = DELAY,
    lineWidth = LINE_WIDTH,
    lineColor = LINE_COLOR,
    ...restProps
  } = props

  const frequency = validValue(_frequency, 0, 1)
  const amplitude = validValue(_anplitude, 0, 1)
  const delay = validValue(_delay, 0, 100)

  const LFORef = useRef<LFORef | null>(null)
  const xScale = useRef<d3.ScaleLinear<number, number> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number> | null>(null)

  useImperativeHandle(ref, () => LFORef.current as LFORef)

  useEffect(() => {
    generateScales()
    generateWave()
  }, [frequency, amplitude, delay, type, lineWidth, lineColor])

  const dimensions = useResizeObserver(
    LFORef,
    WIDTH,
    HEIGHT,
    () => {
      generateScales()
      generateWave()
    },
    true,
    {
      frequency,
      amplitude,
      delay,
    },
  )

  const generateScales = () => {
    const { width, height } = dimensions.current

    xScale.current = d3
      .scaleLinear()
      .domain([0, 4 * Math.PI * (frequency * 10)])
      .range([0, width])
    yScale.current = d3.scaleLinear().domain([0, 1]).range([height, 0])
  }

  const generateWave = () => {
    if (type !== 'sine' && type !== 'square' && type !== 'triangle') return

    const { width, height } = dimensions.current
    const svg = d3.select(LFORef.current).select('svg').attr('width', width).attr('height', height)

    svg.selectAll('*').remove()

    if (frequency === 0) {
      svg
        .append('line')
        .attr('x1', 0)
        .attr('y1', height / 2)
        .attr('x2', width)
        .attr('y2', height / 2)
        .attr('stroke', lineColor)
        .attr('stroke-width', lineWidth)
    }

    if (delay > 0) {
      svg
        .append('circle')
        .attr('cx', delay)
        .attr('cy', height / 2)
        .attr('r', lineWidth / 2)
        .attr('fill', lineColor)

      svg
        .append('line')
        .attr('x1', 0)
        .attr('y1', height / 2)
        .attr('x2', delay + 1)
        .attr('y2', height / 2)
        .attr('stroke', lineColor)
        .attr('stroke-width', lineWidth)
    }

    generateSineWave(svg)
    generateSquareWave(svg)
  }

  const generateSineWave = (svg: d3.Selection<d3.BaseType, unknown, null, undefined>) => {
    if (type !== 'sine' || !svg) return

    const data = d3.range(0, 4 * Math.PI * (frequency * 10), 0.01).map((x) => {
      const y = Math.sin(x) * amplitude * 0.5 + 0.5
      return { x, y }
    })

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
      .attr('transform', `translate(${delay}, 0)`)
  }

  const generateSquareWave = (svg: d3.Selection<d3.BaseType, unknown, null, undefined>) => {
    if (type !== 'square' || !svg) return

    const halfHeight = 0.5 * amplitude
    const data = [{ x: 0, y: 0.5 }].concat(
      d3.range(0, 4 * Math.PI * (frequency * 10), 0.01).map((x) => {
        const y = Math.floor(x / Math.PI) % 2 === 0 ? 0.5 + halfHeight : 0.5 - halfHeight
        return { x, y }
      }),
    )

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
      .attr('transform', `translate(${delay}, 0)`)
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
