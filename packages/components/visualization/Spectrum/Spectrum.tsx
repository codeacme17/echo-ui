import * as d3 from 'd3'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
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

type D3Selection<T extends d3.BaseType> = d3.Selection<T, unknown, null, undefined>

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

  const [initialized, setInitialized] = useState(false)
  const [chartWidth, setChartWidth] = useState(WIDTH)
  const [chartHeight, setChartHeight] = useState(HEIGHT)

  useEffect(() => {
    initChart()
    const resizeObserver = createResizeObserver()
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    updateChart()
    onDataChange && onDataChange(data!)
  }, [data])

  // Initialize the resize observer
  const createResizeObserver = () => {
    const resizeObserver = new ResizeObserver(() => {
      if (!spectrumRef.current) return
      setChartWidth(spectrumRef.current.clientWidth || WIDTH)
      setChartHeight(spectrumRef.current.clientHeight || HEIGHT)
    })

    resizeObserver.observe(spectrumRef.current!)
    return resizeObserver
  }

  // Initialize the chart, executed only once
  const initChart = () => {
    if (initialized || !svgRef.current) return

    const svg = d3.select(svgRef.current)

    initGrid(svg)
    initLine(svg)
    initShadow(svg)
    setInitialized(true)
  }

  const initLine = (svg: D3Selection<SVGSVGElement>) => {
    // Create and store path elements, but do not bind data at this point
    const width = svgRef?.current?.clientWidth || WIDTH
    const height = svgRef?.current?.clientHeight || HEIGHT
    const g = svg.append('g').attr('class', 'line').attr('width', width).attr('height', height)
    g.append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', lineWidth)
  }

  // Create the grid lines on brackground
  const initGrid = (svg: D3Selection<SVGSVGElement>) => {
    if (!grid || !svg) return

    const gridSpacing = 10
    const width = svgRef?.current?.clientWidth || WIDTH
    const height = svgRef?.current?.clientHeight || HEIGHT
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
  const initShadow = (svg: D3Selection<SVGSVGElement>) => {
    if (!shadow || !svg) return

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

  // Update the chart, executed every time the data is updated
  const updateChart = () => {
    if (!data) return

    const svg = d3.select(svgRef.current)
    const g = svg.select('.line')

    const maxY = d3.max(data, (d) => d.amplitude) || 0
    const minY = d3.min(data, (d) => d.amplitude) || 0
    const domainMin = Math.min(minY, 0)
    // Update scale
    const x = d3
      .scaleLinear()
      .domain([0, data?.length - 1])
      .range([paddingLeft, chartWidth - paddingRight])
    const y = d3
      .scaleLinear()
      .domain([domainMin, maxY])
      .range([chartHeight - 10 - paddingBottom, 10 + paddingTop])

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

    // Create the area generator
    const areaGenerator = d3
      .area<SpectrumDataPoint>()
      .x((d) => x(d.frequency))
      .y0((d) => y(d.amplitude))
      .y1(shadowDirection === 'top' ? 0 : chartHeight)
      .curve(d3.curveNatural)

    g.selectAll('path.area')
      .data([data])
      .join('path')
      .attr('class', 'area')
      .attr('d', (d) => areaGenerator(d))
      .attr('fill', 'url(#echo-area-gradient)')
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
