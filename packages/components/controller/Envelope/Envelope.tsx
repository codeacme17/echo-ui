import * as d3 from 'd3'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { cn } from '../../../lib/utils'
import { EnvelopeProps, EnvelopeRef, EnvelopeData } from './types'
import { useStyle } from './styles'
import { WIDTH, HEIGHT, LINE_COLOR, LINE_WIDTH, NODE_SIZE, NODE_COLOR } from './constants'

type PointType = {
  type: keyof EnvelopeData | 'start' | 'end'
  x: number
  y: number
}

/**
 * @Reference
 * https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope
 */

export const Envelope = forwardRef<EnvelopeRef, EnvelopeProps>((props, ref) => {
  const {
    data: _data,
    lineColor = LINE_COLOR,
    lineWidth = LINE_WIDTH,
    nodeColor = NODE_COLOR,
    nodeSize = NODE_SIZE,
    ...restProps
  } = props

  const svgRef = useRef<SVGSVGElement>(null)
  const svgDimensions = useRef({ width: WIDTH, height: HEIGHT })
  const xScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const [data, setData] = useState(_data)
  const [points, setPoints] = useState<PointType[]>([
    { type: 'start', x: 0, y: 0 },
    { type: 'attack', x: data.attack, y: 1 },
    { type: 'decay', x: data.decay + data.attack, y: data.sustain },
    { type: 'sustain', x: data.release, y: data.sustain },
    { type: 'end', x: 1, y: 0 },
  ])

  useEffect(() => {
    if (!svgRef.current || !data) return

    generateScales()
    generateLine()
    generateNodes()

    const resizeObserver = new ResizeObserver((entires) => {
      if (!entires.length) return
      const { width, height } = entires[0].contentRect
      svgDimensions.current = { width, height }
      generateScales()
      generateLine()
      generateNodes()
    })

    resizeObserver.observe(svgRef.current as SVGSVGElement)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    generateScales()
    generateLine()
    generateNodes()
  }, [points])

  const generateLine = () => {
    const svg = d3.select(svgRef.current)

    svg.selectAll('path.echo-path-line').remove()

    const line = d3
      .line<PointType>()
      .x((d) => xScale.current!(d.x))
      .y((d) => yScale.current!(d.y))

    svg
      .append('path')
      .data([points])
      .attr('class', 'echo-path-line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', lineWidth)
  }

  const generateNodes = () => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('circle.echo-circle-node').remove()

    svg
      .selectAll('circle')
      .data(points.filter((d) => data[d.type as keyof EnvelopeData] !== undefined))
      .enter()
      .append('circle')
      .attr('class', 'echo-circle-node')
      .attr('type', (d) => d.type)
      .attr('cx', (d) => xScale.current!(d.x))
      .attr('cy', (d) => yScale.current!(d.y))
      .attr('fill', nodeColor)
      .attr('r', nodeSize)

    svg.selectAll('circle.echo-circle-node').call(d3.drag().on('drag', onDragging))
  }

  const onDragging = (e, d: PointType) => {
    console.log(e)

    d3.pointer(e, svgRef.current)
    let newX = xScale.current!.invert(e.x)
    let newY = yScale.current!.invert(e.y)

    // console.log(e.x, e.y)
    // console.log(newX, newY)

    switch (d.type) {
      case 'attack':
        newX = Math.min(newX, points[2].x)
        newY = 1
        break
      case 'decay':
        newX = Math.max(newX, points[1].x)
        newX = Math.min(newX, points[3].x)
        break
      case 'sustain':
        newX = Math.max(newX, points[2].x)
        break
      case 'release':
        newX = Math.max(newX, points[2].x)
        break
    }

    newX = Math.max(newX, 0)
    newX = Math.min(newX, 1)
    newY = Math.max(newY, 0)
    newY = Math.min(newY, 1)

    d.x = newX
    d.y = newY

    setPoints((newPoints) => {
      const updatedPoints = newPoints.map((p) => (p.type === d.type ? d : p))
      return updatedPoints
    })
  }

  const generateScales = () => {
    const { width, height } = svgDimensions.current

    xScale.current = d3
      .scaleLinear()
      .domain([0, 1])
      .range([5, width - 5])
    yScale.current = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - 2, 5])
  }

  const { base, svg: _svg } = useStyle()

  return (
    <div ref={ref} {...restProps} className={cn(base())}>
      <svg ref={svgRef} className={cn(_svg())} />
    </div>
  )
})
