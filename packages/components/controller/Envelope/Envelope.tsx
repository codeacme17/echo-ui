import * as d3 from 'd3'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { cn } from '../../../lib/utils'
import { EnvelopeProps, EnvelopeRef, EnvelopeData } from './types'
import { useStyle } from './styles'
import { WIDTH, HEIGHT, LINE_COLOR, LINE_WIDTH, NODE_SIZE, NODE_COLOR, LIMITS } from './constants'

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
    limits: _limits = LIMITS,
    lineColor = LINE_COLOR,
    lineWidth = LINE_WIDTH,
    nodeColor = NODE_COLOR,
    nodeSize = NODE_SIZE,
    onDataChange,
    ...restProps
  } = props

  const svgRef = useRef<SVGSVGElement>(null)
  const svgDimensions = useRef({ width: WIDTH, height: HEIGHT })
  const xScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const [data, setData] = useState(_data)
  const [points, setPoints] = useState<PointType[]>([
    { type: 'delay', x: _data.delay || 0, y: 0 },
    { type: 'attack', x: (_data.delay || 0) + _data.attack, y: 1 },
    { type: 'hold', x: (_data.delay || 0) + _data.attack + (_data.hold || 0), y: 1 },
    {
      type: 'sustain',
      x: (_data.delay || 0) + _data.decay + _data.attack + (_data.hold || 0),
      y: _data.sustain,
    },
    {
      type: 'release',
      x: (_data.delay || 0) + _data.decay + _data.attack + (_data.hold || 0) + _data.release,
      y: 0,
    },
  ])
  const [isDragging, setIsDragging] = useState(false)

  const limits = { ...LIMITS, ..._limits }

  const delayPoint = points[0]
  const attackPoint = points[1]
  const holdPoint = points[2]
  // const decayPoint = points[3]
  const sustainPoint = points[3]
  const releasePoint = points[4]

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

  useEffect(() => {
    generateScales()
    generateLine()
    generateNodes()
  }, [_data])

  const generateLine = () => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('path.echo-path-line').remove()

    const drawLine = d3
      .line<PointType>()
      .x((d) => xScale.current!(d.x))
      .y((d) => yScale.current!(d.y))

    for (let i = 0; i < points.length - 1; i++) {
      const lineData = [points[i], points[i + 1]]

      svg
        .append('path')
        .data([lineData])
        .attr('class', 'echo-path-line')
        .attr('d', drawLine)
        .attr('fill', 'none')
        .attr('stroke', lineColor)
        .attr('stroke-width', lineWidth)
    }
  }

  const filterData = () => {
    const res = points.filter((p) => {
      return Object.keys(data).includes(p.type)
    })
    return res
  }

  const generateNodes = () => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('circle.echo-circle-node').remove()
    svg
      .selectAll('circle')
      .data(filterData())
      .enter()
      .append('circle')
      .attr('class', 'echo-circle-node cursor-pointer')
      .attr('type', (d) => d.type)
      .attr('cx', (d) => xScale.current!(d.x))
      .attr('cy', (d) => yScale.current!(d.y))
      .attr('fill', 'var(--echo-card)')
      .attr('r', nodeSize)
      .attr('stroke', nodeColor)
      .attr('stroke-width', 3)

    svg.selectAll('circle.echo-circle-node').call(
      // @ts-ignore
      d3
        .drag<SVGCircleElement, PointType>()
        .on('start', onStartDragging)
        .on('drag', onDragging)
        .on('end', () => {
          setIsDragging(false)
        }),
    )
  }

  const onStartDragging = (_: any, d: PointType) => {
    d.initialX = d.x
    d.initialY = d.y
    setIsDragging(true)
  }

  const onDragging = (
    e: d3.D3DragEvent<SVGCircleElement, PointType, d3.SubjectPosition>,
    d: PointType,
  ) => {
    let newX = d.initialX! + xScale.current!.invert(e.x)
    let newY = yScale.current!.invert(yScale.current!(d.initialY!) + e.y)

    newY = Math.max(newY, 0)
    newY = Math.min(newY, 1)

    switch (d.type) {
      case 'delay':
        newX = Math.min(newX, d.initialX! + limits.delay)
        newX = Math.max(newX, 0)
        attackPoint.x = newX + data.attack
        holdPoint.x = newX + data.attack + (data.hold || 0)
        sustainPoint.x = newX + data.attack + (data.hold || 0) + data.decay
        releasePoint.x = newX + data.attack + (data.hold || 0) + data.decay + data.release
        newY = 0
        break

      case 'attack':
        newX = Math.min(newX, d.initialX! + limits.attack)
        newX = Math.max(newX, delayPoint.x)
        holdPoint.x = newX + (data.hold || 0)
        sustainPoint.x = newX + (data.hold || 0) + data.decay
        releasePoint.x = newX + (data.hold || 0) + data.decay + data.release
        newY = 1
        break

      case 'hold':
        newX = Math.min(newX, d.initialX! + limits.hold)
        newX = Math.max(newX, attackPoint.x)
        sustainPoint.x = newX + data.decay
        releasePoint.x = newX + data.decay + data.release
        newY = 1
        break

      case 'sustain':
        newX = Math.min(newX, d.initialX! + limits.decay)
        newX = Math.max(newX, holdPoint.x)
        releasePoint.x = newX + data.release
        break

      case 'release':
        newX = Math.min(newX, d.initialX! + limits.release)
        newX = Math.max(newX, sustainPoint.x)
        newY = 0
        break
    }

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
      .domain([0, 1.5])
      .range([0 + 2, width - 2])
    yScale.current = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - 2, 2])
  }

  useEffect(() => {
    if (isDragging) document.getElementsByTagName('body')[0].style.cursor = 'grabbing'
    else document.getElementsByTagName('body')[0].style.cursor = ''
  }, [isDragging])

  const { base, svg: _svg } = useStyle()

  return (
    <div ref={ref} {...restProps} className={cn(base(), restProps.className)}>
      <svg ref={svgRef} className={cn(_svg())} />
    </div>
  )
})
