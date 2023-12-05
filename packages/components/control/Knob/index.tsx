import React, { useState, useEffect, useRef } from 'react'
import { scaleLinear, select } from 'd3'

import { cn } from '../../../lib/utils'
import { KnobProps } from './types'
import './style.css'

export const Knob = ({
  value: initialValue = 0,
  min = -10,
  max = 10,
  // step = 1,
  disabled = false,
  size = 'medium',
  rotationRange = 270,
  onValueChange,
  ...props
}: KnobProps) => {
  const [value, setValue] = useState(initialValue)
  const [isDragging, setIsDragging] = useState(false)
  const knobRef = useRef(null)

  const scale = scaleLinear()
    .domain([min, max])
    .range([0, rotationRange])
  const rotation = scale(value)

  // Update the knob position when value changes
  useEffect(() => {
    select(knobRef.current).style(
      'transform',
      `rotate(${rotation}deg)`
    )

    console.log(rotation)
  }, [rotation])

  const handleInteractionStart = (event: React.MouseEvent) => {
    if (disabled) return

    setIsDragging(true) // Set the dragging state
    const knob = knobRef.current! as HTMLDivElement
    const knobRect = knob.getBoundingClientRect()
    const knobCenter = {
      x: knobRect.left + knobRect.width / 2,
      y: knobRect.top + knobRect.height / 2,
    }
    const startAngle =
      Math.atan2(
        event.clientY - knobCenter.y,
        event.clientX - knobCenter.x
      ) *
      (180 / Math.PI)

    console.log(
      Math.atan2(
        event.clientY - knobCenter.y,
        event.clientX - knobCenter.x
      )
    )

    const handleInteractionMove = (moveEvent: MouseEvent) => {
      const currentAngle =
        Math.atan2(
          moveEvent.clientY - knobCenter.y,
          moveEvent.clientX - knobCenter.x
        ) *
        (180 / Math.PI)

      // deltaAngle is the difference between the current angle and the start angle
      const deltaAngle = currentAngle - startAngle

      // newAngle is the new angle of the knob after the user has dragged it
      // its value is bounded between 0 and rotationRange
      const newAngle = rotation + deltaAngle
      const newValue = scale.invert(newAngle)

      setValue(newValue)
      onValueChange?.(newValue)
    }

    const handleInteractionEnd = () => {
      document.removeEventListener('mousemove', handleInteractionMove)
      document.removeEventListener('mouseup', handleInteractionEnd)
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleInteractionMove)
    document.addEventListener('mouseup', handleInteractionEnd)
  }

  return (
    <div {...props} className={cn('knob', size, props.className)}>
      <div className="knob-fan"></div>
      <div
        className={cn('knob-trigger', { 'knob--active': isDragging })}
        ref={knobRef}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onMouseDown={handleInteractionStart}>
        <div className="knob-trigger__pointer" />
      </div>
    </div>
  )
}
