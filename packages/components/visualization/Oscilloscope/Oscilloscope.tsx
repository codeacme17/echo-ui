import * as d3 from 'd3'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useResizeObserver } from '../../../lib/hooks'
import { cn, validScaledNaN } from '../../../lib/utils'
import { OscilloscopeProps, OscilloscopeRef, OscilloscopeDataPoint } from './types'
import { useStyle } from './styles'
import { WIDTH, HEIGHT, AMPLITUDE_RANGE, LINE_COLOR, LINE_WIDTH } from './constants'

export const Oscilloscope = forwardRef<OscilloscopeRef, OscilloscopeProps>((props, ref) => {
  const {
    data: _data = [],
    amplitudeRange = AMPLITUDE_RANGE,
    lineColor = LINE_COLOR,
    lineWidth = LINE_WIDTH,
    ...restProps
  } = props

  useImperativeHandle(ref, () => oscilloscopeRef.current as OscilloscopeRef)

  const oscilloscopeRef = useRef<OscilloscopeRef | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const xScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)

  const generateHandler = () => {
    generateScales()
    generateLine()
  }

  const dimensions = useResizeObserver<OscilloscopeRef>(
    oscilloscopeRef,
    WIDTH,
    HEIGHT,
    generateHandler,
  )

  useEffect(() => {
    generateHandler()
  }, [_data])

  const generateLine = () => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('g.echo-g-line').remove()

    if (!_data.length) return
    const { width, height } = dimensions.current
    const g = svg
      .append('g')
      .attr('class', 'echo-g-line')
      .attr('width', width)
      .attr('height', height)

    // Update line generator
    const lineGenerator = d3
      .line<OscilloscopeDataPoint>()
      .x((d) => validScaledNaN(xScale.current, d.index, -100))
      .y((d) => validScaledNaN(yScale.current, d.amplitude, -100))
      .curve(d3.curveNatural)
      .curve(d3.curveCatmullRom.alpha(0.5))

    // Bind new data and apply transitions
    g.selectAll('path.echo-path-line')
      .data([_data])
      .join('path')
      .attr('class', 'echo-path-line')
      .attr('d', lineGenerator)
      .attr('stroke', lineColor)
      .attr('stroke-width', lineWidth)
      .attr('fill', 'none')
  }

  const generateScales = () => {
    const { width, height } = dimensions.current
    xScale.current = d3.scaleLinear().domain([0, _data.length]).range([0, width])
    yScale.current = d3.scaleLinear().domain(amplitudeRange).range([height, 0])
  }

  const { base, chart } = useStyle()

  return (
    <div
      {...restProps}
      ref={oscilloscopeRef}
      className={cn(base(), restProps.className)}
      style={restProps.style}
    >
      <svg ref={svgRef} className={cn(chart())} />
    </div>
  )
})
