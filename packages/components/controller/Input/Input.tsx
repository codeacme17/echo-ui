import { forwardRef, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { scaleLinear } from 'd3'
import { cn, halfRange, validValue } from '../../../lib/utils'
import { useCommandAltClick } from '../../../hooks/useCommandAltClick'
import { InputProps, InputRef } from './types'
import { useStyle } from './styles'
import {
  MAX,
  MIN,
  STEP,
  SENSITIVITY,
  DRAGGING_OFFSET,
  PROGRESS_COLOR,
  TYPE,
  SIZE,
  RADIUS,
} from './contants'

export const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    value: _value = MIN,
    type = TYPE,
    size = SIZE,
    radius = RADIUS,
    min = MIN,
    max = MAX,
    step = STEP,
    disabled = false,
    bilateral = false,
    prohibitDrag = false,
    sensitivity = SENSITIVITY,
    hideProgress = false,
    progressColor: _progressColor = PROGRESS_COLOR,
    onChange,
    onBlur,
    onMouseDown,
    ...restProps
  } = props

  const [value, setValue] = useState(_value)
  const [isDragging, setIsDragging] = useState(false)
  const [nativeEvent, setNativeEvent] = useState<React.ChangeEvent<HTMLInputElement> | null>(null)
  const [direction, setDirection] = useState<'positive' | 'negative'>('positive')
  const startYRef = useRef(0)
  const deltaYRef = useRef(0)
  const isDraggingRef = useRef(false)
  const scale = scaleLinear().domain([min, max]).range([0, 100])
  const radio = scale(value)

  // ============== Events ============== //
  useEffect(() => {
    if (disabled) return
    const validatedValue = validValue(_value, min, max)
    setValue(validatedValue)
  }, [_value, min, max, disabled])

  const handleResetClick = useCommandAltClick(() => {
    if (type !== 'number') return
    if (bilateral) setValue(halfRange(min, max))
    else setValue(min)
    onChange?.({
      value: bilateral ? halfRange(min, max) : min,
      nativeEvent: nativeEvent!,
    })
  })

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let rawValue = e.target.value
      if (type === 'number') rawValue = handleNumberValue(rawValue) as string
      setValue(rawValue)
      setNativeEvent(e)
      onChange?.({ value: rawValue, nativeEvent: e })
    },
    [type],
  )

  const handleNumberValue = (rawValue: string | number) => {
    if (rawValue === '-' || rawValue === '.' || rawValue === '') return rawValue
    if (isNaN(rawValue as any)) return
    const numericValue = validValue(Number(rawValue), min, max)
    return numericValue
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (type !== 'number') return
    if (value === '') setValue(min)
    onBlur?.(e)
  }

  useEffect(() => {
    if (disabled) return
    if (type === 'number') setValue(handleNumberValue(_value))
    else setValue(_value)
  }, [_value])

  // ============== Dragging ============== //
  const setDragging = (draggingFlag: boolean) => {
    isDraggingRef.current = draggingFlag
    setIsDragging(draggingFlag)
  }

  const handleDragUpdateValue = useCallback(
    (currentY: number) => {
      const deltaY = -(currentY - startYRef.current)
      const deltaValue = deltaY * (sensitivity / 10) * step
      let newValue = value + deltaValue
      newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
      newValue = Math.max(min, Math.min(newValue, max))
      setValue(newValue)
      onChange?.({ value: newValue, nativeEvent: nativeEvent! })
    },
    [value, min, max, step],
  )

  const startDragging = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    onMouseDown?.(e)

    if (type !== 'number' || prohibitDrag || disabled) return
    startYRef.current = e.clientY
    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', stopDragging)

    handleResetClick(e)
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

  const stopDragging = (e: MouseEvent) => {
    setDragging(false)
    document.removeEventListener('mousemove', onDragging)
    document.removeEventListener('mouseup', stopDragging)
    handleResetClick(e)
  }

  // ============== Styles ============== //
  useEffect(() => {
    if (isDragging) document.getElementsByTagName('html')[0].style.cursor = 'ns-resize'
    else document.getElementsByTagName('html')[0].style.cursor = ''
  }, [isDragging])

  const progressColor = useMemo(() => {
    if (hideProgress) return 'transparent'
    if (disabled) return 'var(--echo-muted)'
    return _progressColor
  }, [hideProgress, disabled, _progressColor, disabled])

  const backgroundImage = useMemo(() => {
    if (type !== 'number') return ''

    if (!bilateral) {
      return `linear-gradient(to right, ${progressColor} ${radio}%, transparent ${radio}%)`
    }

    if (value >= halfRange(min, max)) {
      setDirection('positive')
      return `linear-gradient(to right, 
        transparent 50%, 
        ${progressColor} 50%,
        ${progressColor} ${radio}%, 
        transparent ${100 - radio}%)`
    } else {
      setDirection('negative')
      return `linear-gradient(to left, 
        transparent 50%, 
        ${progressColor} 50%,
        ${progressColor} ${100 - radio}%, 
        transparent 0%)`
    }
  }, [progressColor, radio])

  return (
    <input
      {...restProps}
      ref={ref}
      data-dragging={isDragging}
      data-bilateral={direction}
      type={type}
      value={value}
      disabled={disabled}
      readOnly={isDragging || restProps.readOnly}
      className={cn(useStyle({ size, radius, isDragging, bilateral }), restProps.className)}
      style={{
        ...restProps.style,
        backgroundImage,
      }}
      onChange={handleInputChange}
      onMouseDown={startDragging}
      onBlur={handleInputBlur}
    />
  )
})
