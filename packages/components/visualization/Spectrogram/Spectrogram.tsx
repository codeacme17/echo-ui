import * as d3 from 'd3'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { cn } from '../../../lib/utils'
import { SpectrogramProps, SpectrogramRef, SpectrogramDataPoint } from './types'
import { useStyle } from './styles'
import { validScaledNaN } from './utils'
import {
  HEIGHT,
  LINE_COLOR,
  LINE_WIDTH,
  SHADOW_COLOR,
  WIDTH,
  DATA,
  SHADOW_DIRECTION,
  SHADOW_HEIGHT,
  FFT_SIZE,
  X_AXIS_TICKS,
  Y_AXIS_TICKS,
  SAMPLE_RATE,
  AMPLITUDE_RANGE,
  GRID_COLOR,
  AXIS_COLOR,
} from './constants'

type GridData = { x: number; y: number }

export const Spectrogram = forwardRef<SpectrogramRef, SpectrogramProps>((props, ref) => {
  const {
    data = DATA,
    fftSize = FFT_SIZE,
    amplitudeRange = AMPLITUDE_RANGE,
    lineColor = LINE_COLOR,
    lineWidth = LINE_WIDTH,
    axis = false,
    axisColor = AXIS_COLOR,
    xAxisTicks = X_AXIS_TICKS,
    yAxisTicks = Y_AXIS_TICKS,
    grid = false,
    gridColor = GRID_COLOR,
    shadow = false,
    shadowColor = SHADOW_COLOR,
    shadowDirection = SHADOW_DIRECTION,
    shadowHeight = SHADOW_HEIGHT,
    onDataChange,
    ...restProps
  } = props

  useImperativeHandle(ref, () => spectrogramRef.current as SpectrogramRef)

  const spectrogramRef = useRef<SpectrogramRef | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const xScale = useRef<d3.ScaleLogarithmic<number, number, never> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const chartDimensions = useRef({ width: WIDTH, height: HEIGHT })

  useEffect(() => {
    if (!spectrogramRef.current) return
    init()

    const resizeObserver = new ResizeObserver((entires) => {
      if (!entires.length) return
      const { width, height } = entires[0].contentRect
      chartDimensions.current = { width, height }
      update()
    })

    resizeObserver.observe(spectrogramRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    onDataChange?.(data!)
    update()
  }, [data, onDataChange])

  // Initialize the chart,
  // executed only once on mount
  const init = () => {
    generateScales()
    initShadowGradient()
    generateGrid()
    generateAxis()
  }

  // Update the chart,
  // executed every time the data is updated or the chart is resized
  const update = () => {
    generateScales()
    generateGrid()
    generateAxis()
    generateLine()
    generateShadow()
  }

  // Update the chart, executed every time the data is updated
  const generateLine = () => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('g.echo-g-line').remove()

    if (!data.length) return
    const { width, height } = chartDimensions.current
    const g = svg
      .append('g')
      .attr('class', 'echo-g-line')
      .attr('width', width)
      .attr('height', height)
    const frequencyResolution = SAMPLE_RATE / (fftSize * 2)
    const updatedData: SpectrogramDataPoint[] = data.map((point, i) => ({
      ...point,
      frequency: i * frequencyResolution,
    }))

    // Update line generator
    const lineGenerator = d3
      .line<SpectrogramDataPoint>()
      .x((d) => validScaledNaN(xScale.current, d.frequency))
      .y((d) => validScaledNaN(yScale.current, d.amplitude))
      .curve(d3.curveNatural)
      .curve(d3.curveCatmullRom.alpha(0.5))

    // Bind new data and apply transitions
    g.selectAll('path.echo-path-line')
      .data([updatedData])
      .join('path')
      .attr('class', 'echo-path-line')
      .attr('d', lineGenerator)
      .attr('stroke', lineColor)
      .attr('stroke-width', lineWidth)
      .attr('fill', 'none')
  }

  // Update the shadow, executed every time the data is updated
  const generateShadow = () => {
    if (!shadow) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('g.echo-g-shadow').remove()

    if (!data.length) return
    const { width, height } = chartDimensions.current
    const g = svg
      .append('g')
      .attr('class', 'echo-g-shadow')
      .attr('width', width)
      .attr('height', height)
    const frequencyResolution = SAMPLE_RATE / (fftSize * 2)
    const updatedData: SpectrogramDataPoint[] = data.map((point, i) => ({
      ...point,
      frequency: i * frequencyResolution,
    }))

    // Create the area generator, to be used for the shadow
    const areaGenerator = d3
      .area<SpectrogramDataPoint>()
      .x((d) => validScaledNaN(xScale.current, d.frequency))
      .y((d) => validScaledNaN(yScale.current, d.amplitude))
      .y1(shadowDirection === 'top' ? 0 : height)
      .curve(d3.curveNatural)
      .curve(d3.curveCatmullRom.alpha(0.5))

    g.selectAll('path.echo-path-shadow')
      .data([updatedData])
      .join('path')
      .attr('class', 'echo-path-shadow')
      .attr('d', areaGenerator)
      .attr('fill', 'url(#echo-area-gradient)')
  }

  // Create the grid lines on brackground
  const generateGrid = () => {
    if (!grid) return

    const svg = d3.select(svgRef.current)
    svg.select('g.echo-g-grid').remove()

    const { width, height } = chartDimensions.current
    const g = svg
      .append('g')
      .attr('class', 'echo-g-grid')
      .attr('width', width)
      .attr('height', height)
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
        .attr('stroke', gridColor)
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
        .attr('stroke', gridColor)
        .attr('stroke-width', 0.5)
        .attr('fill', 'none')
        .attr('transform', 'translate(0, -3)')
    })
  }

  // Create the axis
  const generateAxis = () => {
    if (!axis) return

    const { width, height } = chartDimensions.current
    const svg = d3.select(svgRef.current)
    svg.select('g.echo-g-x-axis').remove()
    svg.select('g.echo-g-y-axis').remove()

    const xAxis = d3
      .axisBottom(d3.scaleLog([20, SAMPLE_RATE / 2], [0, width]))
      .tickValues(xAxisTicks)
      .tickFormat(d3.format('~s'))
      .tickSize(0)
    const yAxis = d3
      .axisRight(d3.scaleLinear(amplitudeRange, [height, 0]))
      .tickValues(yAxisTicks)
      .tickSize(0)

    svg
      .append('g')
      .attr('class', 'echo-g-x-axis')
      .call(xAxis)
      .attr('transform', `translate(0, ${height - 15})`)
      .attr('color', axisColor)
    svg
      .append('g')
      .attr('class', 'echo-g-y-axis')
      .call(yAxis)
      .attr('transform', `translate(0, ${-3})`)
      .attr('color', axisColor)

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

  // Create the scales
  const generateScales = () => {
    const { width, height } = chartDimensions.current

    xScale.current = d3
      .scaleLog()
      .domain([20, SAMPLE_RATE / 2])
      .range([0, width])

    yScale.current = d3.scaleLinear().domain(amplitudeRange).range([height, 0])
  }

  const { base, chart } = useStyle()

  return (
    <div
      ref={spectrogramRef}
      className={cn(base(), restProps.className)}
      style={{
        ...restProps.style,
        padding: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <svg ref={svgRef} className={cn(chart())} />
    </div>
  )
})
