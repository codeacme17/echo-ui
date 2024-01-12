import * as d3 from 'd3'
import { forwardRef, useEffect, useRef, useState, useMemo } from 'react'
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
    { type: 'delay', x: data.delay || 0, y: 0 },
    { type: 'attack', x: (data.delay || 0) + data.attack, y: 1 },
    { type: 'hold', x: (data.delay || 0) + data.attack + (data.hold || 0), y: 1 },
    {
      type: 'sustain',
      x: (data.delay || 0) + data.decay + data.attack + (data.hold || 0),
      y: data.sustain,
    },
    {
      type: 'release',
      x: (data.delay || 0) + data.decay + data.attack + (data.hold || 0) + data.release,
      y: 0,
    },
  ])
  const [isDragging, setIsDragging] = useState(false)

  const limits = { ...LIMITS, ..._limits }

  const delayPoint = useMemo(() => points[0], [data])
  const attackPoint = useMemo(() => points[1], [data])
  const holdPoint = useMemo(() => points[2], [data])
  const sustainPoint = useMemo(() => points[3], [data])
  const releasePoint = useMemo(() => points[4], [data])

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
    updateData()
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

  const generateNodes = () => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('circle.echo-circle-node').remove()
    svg
      .selectAll('circle')
      .data(points.filter((p) => Object.keys(data).includes(p.type)))
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
        .on('end', onEndDragging),
    )
  }

  const onStartDragging = (_: any, d: PointType) => {
    d.initialX = d.x
    d.initialY = d.y
    setIsDragging(true)

    console.log(data.attack, 'data.attack start')
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
        newX = Math.min(newX, limits.delay)
        newX = Math.max(newX, 0)
        delayPoint.x = newX
        attackPoint.x = newX + data.attack
        holdPoint.x = newX + data.attack + (data.hold || 0)
        sustainPoint.x = newX + data.attack + (data.hold || 0) + data.decay
        releasePoint.x = newX + data.attack + (data.hold || 0) + data.decay + data.release
        newY = 0
        break

      case 'attack':
        newX = Math.min(newX, delayPoint.x + limits.attack)
        newX = Math.max(newX, delayPoint.x)
        attackPoint.x = newX
        holdPoint.x = newX + (data.hold || 0)
        sustainPoint.x = newX + (data.hold || 0) + data.decay
        releasePoint.x = newX + (data.hold || 0) + data.decay + data.release
        newY = 1
        break

      case 'hold':
        newX = Math.min(newX, attackPoint.x + limits.hold)
        newX = Math.max(newX, attackPoint.x)
        holdPoint.x = newX
        sustainPoint.x = newX + data.decay
        releasePoint.x = newX + data.decay + data.release
        newY = 1
        break

      case 'sustain':
        newX = Math.min(newX, holdPoint.x + limits.decay)
        newX = Math.max(newX, holdPoint.x)
        sustainPoint.x = newX
        releasePoint.x = newX + data.release
        break

      case 'release':
        newX = Math.min(newX, sustainPoint.x + limits.release)
        newX = Math.max(newX, sustainPoint.x)
        releasePoint.x = newX
        newY = 0
        break
    }

    d.x = newX
    d.y = newY

    setPoints((newPoints) => {
      const updatedPoints = newPoints.map((p) => {
        return p.type === d.type ? d : p
      })
      return updatedPoints
    })
  }

  const updatePoints = (p: PointType) => {}

  const onEndDragging = () => {
    setIsDragging(false)
    console.log(data.attack, 'data.attack end')
  }

  const updateData = () => {
    // console.log(delayPoint.x, 'delayPoint')
    // console.log(attackPoint.x, 'attackPoint')
    // console.log(holdPoint.x, 'holdPoint')
    // console.log(sustainPoint.x, 'sustainPoint')
    // console.log(releasePoint.x, 'releasePoint')

    const newData: EnvelopeData = {
      delay: delayPoint.x,
      attack: attackPoint.x - delayPoint.x,
      hold: holdPoint.x - attackPoint.x,
      decay: sustainPoint.x - holdPoint.x,
      sustain: sustainPoint.y,
      release: releasePoint.x - sustainPoint.x,
    }

    if (!_data.delay) delete newData?.delay
    if (!_data.hold) delete newData?.hold

    setData(newData)
    onDataChange?.(newData)
  }

  const generateScales = () => {
    const { width, height } = svgDimensions.current

    xScale.current = d3
      .scaleLinear()
      .domain([0, 3])
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
