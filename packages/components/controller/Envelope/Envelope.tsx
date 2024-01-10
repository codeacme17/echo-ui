import * as d3 from 'd3'
import { forwardRef, useEffect, useRef } from 'react'
import { cn } from '../../../lib/utils'
import { EnvelopeProps, EnvelopeRef } from './types'
import { useStyle } from './styles'
import { WIDTH, HEIGHT, LINE_COLOR, LINE_WIDTH } from './constants'

type PointType = { x: number; y: number }

export const Envelope = forwardRef<EnvelopeRef, EnvelopeProps>((props, ref) => {
  const { data, lineColor = LINE_COLOR, lineWidth = LINE_WIDTH, ...restProps } = props

  const svgRef = useRef<SVGSVGElement>(null)
  const svgDimensions = useRef({ width: WIDTH, height: HEIGHT })

  useEffect(() => {
    generateCurve()

    const resizeObserver = new ResizeObserver((entires) => {
      if (!entires.length) return
      const { width, height } = entires[0].contentRect
      svgDimensions.current = { width, height }
      generateCurve()
    })

    resizeObserver.observe(svgRef.current as SVGSVGElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const generateCurve = () => {
    const svg = d3.select(svgRef.current)

    svg.selectAll('*').remove()

    const { width, height } = svgDimensions.current

    const xScale = d3.scaleLinear().domain([0, 1]).range([0, width])
    const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0])

    const line = d3
      .line<PointType>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))

    const points = [
      { x: 0, y: 0 },
      { x: data.attack, y: 1 },
      { x: data.attack + data.decay, y: data.sustain },
      { x: 1 - data.release, y: data.sustain },
      { x: 1, y: 0 },
    ]

    svg
      .append('path')
      .data([points])
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', lineWidth)
  }

  const { base, svg: _svg } = useStyle()

  return (
    <div ref={ref} {...restProps} className={cn(base())}>
      <svg ref={svgRef} className={cn(_svg())} />
    </div>
  )
})
