import { useEffect, useRef } from 'react'
import { scaleLinear, select, axisRight, axisBottom } from 'd3'
import { cn } from '../../../lib/utils'
import { AxiosProps } from './types'
import { MAX, MIN, TICK_SIZE } from './constants'
import './styles.css'

export const Axis = ({
  min = MIN,
  max = MAX,
  tickSize = TICK_SIZE,
  vertical = false,
  lumpsQuantity,
  ...props
}: AxiosProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const initAxis = () => {
    if (svgRef.current === null) return

    const element = svgRef.current
    const { height, width } = element.getBoundingClientRect()

    // Clear previous axis
    select(element).selectAll('*').remove()

    // Set up scales and axes
    const yScale = scaleLinear().domain([min, max]).range([height, 0])
    const yAxis = axisRight(yScale).ticks(5).tickSize(tickSize)

    const xScale = scaleLinear().domain([min, max]).range([0, width])
    const xAxis = axisBottom(xScale)
      .ticks(lumpsQuantity / 3)
      .tickSize(tickSize)

    const svg = select(svgRef.current)
    let axisGroup
    if (vertical) {
      axisGroup = svg.append('g').classed('y-axis', true).call(yAxis)
    } else {
      axisGroup = svg.append('g').classed('x-axis', true).call(xAxis)
    }

    // Positioning axis
    if (!vertical) {
      axisGroup.attr('transform', `translate(0,${height})`)
    }

    // Remove axis line
    svg.select('.domain').style('display', 'none')
  }

  useEffect(() => {
    initAxis()
  }, [min, max, tickSize, vertical, lumpsQuantity])

  return (
    <svg
      ref={svgRef}
      className={cn('echo-axis', vertical ? 'h-full' : 'w-full', props.className)}
    />
  )
}
