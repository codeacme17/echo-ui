import React, { useEffect, useState, useRef } from 'react'
import { InputProps } from './types'
import { handleValueType } from './utils'
import { cn, validValue } from '../../../lib/utils'
import './styles.css'
import { MAX, MIN, SENSITIVITY, STEP } from './contants'

export const Input = ({
  value: initializeValue = MIN,
  onChange,
  type = 'number',
  placeholder,
  min = MIN,
  max = MAX,
  step = STEP,
  sensitivity = SENSITIVITY,
  ...props
}: InputProps) => {
  const [value, setValue] = useState(initializeValue)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputRect = useRef({ left: 0, height: 0 })
  const startY = useRef(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(validValue(handleValueType(e.target.value, type), min, max))
    onChange && onChange({ value: handleValueType(e.target.value, type), nativeEvent: e })
  }

  const handleDragUpdateValue = (currentY: number) => {
    const deltaY = -(currentY - startY.current)
    let newValue = value + deltaY * sensitivity
    newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
    newValue = Math.max(min, Math.min(newValue, max))
    setValue(newValue)
    onChange && onChange({ value: newValue })
  }

  const startDragging = (e: React.MouseEvent) => {
    startY.current = e.clientY
    inputRect.current = (e.target as HTMLInputElement).getBoundingClientRect()
    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', stopDragging)
  }

  const onDragging = (e: MouseEvent) => {
    if (type !== 'number') return

    const currentY = e.clientY

    if (!isDragging && Math.abs(currentY - startY.current) > 20) {
      setIsDragging(true)
      requestAnimationFrame(() => handleDragUpdateValue(currentY))
    } else if (isDragging) {
      requestAnimationFrame(() => handleDragUpdateValue(currentY))
    }
  }

  const stopDragging = () => {
    setIsDragging(false)
    document.removeEventListener('mousemove', onDragging)
    document.removeEventListener('mouseup', stopDragging)
  }

  useEffect(() => {
    if (isDragging) document.getElementsByTagName('html')[0].style.cursor = 'ns-resize'
    else document.getElementsByTagName('html')[0].style.cursor = ''
  }, [isDragging])

  return (
    <input
      type={type}
      ref={inputRef}
      placeholder={placeholder}
      value={value}
      className={cn('echo-input', isDragging && 'cursor-ns-resize select-none', props.className)}
      onChange={handleInputChange}
      onMouseDown={startDragging}
      style={{
        backgroundImage: `linear-gradient(to right, var(--echo-primary) ${
          (value / MAX) * 100
        }%, transparent ${-(value / MAX) * 100}%)`,
      }}
    />
  )
}
