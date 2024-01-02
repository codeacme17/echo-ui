import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { scaleLinear, select, axisRight, axisBottom } from 'd3'
import { cn } from '../../../lib/utils'
import { AxisProps, AxisRef } from './types'
import { useStyle } from './styles'
import { MAX, MIN, TICKS, TICK_SIZE } from './constants'

export const Axis = forwardRef<AxisRef, AxisProps>((props, ref) => {
  const {
    min = MIN,
    max = MAX,
    ticks = TICKS,
    tickSize = TICK_SIZE,
    vertical = false,
    relatedRef,
    ...restProps
  }: AxisProps = props

  useImperativeHandle(ref, () => svgRef.current as SVGSVGElement)

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    initAxis()
  }, [min, max, tickSize, vertical, ticks, width, height, relatedRef])

  const initAxis = () => {
    if (svgRef.current === null) return

    const element = svgRef.current

    if (relatedRef?.current) {
      setWidth(relatedRef.current.clientWidth)
      setHeight(relatedRef.current.clientHeight)
    } else {
      const { height, width } = element.getBoundingClientRect()
      setWidth(width)
      setHeight(height)
    }

    // Clear previous axis
    select(element).selectAll('*').remove()

    // Set up scales and axes
    const yScale = scaleLinear().domain([min, max]).range([height, 0])
    const yAxis = axisRight(yScale).ticks(ticks).tickSize(tickSize)

    const xScale = scaleLinear().domain([min, max]).range([0, width])
    const xAxis = axisBottom(xScale).ticks(ticks).tickSize(tickSize)

    const svg = select(svgRef.current)
    let axisGroup
    if (vertical) axisGroup = svg.append('g').classed('y-axis', true).call(yAxis)
    else axisGroup = svg.append('g').classed('x-axis', true).call(xAxis)

    // Positioning axis
    if (!vertical) axisGroup.attr('transform', `translate(0,${height})`)

    // Remove axis line
    svg.select('.domain').style('display', 'none')
  }

  return (
    <svg
      {...restProps}
      ref={svgRef}
      className={cn(useStyle({ vertical }), restProps.className)}
      style={{
        ...restProps.style,
        width: width,
        height: height,
      }}
    />
  )
})
