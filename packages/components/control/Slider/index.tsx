import { useEffect, useRef, useState } from 'react'
import { SliderProps } from './types'
import { cn } from '../../../lib/utils'
import './styles.css'

export const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 20,
  vertical = false,
  showThumb = true,
  interactive = true,
  value: dynamicValue,
  onChange,
  ...props
}: SliderProps) => {
  const [value, setValue] = useState(defaultValue)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef(null)

  const startDragging = (e: React.MouseEvent) => {
    if (!interactive) return
    setIsDragging(true)
    updateValue(e)
  }

  const onDrag = (e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    updateValue(e)
  }

  const stopDragging = (e: MouseEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    e.stopPropagation()

    if (!sliderRef.current) return
    const slider = sliderRef.current as HTMLDivElement
    const { left, width, bottom, height } = slider.getBoundingClientRect()

    let ratio: number
    if (vertical) ratio = (bottom - e.clientY) / height
    else ratio = (e.clientX - left) / width

    let newValue = ratio * (max - min) + min
    newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
    newValue = Math.max(min, Math.min(newValue, max))

    setValue(newValue)
    if (onChange) onChange(newValue)
  }

  useEffect(() => {
    if (dynamicValue === undefined) return
    setValue(dynamicValue)
  }, [dynamicValue])

  useEffect(() => {
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDragging)

    return () => {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDragging)
    }
  }, [isDragging])

  return (
    <div
      className={cn(
        'echo-slider',
        vertical && 'echo-slider-vertical',
        interactive && 'cursor-pointer',
        props.className,
      )}
      ref={sliderRef}
      onMouseDown={startDragging}
    >
      <div
        className={cn('echo-slider-track', vertical && 'echo-slider-track-vertical')}
        style={{ [vertical ? 'height' : 'width']: `${((value - min) / (max - min)) * 100}%` }}
      />

      {showThumb && (
        <div
          className={cn('echo-slider-thumb', vertical && 'echo-slider-thumb-vertical')}
          style={{ [vertical ? 'bottom' : 'left']: `${((value - min) / (max - min)) * 100}%` }}
        />
      )}
    </div>
  )
}
