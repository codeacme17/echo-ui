import React, { useState, useEffect, useRef } from 'react'
import { scaleLinear, select } from 'd3'

import { cn } from '../../../lib/utils'
import { KnobProps } from './types'
import { DEFAULT_VALUE, MIN, MAX, ROTATION_RANGE, STEP, SENSITIVITY } from './constants'
import './styles.css'

export const Knob = ({
  value: initialValue = DEFAULT_VALUE,
  min = MIN,
  max = MAX,
  step = STEP,
  disabled = false,
  rotationRange = ROTATION_RANGE,
  sensitivity = SENSITIVITY,
  onChange,
  ...props
}: KnobProps) => {
  const [value, setValue] = useState(initialValue)
  const [isDragging, setIsDragging] = useState(false)
  const knobRef = useRef(null)

  const scale = scaleLinear().domain([min, max]).range([0, rotationRange])
  const rotation = scale(value)
  const startValue = useRef(value) // Ref to store the initial value
  const startYRef = useRef(0) // Ref to store the initial Y position

  useEffect(() => {
    select(knobRef.current).style('transform', `rotate(${rotation}deg)`)
  }, [rotation])

  const updateKnobValue = (e: MouseEvent | React.MouseEvent) => {
    e.stopPropagation()

    const deltaY = startYRef.current - e.clientY
    const deltaValue = deltaY * (sensitivity / 10) * step
    let newValue = startValue.current + deltaValue
    newValue = Math.round(newValue / step) * step
    newValue = Math.max(min, Math.min(newValue, max))

    setValue(newValue)
    onChange && onChange(newValue)
  }

  const startDragging = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    startValue.current = value // Store the initial value
    startYRef.current = e.clientY // Store the initial Y position
  }

  const onDragging = (e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    requestAnimationFrame(() => updateKnobValue(e))
  }

  const stopDragging = (e: MouseEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  useEffect(() => {
    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', stopDragging)

    if (isDragging) document.getElementsByTagName('body')[0].style.cursor = 'grabbing'
    else document.getElementsByTagName('body')[0].style.cursor = ''

    return () => {
      document.removeEventListener('mousemove', onDragging)
      document.removeEventListener('mouseup', stopDragging)
    }
  }, [onDragging, stopDragging])

  return (
    <div
      className={cn('echo-knob', isDragging && 'cursor-grabbing', props.className)}
      style={{ rotate: `-${rotationRange / 2}deg` }}
    >
      <div className="echo-knob-fan" />

      <div
        className={cn('echo-knob-trigger', isDragging && 'echo-knob-active')}
        ref={knobRef}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onMouseDown={startDragging}
      >
        <div className="echo-knob-trigger-pointer" />
      </div>
    </div>
  )
}
