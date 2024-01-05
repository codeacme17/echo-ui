import * as d3 from 'd3'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { cn } from '../../../lib/utils'
import { SpectrumProps, SpectrumRef, SpectrumDataPoint } from './types'
import { useStyle } from './styles'
import { validScaledNaN } from './utils'
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
  FFT_SIZE,
} from './constants'

type GridData = { x: number; y: number }

const sampleRate = 44100
const xAxisTicks = [50, 100, 200, 500, 1000, 2000, 5000, 10000]
const yAxisTicks = [-50, -20]

export const Spectrum = forwardRef<SpectrumRef, SpectrumProps>((props, ref) => {
  const {
    data = DATA,
    fftSize = FFT_SIZE,
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
  const xScale = useRef<d3.ScaleLogarithmic<number, number, never> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)

  useEffect(() => {
    if (!spectrumRef.current) return
    generateScales()
    initShadowGradient()
    generateGrid()
    generateAxis()

    const resizeObserver = new ResizeObserver((entires) => {
      if (!entires.length) return
      const { width, height } = entires[0].contentRect
      chartDimensions.current = { width, height }
      generateScales()
      generateChart()
      generateAxis()
      generateGrid()
    })

    resizeObserver.observe(spectrumRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    onDataChange && onDataChange(data!)
    generateChart()
  }, [data, onDataChange])

  // Update the chart, executed every time the data is updated
  const generateChart = () => {
    if (!data) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('g.chart').remove()

    const { width, height } = chartDimensions.current
    const g = svg.append('g').attr('class', 'chart').attr('width', width).attr('height', height)
    const frequencyResolution = sampleRate / (fftSize * 2)
    const updatedData: SpectrumDataPoint[] = data.map((point, i) => ({
      ...point,
      frequency: i * frequencyResolution,
    }))

    // Update line generator
    const lineGenerator = d3
      .line<SpectrumDataPoint>()
      .x((d) => validScaledNaN(xScale.current, d.frequency))
      .y((d) => validScaledNaN(yScale.current, d.amplitude))
      .curve(d3.curveNatural)
      .curve(d3.curveCatmullRom.alpha(0.5))

    // Bind new data and apply transitions
    g.selectAll('path.line')
      .data([updatedData])
      .join('path')
      .attr('class', 'line')
      .attr('d', lineGenerator)
      .attr('stroke', lineColor)
      .attr('stroke-width', lineWidth)
      .attr('fill', 'none')

    // Create the area generator, to be used for the shadow
    if (shadow) {
      const areaGenerator = d3
        .area<SpectrumDataPoint>()
        .x((d) => validScaledNaN(xScale.current, d.frequency))
        .y((d) => validScaledNaN(yScale.current, d.amplitude))
        .y1(shadowDirection === 'top' ? 0 : height)
        .curve(d3.curveNatural)
        .curve(d3.curveCatmullRom.alpha(0.5))

      g.selectAll('path.area')
        .data([updatedData])
        .join('path')
        .attr('class', 'area')
        .attr('d', areaGenerator)
        .attr('fill', 'url(#echo-area-gradient)')
    }
  }

  // Create the grid lines on brackground
  const generateGrid = () => {
    if (!grid) return

    const svg = d3.select(svgRef.current)
    const { width, height } = chartDimensions.current

    svg.select('g.grid').remove()

    const g = svg.append('g').attr('class', 'grid').attr('width', width).attr('height', height)
    const line = d3
      .line<GridData>()
      .x((d) => d.x)
      .y((d) => d.y)

    xAxisTicks.forEach((tick) => {
      const x = xScale.current!(tick)
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
    })

    yAxisTicks.forEach((tick) => {
      const y = yScale.current!(tick)
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
    })
  }

  const generateAxis = () => {
    const { width, height } = chartDimensions.current
    const svg = d3.select(svgRef.current)
    svg.select('g.x-axis').remove()
    svg.select('g.y-axis').remove()

    const xAxis = d3
      .axisBottom(d3.scaleLog([20, sampleRate / 2], [0, width]))
      .tickValues(xAxisTicks)
      .tickFormat(d3.format('~s'))
      .tickSize(0)
    const yAxis = d3
      .axisRight(d3.scaleLinear([-200, 10], [height, 0]))
      .tickValues(yAxisTicks)
      .tickSize(0)

    svg
      .append('g')
      .attr('class', 'x-axis')
      .call(xAxis)
      .attr('transform', `translate(0, ${height - 10})`)
    svg.append('g').attr('class', 'y-axis').call(yAxis)
    svg.selectAll('.domain').style('display', 'none')
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

  const generateScales = () => {
    const { width, height } = chartDimensions.current

    xScale.current = d3
      .scaleLog()
      .domain([20, sampleRate / 2])
      .range([paddingLeft + 1, width - paddingRight + 3])

    yScale.current = d3
      .scaleLinear()
      .domain([-200, 10])
      .range([height - 10 - paddingBottom, 10 + paddingTop])
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
