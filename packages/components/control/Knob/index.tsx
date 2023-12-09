import React, { useState, useEffect, useRef } from 'react'
import { scaleLinear, select } from 'd3'

import { cn } from '../../../lib/utils'
import { KnobProps } from './types'
import { DEFAULT_VALUE, MIN, MAX, ROTATION_RANGE, SIZE, STEP } from './constants'
import './styles.css'

export const Knob = ({
  value: initialValue = DEFAULT_VALUE,
  min = MIN,
  max = MAX,
  step = STEP,
  disabled = false,
  size = SIZE,
  rotationRange = ROTATION_RANGE,
  onChange,
  ...props
}: KnobProps) => {
  const [value, setValue] = useState(initialValue)
  const [isDragging, setIsDragging] = useState(false)
  const knobRef = useRef(null)

  const scale = scaleLinear().domain([min, max]).range([0, rotationRange])
  const rotation = scale(value)

  useEffect(() => {
    select(knobRef.current).style('transform', `rotate(${rotation}deg)`)
  }, [rotation])

  const handleInteractionStart = (e: React.MouseEvent) => {
    if (disabled) return

    setIsDragging(true)

    // Initial Y coordinate
    const startY = e.clientY
    // Value at the start of interaction
    const startValue = value

    const handleInteractionMove = (moveEvent: MouseEvent) => {
      const deltaY = -(moveEvent.clientY - startY) * 3
      const deltaValue = scale.invert(deltaY + scale(value)) - startValue
      let newValue = startValue + Math.round(deltaValue / step) * step
      newValue = Math.max(min, Math.min(newValue, max))

      setValue(newValue)
      onChange && onChange(newValue)
    }

    const handleInteractionEnd = () => {
      document.removeEventListener('mousemove', handleInteractionMove)
      document.removeEventListener('mouseup', handleInteractionEnd)
      document.getElementsByTagName('body')[0].style.cursor = ''
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleInteractionMove)
    document.addEventListener('mouseup', handleInteractionEnd)
    document.getElementsByTagName('body')[0].style.cursor = 'grabbing'
  }

  return (
    <div
      className={cn('echo-knob', size, props.className)}
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
        onMouseDown={handleInteractionStart}
      >
        <div className="echo-knob-trigger-pointer" />
      </div>
    </div>
  )
}
