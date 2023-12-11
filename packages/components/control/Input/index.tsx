import React, { useEffect, useState, useRef } from 'react'
import { scaleLinear } from 'd3'
import { InputProps } from './types'
import { MAX, MIN, SENSITIVITY, STEP } from './contants'
import { cn, validValue } from '../../../lib/utils'
import './styles.css'

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
  const inputRect = useRef({ left: 0, height: 0 })
  const startYRef = useRef(0)
  const deltaYRef = useRef(0)
  const isDraggingRef = useRef(false)

  const scale = scaleLinear().domain([min, max]).range([0, 100])
  const radio = scale(value)

  // ============== Input ============== //
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    if (type === 'number') {
      // Iff it's not a valid number string (except or a separate minus sign),
      // don't operate on it
      if (rawValue !== '-' && isNaN(rawValue as any)) return

      let numericValue

      if (rawValue === '-') numericValue = rawValue
      else if (rawValue === '') numericValue = ''
      else numericValue = validValue(Number(rawValue) as number, min, max)

      setValue(numericValue)
      onChange && onChange({ value: validValue(numericValue as number, min, max), nativeEvent: e })
    }

    if (type === 'text') {
      setValue(rawValue)
      onChange && onChange({ value: rawValue, nativeEvent: e })
    }
  }

  const handleInputBlur = () => {
    if (type !== 'number') return
    if (value === '-' || value === '') {
      setValue(min)
      onChange && onChange({ value: min })
    }
  }
  // ============== Dragging ============== //
  const setDragging = (draggingFlag: boolean) => {
    isDraggingRef.current = draggingFlag
    setIsDragging(draggingFlag)
  }

  const handleDragUpdateValue = (currentY: number) => {
    const deltaY = -(currentY - startYRef.current)
    let newValue = value + deltaY * (sensitivity / 10)
    newValue = Math.round(newValue / step) * step
    newValue = Math.max(min, Math.min(newValue, max))
    setValue(newValue)
    onChange && onChange({ value: newValue })
  }

  const startDragging = (e: React.MouseEvent) => {
    startYRef.current = e.clientY
    inputRect.current = (e.target as HTMLInputElement).getBoundingClientRect()
    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', stopDragging)
  }

  const onDragging = (e: MouseEvent) => {
    if (type !== 'number') return
    const currentY = e.clientY

    if (!isDraggingRef.current && Math.abs(currentY - startYRef.current) > 20) {
      setDragging(true)
      deltaYRef.current = currentY > startYRef.current ? -20 : 20
    }

    if (isDraggingRef.current) {
      requestAnimationFrame(() => handleDragUpdateValue(currentY + deltaYRef.current))
    }
  }

  const stopDragging = () => {
    setDragging(false)

    document.removeEventListener('mousemove', onDragging)
    document.removeEventListener('mouseup', stopDragging)
  }

  useEffect(() => {
    if (isDragging) document.getElementsByTagName('html')[0].style.cursor = 'ns-resize'
    else document.getElementsByTagName('html')[0].style.cursor = ''
  }, [isDragging])

  return (
    <input
      onBlur={handleInputBlur}
      placeholder={placeholder}
      value={value}
      className={cn('echo-input', isDragging && 'cursor-ns-resize select-none', props.className)}
      onChange={handleInputChange}
      onMouseDown={startDragging}
      style={{
        userSelect: 'none',
        backgroundImage:
          type === 'number'
            ? `linear-gradient(to right, var(--echo-primary) ${radio}%, transparent ${radio}%)`
            : '',
        ...props.style,
      }}
    />
  )
}
