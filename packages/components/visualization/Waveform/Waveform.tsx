import * as d3 from 'd3'
import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { useResizeObserver } from '../../../lib/hooks'
import { cn } from '../../../lib/utils'
import { WaveformProps, WaveformRef } from './types'
import { useStyle } from './styles'
import { WIDTH, HEIGHT, LINE_COLOR, LINE_WIDTH } from './constants'

export const Waveform = forwardRef<WaveformRef, WaveformProps>((props, ref) => {
  const { data, lineColor = LINE_COLOR, lineWidth = LINE_WIDTH, ...restProps } = props

  useImperativeHandle(ref, () => waveformRef.current as WaveformRef)

  const waveformRef = useRef<WaveformRef | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const xScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)

  const generateHandler = () => {
    generateScales()
    generateWave()
  }

  const dimensions = useResizeObserver(waveformRef, WIDTH, HEIGHT, generateHandler)

  useEffect(() => {
    generateHandler()
  }, [data])

  const generateWave = () => {
    if (!svgRef.current || !data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions.current

    svg.attr('width', width).attr('height', height)

    const points = data.map((d, i) => [i, d])

    const line = d3
      .line<[number, number]>()
      .x((d) => xScale.current!(d[0]))
      .y((d) => yScale.current!(d[1]))

    const path = svg
      .append('path')
      .attr('class', 'echo-path-line')
      .attr('transform', `translate(0, ${height / 2})`)

    path
      .datum(points)
      .attr('d', line)
      .attr('stroke', lineColor)
      .attr('fill', 'none')
      .attr('stroke-width', lineWidth)
  }

  const generateScales = () => {
    const { width, height } = dimensions.current

    xScale.current = d3.scaleLinear().domain([0, data.length]).range([0, width])
    yScale.current = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([height / 2, 0])
  }

  const { base, svg } = useStyle()

  return (
    <div
      {...restProps}
      ref={waveformRef}
      className={cn(base(), restProps.className)}
      style={{ ...restProps.style }}
    >
      <svg ref={svgRef} className={cn(svg())} />
    </div>
  )
})
