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

  const [data, setData] = useState<number[][]>([])
  const [percentage, setPercentage] = useState(_percentage)
  const [cursorX, setCursorX] = useState<number | null>(null)
  const [isHover, setIsHover] = useState(false)
  const waveformRef = useRef<WaveformRef | null>(null)
  const waveRef = useRef<SVGSVGElement | null>(null)
  const maskRef = useRef<SVGSVGElement | null>(null)
  const xScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)
  const yScale = useRef<d3.ScaleLinear<number, number, never> | null>(null)

  const initData = () => {
    if (_data.length !== 2) setData([..._data, ..._data] as number[][])
    else setData(_data as number[][])
  }

  const generateHandler = () => {
    generateScales()
    generateWave()
    generateMask()
  }

  useEffect(() => {
    initData()
  }, [_data])

  useEffect(() => {
    generateHandler()
  }, [data])

  useEffect(() => {
    setPercentage(_percentage)
  }, [_percentage])

  const dimensions = useResizeObserver(waveformRef, WIDTH, HEIGHT, generateHandler)

  const generateScales = () => {
    if (data.length === 0) return
    const { width, height } = dimensions.current
    xScale.current = d3.scaleLinear().domain([0, data[0].length]).range([0, width])
    yScale.current = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([height - height * ((100 - waveHeight) / 200), height * ((100 - waveHeight) / 200)])
  }

  const generateWave = () => {
    generateArea(waveRef, waveColor)
  }

  const generateMask = () => {
    generateArea(maskRef, maskColor)
  }

  const generateArea = (svg: React.MutableRefObject<SVGSVGElement | null>, color: string) => {
    if (!svg.current || !data || data.length !== 2) return

    const _svg = d3.select(svg.current)
    _svg.selectAll('*').remove()

    const { width, height } = dimensions.current
    _svg.attr('width', width).attr('height', height)

    const area = d3
      .area<number>()
      .x((_, i) => xScale.current!(i))
      .y0((d) => yScale.current!(-d))
      .y1((d) => yScale.current!(d))

    // Left Channel
    _svg
      .append('path')
      .datum(data[0])
      .attr('class', 'echo-path-area left-channel')
      .attr('d', area)
      .attr('fill', color)

    // Right Channel
    _svg
      .append('path')
      .datum(data[1])
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
      style={{ width: WIDTH, height: HEIGHT, ...restProps.style, overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseClick}
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

      {!hideCursor && <div className={cn(cursor())} style={{ ...cursorStyle }} />}
    </div>
  )
})
