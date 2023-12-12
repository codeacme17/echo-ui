import { useState, useEffect, useRef, forwardRef } from 'react'
import { scaleLinear, select } from 'd3'

import { cn, validValue } from '../../../lib/utils'
import { KnobProps, KnobRef } from './types'
import { checkPropsIsValid } from './utils'
import { DEFAULT_VALUE, MIN, MAX, ROTATION_RANGE, STEP, SENSITIVITY } from './constants'
import styles from './styles.module.css'

export const Knob = forwardRef<KnobRef, KnobProps>((props, ref) => {
  const {
    value: initialValue = DEFAULT_VALUE,
    min = MIN,
    max = MAX,
    step = STEP,
    disabled = false,
    rotationRange = ROTATION_RANGE,
    sensitivity = SENSITIVITY,
    onChange,
    ...restProps
  }: KnobProps = props

  useEffect(() => {
    checkPropsIsValid({ value: initialValue, min, max, rotationRange })
  }, [])

  const [value, setValue] = useState(validValue(initialValue, min, max))
  const [isDragging, setIsDragging] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const knobRef = useRef(null)

  const scale = scaleLinear().domain([min, max]).range([0, rotationRange])
  const rotation = scale(value)
  const startValue = useRef(value) // Ref to store the initial value
  const startYRef = useRef(0) // Ref to store the initial Y position

  useEffect(() => {
    select(knobRef.current).style('transform', `rotate(${rotation}deg)`)
    setPercentage((rotation / 360) * 100)
  }, [rotation])

  const updateKnobValue = (e: MouseEvent | React.MouseEvent) => {
    e.stopPropagation()

    const deltaY = startYRef.current - e.clientY
    const deltaValue = deltaY * (sensitivity / 10) * step
    let newValue = startValue.current + deltaValue
    newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
    newValue = Math.max(min, Math.min(newValue, max))

    setValue(newValue)
    onChange && onChange(newValue)
  }

  const startDragging = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    startValue.current = value // Store the initial value
    startYRef.current = e.clientY // Store the initial Y position
    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', stopDragging)
  }

  const onDragging = (e: MouseEvent) => {
    e.preventDefault()
    requestAnimationFrame(() => updateKnobValue(e))
  }

  const stopDragging = (e: MouseEvent) => {
    e.preventDefault()
    setIsDragging(false)
    document.removeEventListener('mousemove', onDragging)
    document.removeEventListener('mouseup', stopDragging)
  }

  useEffect(() => {
    if (isDragging) document.getElementsByTagName('body')[0].style.cursor = 'grabbing'
    else document.getElementsByTagName('body')[0].style.cursor = ''
  }, [isDragging])

  return (
    <div
      ref={ref}
      className={cn(
        styles['echo-knob'],
        isDragging && styles['echo-knob__dragging'],
        restProps.className,
      )}
      onMouseDown={startDragging}
    >
      <div
        className={cn(styles['echo-knob-fan'])}
        style={{
          rotate: `-${rotationRange / 2}deg`,
          background: `conic-gradient(var(--echo-primary) 0% ${percentage}%, var(--echo-card) ${percentage}% 100%)`,
        }}
      />

      <div
        className={cn(styles['echo-knob-trigger'])}
        style={{ rotate: `-${rotationRange / 2}deg` }}
        ref={knobRef}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div
          className={cn(
            styles['echo-knob-trigger-pointer'],
            isDragging && styles['echo-knob-trigger-pointer__dragging'],
          )}
        />
      </div>
    </div>
  )
})
