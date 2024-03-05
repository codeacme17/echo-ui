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

type DataItem = { x: number; y: number }

export const LFO = forwardRef<LFORef, LFOProps>((props, ref) => {
  const {
    type = TYPE,
    frequency = FREQUENCY,
    amplitude: _anplitude = AMPLITUDE,
    delay: _delay = DELAY,
    lineWidth = LINE_WIDTH,
    lineColor = LINE_COLOR,
    ...restProps
  } = props

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

    xScale.current = d3.scaleLinear().domain([0, 1]).range([0, width])
    yScale.current = d3.scaleLinear().domain([0, 1]).range([height, 0])
  }

  const generateWave = () => {
    if (type !== 'sine' && type !== 'square' && type !== 'triangle') return

    const { width, height } = dimensions.current
    const svg = d3.select(LFORef.current).select('svg').attr('width', width).attr('height', height)
    svg.selectAll('*').remove()

    // Draw the center line if the amplitude is 0
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

    // Draw the delay line
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

    let data: DataItem[] = []
    switch (type) {
      case 'sine':
        data = generateSineWaveData(svg)
        break
      case 'square':
        data = generateSquareWaveData(svg)
        break
      case 'triangle':
        data = generateTriangleWaveData(svg)
        break
      default:
        break
    }

    const line = d3
      .line<DataItem>()
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

  const generateSineWaveData = (
    svg: d3.Selection<d3.BaseType, unknown, null, undefined>,
  ): { x: number; y: number }[] => {
    if (type !== 'sine' || !svg) return []

    const data = d3.range(0, 1, 0.001).map((x) => {
      const adjustedX = x * 2 * Math.PI * frequency
      const y = Math.sin(adjustedX) * amplitude * 0.5 + 0.5
      return { x, y }
    })

    return data
  }

  const generateSquareWaveData = (
    svg: d3.Selection<d3.BaseType, unknown, null, undefined>,
  ): DataItem[] => {
    if (type !== 'square' || !svg) return []

    const centerY = 0.5
    const halfHeight = centerY * amplitude
    const data = [{ x: 0, y: centerY }].concat(
      d3.range(0, 1, 0.001).map((x) => {
        const adjustedX = x * 2 * Math.PI * frequency
        const y =
          Math.floor(adjustedX / Math.PI) % 2 === 0 ? centerY + halfHeight : centerY - halfHeight
        return { x, y }
      }),
    )

    return data
  }

  const generateTriangleWaveData = (
    svg: d3.Selection<d3.BaseType, unknown, null, undefined>,
  ): DataItem[] => {
    if (type !== 'triangle' || !svg) return []

    const centerY = 0.5
    const data = d3.range(0, 1, 0.001).map((x) => {
      // Adjust the phase so that the waveform starts in the middle of the rising segment
      // and ensure that the starting point is at the center of the Y-axis
      // By mapping the x value to the corresponding position in a cycle,
      // the waveform is in the middle of the rising segment when it starts
      const adjustedX = x * 2 * Math.PI * frequency
      const phase = ((adjustedX + Math.PI / 2) % (2 * Math.PI)) / Math.PI

      let y
      if (phase < 1) y = phase * amplitude
      else y = (2 - phase) * amplitude
      y = y - amplitude / 2 + centerY
      return { x, y }
    })

    return data
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
