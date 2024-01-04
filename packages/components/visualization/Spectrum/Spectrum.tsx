import * as d3 from 'd3'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { cn } from '../../../lib/utils'
import { SpectrumProps, SpectrumRef, SpectrumDataPoint } from './types'
import { useStyle } from './styles'
import {
  HEIGHT,
  LINE_COLOR,
  LINE_WIDTH,
  SHADOW_COLOR,
  WIDTH,
  DATA,
  PADDING_LEFT,
  PADDING_RIGHT,
  PADDING_TOP,
  PADDING_BOTTOM,
  SHADOW_DIRECTION,
  SHADOW_HEIGHT,
} from './constants'

type GridData = { x: number; y: number }

export const Spectrum = forwardRef<SpectrumRef, SpectrumProps>((props, ref) => {
  const {
    data = DATA,
    lineColor = LINE_COLOR,
    lineWidth = LINE_WIDTH,
    grid = false,
    shadow = false,
    shadowColor = SHADOW_COLOR,
    shadowDirection = SHADOW_DIRECTION,
    shadowHeight = SHADOW_HEIGHT,
    paddingLeft = PADDING_LEFT,
    paddingRight = PADDING_RIGHT,
    paddingTop = PADDING_TOP,
    paddingBottom = PADDING_BOTTOM,
    onDataChange,
    ...restProps
  } = props

  useImperativeHandle(ref, () => spectrumRef.current as SpectrumRef)

  const spectrumRef = useRef<SpectrumRef | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const chartDimensions = useRef({ width: WIDTH, height: HEIGHT })

  useEffect(() => {
    if (!spectrumRef.current) return
    initShadowGradient()
    generateGrid()

    const resizeObserver = new ResizeObserver((entires) => {
      if (!entires.length) return
      const { width, height } = entires[0].contentRect
      chartDimensions.current = { width, height }
      updateChart()
      generateGrid()
    })

    resizeObserver.observe(spectrumRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    onDataChange && onDataChange(data!)
    updateChart()
  }, [data, onDataChange])

  // Update the chart, executed every time the data is updated
  const updateChart = () => {
    if (!data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('g.chart').remove()

    const { width, height } = chartDimensions.current

    const g = svg.append('g').attr('class', 'chart').attr('width', width).attr('height', height)
    const maxY = d3.max(data, (d) => d.amplitude) || 0
    const minY = d3.min(data, (d) => d.amplitude) || 0
    const domainMin = Math.min(minY, 0)

    g.append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', lineWidth)

    // Update scale
    const x = d3
      .scaleLinear()
      .domain([0, data?.length - 1])
      .range([paddingLeft + 1, width - paddingRight - 1])
    const y = d3
      .scaleLinear()
      .domain([domainMin, maxY])
      .range([height - 10 - paddingBottom, 10 + paddingTop])

    // Update line generator
    const lineGenerator = d3
      .line<SpectrumDataPoint>()
      .x((d) => x(d.frequency))
      .y((d) => y(d.amplitude))
      .curve(d3.curveNatural)

    // Bind new data and apply transitions
    g.selectAll('path.line')
      .data([data])
      .join('path')
      .attr('class', 'line')
      .attr('d', (d) => lineGenerator(d))

    // Create the area generator, to be used for the shadow
    const areaGenerator = d3
      .area<SpectrumDataPoint>()
      .x((d) => x(d.frequency))
      .y0((d) => y(d.amplitude))
      .y1(shadowDirection === 'top' ? 0 : height)
      .curve(d3.curveNatural)

    g.selectAll('path.area')
      .data([data])
      .join('path')
      .attr('class', 'area')
      .attr('d', (d) => areaGenerator(d))
      .attr('fill', 'url(#echo-area-gradient)')
  }

  // Create the grid lines on brackground
  const generateGrid = () => {
    if (!grid) return

    const svg = d3.select(svgRef.current)
    const gridSpacing = 10
    const width = svgRef?.current?.clientWidth || WIDTH
    const height = svgRef?.current?.clientHeight || HEIGHT

    svg.select('g.grid').remove()

    const g = svg.append('g').attr('class', 'grid').attr('width', width).attr('height', height)
    const line = d3
      .line<GridData>()
      .x((d) => d.x)
      .y((d) => d.y)

    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSpacing) {
      g.append('path')
        .attr(
          'd',
          line([
            { x: 0, y },
            { x: width, y },
          ]),
        )
        .attr('stroke', 'var(--echo-background)')
        .attr('stroke-width', 0.5)
        .attr('fill', 'none')
    }

    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSpacing) {
      g.append('path')
        .attr(
          'd',
          line([
            { x, y: 0 },
            { x, y: height },
          ]),
        )
        .attr('stroke', 'var(--echo-background)')
        .attr('stroke-width', 0.5)
        .attr('fill', 'none')
    }
  }

  // Create the shadow gradient
  const initShadowGradient = () => {
    if (!shadow) return

    const svg = d3.select(svgRef.current)
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'echo-area-gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%')

    gradient
      .append('stop')
      .attr('offset', `${shadowHeight}%`)
      .attr('stop-color', shadowColor)
      .attr('stop-opacity', 0.4)

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'var(--echo-background)')
      .attr('stop-opacity', 0)
  }

  const { base, chart } = useStyle()

  return (
    <div
      ref={spectrumRef}
      className={cn(base(), restProps.className)}
      style={{
        ...restProps.style,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <svg ref={svgRef} className={cn(chart())} />
    </div>
  )
})
