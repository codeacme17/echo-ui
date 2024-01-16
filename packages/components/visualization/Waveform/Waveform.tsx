import * as d3 from 'd3'
import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { useResizeObserver } from '../../../lib/hooks'
import { cn } from '../../../lib/utils'
import { useStyle } from './styles'
import { WaveformProps, WaveformRef } from './types'
import { WIDTH, HEIGHT, LINE_COLOR, LINE_WIDTH } from './constants'

export const Waveform = forwardRef<WaveformRef, WaveformProps>((props, ref) => {
  const { data, lineColor = LINE_COLOR, lineWidth = LINE_WIDTH, ...restProps } = props

  useImperativeHandle(ref, () => waveformRef.current as WaveformRef)

  const waveformRef = useRef<WaveformRef | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const dimensions = useResizeObserver(waveformRef, WIDTH, HEIGHT, () => {
    generateWave()
  })

  useEffect(() => {
    generateWave()
  }, [data])

  const generateWave = () => {
    if (!svgRef.current || !data) return

    const { width, height } = dimensions.current

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const points = data.map((d, i) => [i, d])

    const xScale = d3.scaleLinear().domain([0, data.length]).range([0, width])
    const yScale = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([height / 2, 0])

    const line = d3
      .line<[number, number]>()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))

    svg
      .append('path')
      .attr('width', WIDTH)
      .attr('height', height)
      .datum(points)
      .attr('d', line)
      .attr('stroke', lineColor)
      .attr('fill', 'none')
      .attr('stroke-width', lineWidth)
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
