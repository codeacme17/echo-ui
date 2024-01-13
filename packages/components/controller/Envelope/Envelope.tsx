import * as d3 from 'd3'
import { forwardRef, useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '../../../lib/utils'
import { EnvelopeProps, EnvelopeRef, EnvelopeData } from './types'
import { useStyle } from './styles'
import { WIDTH, HEIGHT, LINE_COLOR, LINE_WIDTH, NODE_SIZE, NODE_COLOR, LIMITS } from './constants'
import { fixTwo } from './utils'

/**
 * @Reference
 * https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope
 *
 */

type PointType = {
  type: keyof EnvelopeData
  x: number
  y: number
  initialX?: number
  initialY?: number
}

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
  const [isDragging, setIsDragging] = useState(false)

  const [data, setData] = useState(_data)
  const delayData = useMemo(() => fixTwo(data.delay || 0), [data])
  const attackData = useMemo(() => fixTwo(data.attack), [data])
  const holdData = useMemo(() => fixTwo(data.hold || 0), [data])
  const decayData = useMemo(() => fixTwo(data.decay), [data])
  const sustainData = useMemo(() => fixTwo(data.sustain), [data])
  const releaseData = useMemo(() => fixTwo(data.release), [data])

  const [points, setPoints] = useState<PointType[]>([
    { type: 'delay', x: delayData, y: 0 },
    { type: 'attack', x: delayData + attackData, y: 1 },
    { type: 'hold', x: delayData + attackData + holdData, y: 1 },
    { type: 'sustain', x: delayData + attackData + holdData + decayData, y: sustainData },
    { type: 'release', x: delayData + attackData + holdData + decayData + releaseData, y: 0 },
  ])
  const delayPoint = useMemo(() => points[0], [points])
  const attackPoint = useMemo(() => points[1], [points])
  const holdPoint = useMemo(() => points[2], [points])
  const sustainPoint = useMemo(() => points[3], [points])
  const releasePoint = useMemo(() => points[4], [points])

  const limits = useMemo(() => {
    const res = { ...LIMITS, ..._limits }
    if (_data.delay === undefined) res.delay = 0
    if (_data.hold === undefined) res.hold = 0
    return res
  }, [_limits])

  useEffect(() => {
    if (!svgRef.current || !data) return
    updateSvg()

    const resizeObserver = new ResizeObserver((entires) => {
      if (!entires.length) return
      const { width, height } = entires[0].contentRect
      svgDimensions.current = { width, height }
      updateSvg()
    })

    resizeObserver.observe(svgRef.current as SVGSVGElement)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    updateData()
    updateSvg()
  }, [points])

  useEffect(() => {
    setData(_data)
    updatePointsByPropsData()
    updateSvg()
  }, [_data, _limits])

  const updateSvg = () => {
    generateScales()
    generateLine()
    generateNodes()
  }

  const generateLine = () => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('path.echo-path-line').remove()

    const line = d3
      .line<PointType>()
      .x((d) => xScale.current!(d.x))
      .y((d) => yScale.current!(d.y))

    for (let i = 0; i < points.length - 1; i++) {
      const lineData = [points[i], points[i + 1]]

      svg
        .append('path')
        .data([lineData])
        .attr('class', 'echo-path-line')
        .attr('d', line)
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
      .attr('class', `echo-circle-node ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`)
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
  }

  const onEndDragging = () => {
    setIsDragging(false)
  }

  const onDragging = (
    e: d3.D3DragEvent<SVGCircleElement, PointType, d3.SubjectPosition>,
    d: PointType,
  ) => {
    let newX = fixTwo(d.initialX! + xScale.current!.invert(e.x))
    let newY = fixTwo(yScale.current!.invert(yScale.current!(d.initialY!) + e.y))

    switch (d.type) {
      case 'delay':
        newY = 0
        newX = Math.min(newX, limits.delay!)
        newX = Math.max(newX, 0)
        delayPoint.x = newX
        attackPoint.x = newX + attackData
        holdPoint.x = newX + attackData + holdData
        sustainPoint.x = newX + attackData + holdData + decayData
        releasePoint.x = newX + attackData + holdData + decayData + releaseData
        break

      case 'attack':
        newY = 1
        newX = Math.min(newX, delayPoint.x + limits.attack)
        newX = Math.max(newX, delayPoint.x)
        attackPoint.x = newX
        holdPoint.x = newX + holdData
        sustainPoint.x = newX + holdData + decayData
        releasePoint.x = newX + holdData + decayData + releaseData
        break

      case 'hold':
        newY = 1
        newX = Math.min(newX, attackPoint.x + limits.hold!)
        newX = Math.max(newX, attackPoint.x)
        holdPoint.x = newX
        sustainPoint.x = newX + decayData
        releasePoint.x = newX + decayData + releaseData
        break

      case 'sustain':
        newY = Math.max(Math.min(newY, 1), 0)
        newX = Math.min(newX, holdPoint.x + limits.decay)
        newX = Math.max(newX, holdPoint.x)
        sustainPoint.x = newX
        releasePoint.x = newX + releaseData
        break

      case 'release':
        newY = 0
        newX = Math.min(newX, sustainPoint.x + limits.release)
        newX = Math.max(newX, sustainPoint.x)
        releasePoint.x = newX
        break
    }

    d.x = newX
    d.y = newY

    setPoints((newPoints) => {
      const updatedPoints = newPoints.map((p) => (p.type === d.type ? d : p))
      return updatedPoints
    })
  }

  const updateData = () => {
    const newData: EnvelopeData = {
      delay: fixTwo(delayPoint.x),
      attack: fixTwo(attackPoint.x - delayPoint.x),
      hold: fixTwo(holdPoint.x - attackPoint.x),
      decay: fixTwo(sustainPoint.x - holdPoint.x),
      sustain: fixTwo(sustainPoint.y),
      release: fixTwo(releasePoint.x - sustainPoint.x),
    }

    if (_data.delay === undefined) delete newData?.delay
    if (_data.hold === undefined) delete newData?.hold

    setData(newData)
    onDataChange?.(newData)
  }

  const updatePointsByPropsData = () => {
    const delay = fixTwo(_data.delay || 0)
    const attack = fixTwo(_data.attack)
    const hold = fixTwo(_data.hold || 0)
    const decay = fixTwo(_data.decay)
    const sustain = fixTwo(_data.sustain)
    const release = fixTwo(_data.release)

    delayPoint.x = delay
    attackPoint.x = delay + attack
    holdPoint.x = delay + attack + hold
    sustainPoint.x = delay + attack + hold + decay
    sustainPoint.y = sustain
    releasePoint.x = delay + attack + hold + decay + release
  }

  const generateScales = () => {
    const { width, height } = svgDimensions.current

    xScale.current = d3
      .scaleLinear()
      .domain([0, limits.delay! + limits.attack + limits.hold! + limits.decay + limits.release])
      .range([0 + 2, width - 2])
    yScale.current = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - 2, 2])
  }

  useEffect(() => {
    if (isDragging) {
      document.getElementsByTagName('body')[0].style.cursor = 'grabbing'
    } else {
      const svg = d3.select(svgRef.current)
      svg.selectAll('circle.echo-circle-node').attr('class', 'echo-circle-node cursor-pointer')
      document.getElementsByTagName('body')[0].style.cursor = ''
    }
  }, [isDragging])

  const { base, svg: _svg } = useStyle()

  return (
    <div ref={ref} {...restProps} className={cn(base(), restProps.className)}>
      <svg ref={svgRef} className={cn(_svg())} />
    </div>
  )
})
