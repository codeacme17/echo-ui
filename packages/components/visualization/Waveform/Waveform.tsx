import * as d3 from 'd3'
import { forwardRef, useImperativeHandle, useRef, useEffect, useMemo } from 'react'
import { useResizeObserver } from '../../../lib/hooks'
import { cn } from '../../../lib/utils'
import { WaveformProps, WaveformRef } from './types'
import { useStyle } from './styles'
import { WIDTH, HEIGHT, WAVE_COLOR, LINE_WIDTH, MASK_COLOR, WAVE_HEIGHT } from './constants'

export const Waveform = forwardRef<WaveformRef, WaveformProps>((props, ref) => {
  const {
    data,
    percentage = 0,
    lineWidth = LINE_WIDTH,
    waveHeight = WAVE_HEIGHT,
    waveColor = WAVE_COLOR,
    maskColor = MASK_COLOR,
    ...restProps
  } = props

  useImperativeHandle(ref, () => waveformRef.current as WaveformRef)

  const waveformRef = useRef<WaveformRef | null>(null)
  const waveRef = useRef<SVGSVGElement | null>(null)
  const maskRef = useRef<SVGSVGElement | null>(null)
  const xScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)

  const generateHandler = () => {
    generateScales()
    generateWave()
    generateMask()
  }

  const dimensions = useResizeObserver(waveformRef, WIDTH, HEIGHT, generateHandler)

  useEffect(() => {
    generateHandler()
  }, [data])

  const generateScales = () => {
    const { width, height } = dimensions.current

    xScale.current = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([2, width - 2])
    yScale.current = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([height - height * ((100 - waveHeight) / 200), height * ((100 - waveHeight) / 200)])
  }

  const generateWave = () => {
    generatePath(waveRef, waveColor)
  }

  const generateMask = () => {
    generatePath(maskRef, maskColor)
  }

  const generatePath = (svg: React.MutableRefObject<SVGSVGElement | null>, color: string) => {
    if (!svg || !data) return
    const _svg = d3.select(svg.current)
    _svg.selectAll('*').remove()

    const { width, height } = dimensions.current
    _svg.attr('width', width).attr('height', height)

    const line = d3
      .line<[number, number]>()
      .x((d) => xScale.current!(d[0]))
      .y((d) => yScale.current!(d[1]))

    const path = _svg.selectAll('.echo-path-line').data([data.map((d, i) => [i, d])])

    path
      .enter()
      .append('path')
      .attr('class', 'echo-path-line')
      .attr('d', (d) => line(d as [number, number][]))
      .attr('stroke', color)
      .attr('fill', 'none')
      .attr('stroke-width', lineWidth)
  }

  const calculateClipPath = useMemo(() => {
    return `inset(0 ${100 - percentage}% 0 0)`
  }, [percentage, dimensions])

  const { base, svg } = useStyle()

  return (
    <div
      {...restProps}
      ref={waveformRef}
      className={cn(base(), restProps.className)}
      style={{ width: WIDTH, height: HEIGHT, ...restProps.style }}
    >
      {/* Wave */}
      <svg ref={waveRef} className={cn(svg())} />

      {/* Mask */}
      <svg
        ref={maskRef}
        className={cn(svg())}
        style={{
          clipPath: calculateClipPath,
        }}
      />
    </div>
  )
})
