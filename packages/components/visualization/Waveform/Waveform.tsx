import * as d3 from 'd3'
import { forwardRef, useImperativeHandle, useRef, useEffect, useState, useMemo } from 'react'
import { useResizeObserver } from '../../../lib/hooks'
import { cn, fixTwo } from '../../../lib/utils'
import { WaveformProps, WaveformRef } from './types'
import { useStyle } from './styles'
import {
  WIDTH,
  HEIGHT,
  WAVE_COLOR,
  MASK_COLOR,
  WAVE_HEIGHT,
  CURSOR_WIDTH,
  CURSOR_COLOR,
} from './constants'

export const Waveform = forwardRef<WaveformRef, WaveformProps>((props, ref) => {
  const {
    data: _data,
    percentage: _percentage = 0,
    hideCursor = false,
    cursorWidth = CURSOR_WIDTH,
    cursorColor = CURSOR_COLOR,
    waveHeight = WAVE_HEIGHT,
    waveColor = WAVE_COLOR,
    maskColor = MASK_COLOR,
    onMouseMove,
    onMouseLeave,
    onClick,
    ...restProps
  } = props

  useImperativeHandle(ref, () => waveformRef.current as WaveformRef)

  const data = useRef<number[][] | null>(null)
  const waveformRef = useRef<WaveformRef | null>(null)
  const waveRef = useRef<SVGSVGElement | null>(null)
  const maskRef = useRef<SVGSVGElement | null>(null)
  const xScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)

  const [percentage, setPercentage] = useState(_percentage)
  const [cursorX, setCursorX] = useState<number | null>(null)
  const [isHover, setIsHover] = useState(false)

  const dimensions = useResizeObserver(waveformRef, WIDTH, HEIGHT, () => {
    generateScales()
    generateWave()
    generateMask()
  })

  useEffect(() => {
    if (_data.length === 2) data.current = _data as number[][]
    else data.current = [..._data, ..._data] as number[][]
    generateScales()
    generateWave()
    generateMask()
  }, [_data])

  useEffect(() => {
    setPercentage(_percentage)
  }, [_percentage])

  const generateScales = () => {
    const { width, height } = dimensions.current
    const length = data.current?.length ? data.current?.[0].length : 0
    xScale.current = d3.scaleLinear().domain([0, length]).range([0, width])
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
    if (!svg.current || !data.current || data.current.length !== 2) return

    const _svg = d3.select(svg.current)
    _svg.selectAll('*').remove()

    const { width, height } = dimensions.current
    _svg.attr('width', width).attr('height', height)

    const area = d3
      .area<number>()
      .x((_, i) => xScale.current!(i))
      .y0((d) => yScale.current!(-d))
      .y1((d) => yScale.current!(d))

    _svg
      .append('path')
      .datum(data.current[0])
      .attr('class', 'echo-path-area left-channel')
      .attr('d', area)
      .attr('fill', color)

    _svg
      .append('path')
      .datum(data.current[1])
      .attr('class', 'echo-path-area right-channel')
      .attr('d', area)
      .attr('fill', color)
  }

  // =============== Mouse Events ===============
  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, width } = waveformRef.current!.getBoundingClientRect()
    const x = Math.max(0, Math.min(width, e.clientX - left))
    setIsHover(true)
    setCursorX(x)
    onMouseMove?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    setIsHover(false)
    onMouseLeave?.(e)
  }

  const handleMouseClick = (e: React.MouseEvent) => {
    const { width } = waveformRef.current!.getBoundingClientRect()
    const newPercentage = fixTwo((cursorX! / width) * 100)
    setPercentage(newPercentage)
    onClick?.({
      percentage: newPercentage,
      nativeEvent: e,
    })
  }

  const cursorStyle = useMemo(() => {
    return {
      width: cursorWidth,
      left: cursorX ? cursorX - cursorWidth / 2 : 0,
      backgroundColor: isHover ? cursorColor : 'transparent',
    }
  }, [isHover, cursorX, cursorWidth, cursorColor])

  const { base, svg, cursor } = useStyle()

  return (
    <div
      {...restProps}
      ref={waveformRef}
      className={cn(base(), restProps.className)}
      style={{
        height: HEIGHT,
        ...restProps.style,
        overflow: 'hidden',
        userSelect: 'none',
      }}
      onClick={handleMouseClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Wave */}
      <svg ref={waveRef} className={cn(svg())} />

      {/* Mask */}
      <svg
        ref={maskRef}
        className={cn(svg())}
        style={{
          clipPath: `inset(0 ${100 - percentage}% 0 0)`,
        }}
      />

      {!hideCursor && <div className={cn(cursor())} style={cursorStyle} />}
    </div>
  )
})
