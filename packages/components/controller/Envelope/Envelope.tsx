import * as d3 from 'd3'
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useMemo,
  useImperativeHandle,
  useCallback,
} from 'react'
import { useResizeObserver } from '../../../lib/hooks'
import { cn, fixTo } from '../../../lib/utils'
import { EnvelopeProps, EnvelopeRef, EnvelopeData } from './types'
import { useStyle } from './styles'
import { WIDTH, HEIGHT, LINE_COLOR, LINE_WIDTH, NODE_SIZE, NODE_COLOR, LIMITS } from './constants'

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

  useImperativeHandle(ref, () => envelopeRef.current as EnvelopeRef)

  const envelopeRef = useRef<EnvelopeRef | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const xScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [data, setData] = useState(_data)
  const delayData = useMemo(() => fixTo(data.delay || 0), [data])
  const attackData = useMemo(() => fixTo(data.attack), [data])
  const holdData = useMemo(() => fixTo(data.hold || 0), [data])
  const decayData = useMemo(() => fixTo(data.decay), [data])
  const sustainData = useMemo(() => fixTo(data.sustain), [data])
  const releaseData = useMemo(() => fixTo(data.release), [data])

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

  const dimensions = useResizeObserver<EnvelopeRef>(envelopeRef, WIDTH, HEIGHT, () => {
    generateScales()
    generateLine()
    generateNodes()
  })

  useEffect(() => {
    updateData()
  }, [points])

  useEffect(() => {
    setData(_data)
    updatePointsByPropsData()
    generateScales()
    generateLine()
    generateNodes()
  }, [_data, _limits, onDataChange])

  const generateScales = useCallback(() => {
    const { width, height } = dimensions.current

    xScale.current = d3
      .scaleLinear()
      .domain([0, limits.delay! + limits.attack + limits.hold! + limits.decay + limits.release])
      .range([0 + 2, width - 2])
    yScale.current = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - 2, 2])
  }, [limits])

  const generateLine = useCallback(() => {
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
  }, [points, lineColor, lineWidth])

  const generateNodes = useCallback(() => {
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
  }, [points, nodeColor, nodeSize, isDragging])

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
    let newX = fixTo(d.initialX! + xScale.current!.invert(e.x))
    let newY = fixTo(yScale.current!.invert(yScale.current!(d.initialY!) + e.y))

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
      delay: fixTo(delayPoint.x),
      attack: fixTo(attackPoint.x - delayPoint.x),
      hold: fixTo(holdPoint.x - attackPoint.x),
      decay: fixTo(sustainPoint.x - holdPoint.x),
      sustain: fixTo(sustainPoint.y),
      release: fixTo(releasePoint.x - sustainPoint.x),
    }

    if (_data.delay === undefined) delete newData?.delay
    if (_data.hold === undefined) delete newData?.hold

    setData(newData)
    onDataChange?.(newData)
  }

  const updatePointsByPropsData = () => {
    const delay = fixTo(_data.delay || 0)
    const attack = fixTo(_data.attack)
    const hold = fixTo(_data.hold || 0)
    const decay = fixTo(_data.decay)
    const sustain = fixTo(_data.sustain)
    const release = fixTo(_data.release)

    delayPoint.x = delay
    attackPoint.x = delay + attack
    holdPoint.x = delay + attack + hold
    sustainPoint.x = delay + attack + hold + decay
    sustainPoint.y = sustain
    releasePoint.x = delay + attack + hold + decay + release
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

  const { base, svg } = useStyle()

  return (
    <div ref={envelopeRef} {...restProps} className={cn(base(), restProps.className)}>
      <svg ref={svgRef} className={cn(svg())} />
    </div>
  )
})
