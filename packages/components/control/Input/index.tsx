import React, { useEffect, useState, useRef } from 'react'
import { scaleLinear } from 'd3'
import { InputProps } from './types'
import { MAX, MIN, SENSITIVITY, STEP, DRAGGING_OFFSET, PROGRESS_COLOR } from './contants'
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
  disabled = false,
  sensitivity = SENSITIVITY,
  draggable = true,
  hideProgress = false,
  progressColor = PROGRESS_COLOR,
  ...props
}: InputProps) => {
  const [value, setValue] = useState(initializeValue)
  const [isDragging, setIsDragging] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputRectRef = useRef({ left: 0, height: 0 })
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
      const handledValue = handleNumberValue(rawValue)
      setValue(handledValue)
      onChange && onChange({ value: validValue(handledValue as number, min, max), nativeEvent: e })
    }

    if (type === 'text') {
      setValue(rawValue)
      onChange && onChange({ value: rawValue, nativeEvent: e })
    }
  }

  const handleNumberValue = (rawValue: any) => {
    if (rawValue !== '-' && rawValue !== '.' && isNaN(rawValue as any)) return

    let numericValue: number | string
    if (rawValue === '-' || rawValue === '.') numericValue = rawValue
    else if (rawValue === '') numericValue = ''
    else numericValue = validValue(Number(rawValue) as number, min, max)

    return numericValue
  }

  const handleInputBlur = () => {
    if (type !== 'number') return
    if (value === '-' || value === '.' || value === '') {
      setValue(min)
      onChange && onChange({ value: min })
    }
  }

  useEffect(() => {
    if (type === 'text') setValue(initializeValue)
    if (type === 'number') setValue(handleNumberValue(initializeValue))
  }, [initializeValue])

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
    if (type !== 'number' || !draggable || disabled) return
    startYRef.current = e.clientY
    inputRectRef.current = (e.target as HTMLInputElement).getBoundingClientRect()
    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', stopDragging)
  }

  const onDragging = (e: MouseEvent) => {
    const currentY = e.clientY

    // Only start dragging if the mouse has moved more than 20px
    if (!isDraggingRef.current && Math.abs(currentY - startYRef.current) > DRAGGING_OFFSET) {
      setDragging(true)
      deltaYRef.current = currentY > startYRef.current ? -DRAGGING_OFFSET : DRAGGING_OFFSET
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

  const getProgressColor = () => {
    if (hideProgress) return 'transparent'
    if (disabled) return 'var(--echo-muted)'
    return progressColor
  }

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={handleInputChange}
      onMouseDown={startDragging}
      onBlur={handleInputBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={cn(
        'echo-input',
        disabled && 'echo-input-disable',
        isDragging && 'echo-input-dragging',
        props.className,
      )}
      readOnly={isDragging}
      style={{
        backgroundImage:
          type === 'number'
            ? `linear-gradient(to right, ${getProgressColor()} ${radio}%, transparent ${radio}%)`
            : '',
        ...props.style,
      }}
    />
  )
}
