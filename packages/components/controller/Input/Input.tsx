import { forwardRef, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { scaleLinear } from 'd3'
import { InputProps, InputRef } from './types'
import { MAX, MIN, STEP, SENSITIVITY, DRAGGING_OFFSET, PROGRESS_COLOR, TYPE } from './contants'
import { cn, validValue } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    value: _value = MIN,
    type = TYPE,
    min = MIN,
    max = MAX,
    step = STEP,
    disabled = false,
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

  const startYRef = useRef(0)
  const deltaYRef = useRef(0)
  const isDraggingRef = useRef(false)

  const scale = scaleLinear().domain([min, max]).range([0, 100])
  const radio = scale(value)

  // ============== Input ============== //
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let rawValue = e.target.value
      if (type === 'number') rawValue = handleNumberValue(rawValue) as string
      setValue(rawValue)
      onChange && onChange({ value: rawValue, nativeEvent: e })
    },
    [onChange, type],
  )

  const handleNumberValue = (rawValue: string | number) => {
    if (rawValue === '-' || rawValue === '.' || rawValue === '') return rawValue
    if (isNaN(rawValue as any)) return
    const numericValue = validValue(Number(rawValue), min, max)
    return numericValue
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (type !== 'number') return
    if (value === '') {
      setValue(min)
      onChange && onChange({ value: min })
    }
    onBlur && onBlur(e)
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
      onChange && onChange({ value: newValue })
    },
    [value, min, max, step, onChange],
  )

  const startDragging = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    onMouseDown && onMouseDown(e)

    if (type !== 'number' || prohibitDrag || disabled) return
    startYRef.current = e.clientY
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

  const progressColor = useMemo(() => {
    if (hideProgress) return 'transparent'
    if (disabled) return 'var(--echo-muted)'
    return _progressColor
  }, [hideProgress, disabled, _progressColor])

  const backgroundImage = useMemo(() => {
    if (type !== 'number') return ''
    return `linear-gradient(to right, ${progressColor} ${radio}%, transparent ${radio}%)`
  }, [progressColor, radio])

  return (
    <input
      {...restProps}
      ref={ref}
      data-dragging={isDragging}
      type={type}
      value={value}
      disabled={disabled}
      readOnly={isDragging || restProps.readOnly}
      className={cn(
        STYLES['echo-input'],
        restProps.className,
        isDragging && STYLES['echo-input__dragging'],
      )}
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
