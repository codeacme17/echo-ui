import { forwardRef, useEffect, useRef } from 'react'
import * as d3 from 'd3'

import { SpectrumProps, SpectrumRef } from './types'
import { HEIGHT, LINE_COLOR, LINE_WIDTH, MARGINS, SHADOW_COLOR, WIDTH } from './constants'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Spectrum = forwardRef<SpectrumRef, SpectrumProps>((props, ref) => {
  const { data, shadow = false, shadowColor = SHADOW_COLOR, onDataChange, ...restProps } = props

  const spectrumRef = useRef(null)
  const hasInitChart = useRef(false)

  const margin = {
    top: MARGINS.TOP,
    right: MARGINS.RIGHT,
    bottom: MARGINS.BOTTOM,
    left: MARGINS.LEFT,
  }
  const width = WIDTH
  const height = HEIGHT
  const lineColor = LINE_COLOR
  const lineWidth = LINE_WIDTH

  useEffect(() => {
    if (!data) return
    initChart()
    updateChart(data)
    onDataChange && onDataChange(data)
  }, [data])

  const initChart = () => {
    if (hasInitChart.current) return

    const svg = d3.select(spectrumRef.current)
    const g = svg.append('g').attr('transform', `translate(0, ${height / 4})`)

    // Create and store path elements, but do not bind data at this point
    g.append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', lineWidth)

    shadow && initShadow(svg)

    hasInitChart.current = true
  }

  const initShadow = (svg) => {
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
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
  const updateChart = (newData: { frequency: number; amplitude: number }[]) => {
    const svg = d3.select(spectrumRef.current)
    const g = svg.select('g')

    // Update scale
    const x = d3
      .scaleLinear()
      .domain(d3.extent(newData, (d) => d.frequency))
      .range([margin.left, width - margin.right])
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(newData, (d) => d.amplitude)])
      .range([height / 2, 0])

    // Update line generator
    const line = d3
      .line()
      .x((d) => x(d.frequency))
      .y((d) => y(d.amplitude))
      .curve(d3.curveMonotoneX)
      .curve(d3.curveCatmullRom.alpha(0.5))

    // Bind new data and apply transitions
    g.selectAll('path.line')
      .data([newData])
      .join('path')
      .attr('class', 'line')
      .transition()
      .duration(750)
      .attr('d', line)

    // Create the area generator
    const area = d3
      .area()
      .x((d) => x(d.frequency)) // Set the x-coordinate using the x scale and frequency data
      .y0((d) => y(d.amplitude)) // Set the top of the area to match the line (using the y scale and amplitude data)
      .y1(height / 2) // Set the bottom of the area to the middle of the SVG container
      .curve(d3.curveMonotoneX) // Use the same curve type as the line for smoothness

    g.selectAll('path.area')
      .data([newData])
      .join('path')
      .attr('class', 'area')
      .transition()
      .duration(750)
      .attr('d', area)
      .attr('fill', 'url(#area-gradient)') // 应用定义的渐变
  }

  return (
    <div
      ref={ref}
      className={cn(STYLES['echo-spectrum'], restProps.className)}
      style={{
        ...restProps.style,
        padding: 0,
      }}
    >
      <svg
        ref={spectrumRef}
        className={cn(STYLES['echo-spectrum-chart'])}
        style={{
          width: width,
          height: height,
        }}
      />
    </div>
  )
})
