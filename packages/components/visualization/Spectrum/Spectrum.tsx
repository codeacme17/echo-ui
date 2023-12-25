import { forwardRef, useEffect, useRef } from 'react'
import * as d3 from 'd3'

import { SpectrumProps, SpectrumRef } from './types'
import { HEIGHT, MARGINS, WIDTH } from './constants'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Spectrum = forwardRef<SpectrumRef, SpectrumProps>((props, ref) => {
  const { data, ...restProps } = props

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
  const lineColor = 'var(--echo-primary)'
  const lineWidth = 3

  useEffect(() => {
    initChart()
  }, [])

  useEffect(() => {
    if (!data) return
    updateChart(data)
  }, [data])

  const initChart = () => {
    if (hasInitChart.current) return

    const svg = d3.select(spectrumRef.current)

    const g = svg.append('g').attr('transform', `translate(0, ${height / 4})`)

    // Create and store path elements, but do not bind data at this point
    g.append('path').attr('fill', 'none').attr('stroke', lineColor).attr('stroke-width', lineWidth)

    hasInitChart.current = true
  }

  // 更新图表，每次数据更新时执行
  const updateChart = (newData: { frequency: number; amplitude: number }[]) => {
    const svg = d3.select(spectrumRef.current)
    const g = svg.select('g')

    // 更新比例尺
    const x = d3
      .scaleLinear()
      .domain(d3.extent(newData, (d) => d.frequency))
      .range([margin.left, width - margin.right])
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(newData, (d) => d.amplitude)])
      .range([height / 2, 0])

    // 更新线生成器
    const line = d3
      .line()
      .x((d) => x(d.frequency))
      .y((d) => y(d.amplitude))
      .curve(d3.curveMonotoneX)

    // 绑定新数据并应用过渡
    g.selectAll('path').datum(newData).transition().duration(750).attr('d', line)
  }

  return (
    <div
      ref={ref}
      className={cn(STYLES['echo-spectrum'], restProps.className)}
      style={{
        ...restProps.style,
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
