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
  initialX?: number
  initialY?: number
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

    svg.selectAll('circle.echo-circle-node').call(
      // @ts-ignore
      d3.drag<SVGCircleElement, PointType>().on('start', onStartDragging).on('drag', onDragging),
    )
  }

  const onStartDragging = (_: any, d: PointType) => {
    d.initialX = d.x
    d.initialY = d.y
  }

  const onDragging = (
    e: d3.D3DragEvent<SVGCircleElement, PointType, d3.SubjectPosition>,
    d: PointType,
  ) => {
    let newX = d.initialX! + xScale.current!.invert(e.x)
    let newY = yScale.current!.invert(yScale.current!(d.initialY!) + e.y)

    d.x = newX
    d.y = newY

    newX = Math.max(newX, 0)
    newX = Math.min(newX, 1)
    newY = Math.max(newY, 0)
    newY = Math.min(newY, 1)

    switch (d.type) {
      case 'attack':
        newX = Math.min(newX, points[2].x)
        newY = 1
        break
      case 'decay':
        newX = Math.max(newX, points[1].x)
        newX = Math.min(newX, points[3].x)
        points[3].y = newY
        break
      case 'sustain':
        newX = Math.max(newX, points[2].x)
        points[2].y = newY
        break
      case 'release':
        newX = Math.max(newX, points[2].x)
        break
    }

    d.x = newX
    d.y = newY

    console.log(d.x, d.y)

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
      .range([0 + 2, width - 2])
    yScale.current = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - 2, 2])
  }

  const { base, svg: _svg } = useStyle()

  return (
    <div ref={ref} {...restProps} className={cn(base())}>
      <svg ref={svgRef} className={cn(_svg())} />
    </div>
  )
})
