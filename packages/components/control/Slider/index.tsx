import { SliderProps } from './types'
import './styles.css'
import { cn } from '../../../lib/utils'
import { useEffect, useRef, useState } from 'react'

export const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  onChange,
  ...props
}: SliderProps) => {
  const [value, setValue] = useState(defaultValue)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef(null)

  const startDragging = (e: React.MouseEvent) => {
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

    if (sliderRef.current) {
      const slider = sliderRef.current as HTMLDivElement
      const { left, width } = slider.getBoundingClientRect()
      const ratio = (e.clientX - left) / width

      let newValue = ratio * (max - min) + min
      newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
      newValue = Math.max(min, Math.min(newValue, max))

      setValue(newValue)
      if (onChange) onChange(newValue)
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDragging)

    return () => {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDragging)
    }
  }, [isDragging])

  return (
    <div className="echo-slider" ref={sliderRef} onMouseDown={startDragging}>
      <div
        className="echo-slider-track"
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      />
      <div
        className="echo-slider-thumb"
        style={{ left: `${((value - min) / (max - min)) * 100}%` }}
      />

      <p>{value}</p>
    </div>
  )
}
