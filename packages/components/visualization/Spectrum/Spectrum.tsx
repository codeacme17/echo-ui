import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import * as d3 from 'd3'

import { SpectrumProps, SpectrumRef, SpectrumDataPoint } from './types'
import { HEIGHT, LINE_COLOR, LINE_WIDTH, MARGINS, SHADOW_COLOR, WIDTH } from './constants'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Spectrum = forwardRef<SpectrumRef, SpectrumProps>((props, ref) => {
  const {
    data,
    lineColor = LINE_COLOR,
    lineWidth = LINE_WIDTH,
    shadow = false,
    shadowColor = SHADOW_COLOR,
    onDataChange,
    ...restProps
  } = props

  useImperativeHandle(ref, () => spectrumRef.current as SpectrumRef)

  const spectrumRef = useRef<SpectrumRef | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [chartWidth, setChartWidth] = useState(WIDTH)
  const [chartHeight, setChartHeight] = useState(HEIGHT)

  const margin = {
    top: MARGINS.TOP,
    right: MARGINS.RIGHT,
    bottom: MARGINS.BOTTOM,
    left: MARGINS.LEFT,
  }

  // Resize observer
  useEffect(() => {
    initChart()

    const resizeObserver = new ResizeObserver(() => {
      if (!spectrumRef.current) return
      setChartWidth(spectrumRef.current.clientWidth || WIDTH)
      setChartHeight(spectrumRef.current.clientHeight || HEIGHT)
    })

    resizeObserver.observe(spectrumRef.current!)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    updateChart()
    onDataChange && onDataChange(data!)
  }, [data])

  const initChart = () => {
    if (initialized || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    const g = svg.append('g').attr('transform', `translate(0, ${chartHeight / 4})`)

    // Create and store path elements, but do not bind data at this point
    g.append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', lineWidth)

    if (shadow) initShadow(svg)

    setInitialized(true)
  }

  const initShadow = (svg: any) => {
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
      .attr('offset', '20%')
      .attr('stop-color', shadowColor)
      .attr('stop-opacity', 0.5)

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
    const g = svg.select('g')

    // Update scale
    const x = d3
      .scaleLinear()
      .domain([0, data?.length - 1])
      .range([margin.left, chartWidth - margin.right])
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.amplitude)!])
      .range([chartHeight / 2, 0])

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
      .transition()
      .duration(500)
      .attr('d', (d) => lineGenerator(d))

    // Create the area generator
    const areaGenerator = d3
      .area<SpectrumDataPoint>()
      .x((d) => x(d.frequency))
      .y0((d) => y(d.amplitude))
      .y1(chartHeight / 2)
      .curve(d3.curveNatural)

    g.selectAll('path.area')
      .data([data])
      .join('path')
      .attr('class', 'area')
      .transition()
      .duration(500)
      .attr('d', (d) => areaGenerator(d))
      .attr('fill', 'url(#echo-area-gradient)') // 应用定义的渐变
  }

  return (
    <div
      ref={spectrumRef}
      className={cn(STYLES['echo-spectrum'], restProps.className)}
      style={{
        ...restProps.style,
        padding: 0,
      }}
    >
      <svg ref={svgRef} className={cn(STYLES['echo-spectrum-chart'])} />
    </div>
  )
})
