import { useEffect, useRef } from 'react'
import { scaleLinear, select, axisRight } from 'd3'
import { cn } from '../../../lib/utils'
import { AxiosProps } from './types'
import { MAX, MIN } from './constants'

export const Axis = ({ min = MIN, max = MAX, lumpsQuantity, axisClassName }: AxiosProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const initAxis = () => {
    if (svgRef.current === null) return

    const element = svgRef.current as SVGSVGElement
    const { height } = element.getBoundingClientRect()

    // Set axis
    const svg = select(svgRef.current!)
    const yScale = scaleLinear().domain([min, max]).range([height, 0])
    const yAxis = axisRight(yScale)
      .ticks(lumpsQuantity / 3)
      .tickSize(0)

    // Remove multiple axis
    const g = svg.selectAll('.y-axis').data([null])
    g.enter().append('g').classed('y-axis', true).call(yAxis)

    // Remove axis line
    svg.select('.domain').style('display', 'none')
  }

  useEffect(() => {
    initAxis()
  }, [])

  return <svg ref={svgRef} className={cn('echo-vumeter-axis', axisClassName)} />
}
