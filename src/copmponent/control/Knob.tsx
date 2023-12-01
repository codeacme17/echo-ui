import React, { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import './Knob.css'

interface KnobProps extends React.HTMLAttributes<HTMLInputElement> {
  // Current value of the knob
  value?: number

  // Minimum value the knob can represent
  min?: number

  // Maximum value the knob can represent
  max?: number

  // Step size for the knob's value changes
  step?: number

  // If true, the knob will be disabled and not interactive
  disabled?: boolean

  // Size of the knob, can be a specific number or predefined sizes like 'small', 'medium', 'large'
  size?: 'small' | 'medium' | 'large' | number

  // Label or description text for the knob
  label?: string

  // Range of rotation for the knob in degrees, default is usually 270 degrees
  rotationRange?: number
}

export const Knob = ({
  value: initialValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'medium',
  label,
  rotationRange = 270,
  ...props
}: KnobProps) => {
  const [value, setValue] = useState<number>(initialValue)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const KnobRef = useRef<HTMLDivElement>(null)

  const handleValueChange = useCallback(
    (newValue: number) => {
      if (!disabled && newValue >= min && newValue <= max) {
        setValue(newValue)
        props.onChange && props.onChange(newValue)
        console.log(calulateRotation())
      }
    },
    [disabled, min, max, props.onChange]
  )

  const handleMouseDown = () => {
    // Logic for starting the drag interaction
    console.log("I'm being dragged")
    setIsDragging(true)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return

    console.log(event)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const calulateRotation = () => {
    const rotation = (value / max) * rotationRange
    return rotation
  }

  // useEffect(() => {
  //   // Add event listeners for mouse move and mouse up
  //   document.addEventListener('mousedown', handleMouseDown)
  //   document.addEventListener('mousemove', handleMouseMove)
  //   document.addEventListener('mouseup', handleMouseUp)

  //   return () => {
  //     // Remove event listeners
  //     document.removeEventListener('mousedown', handleMouseDown)
  //     document.removeEventListener('mousemove', handleMouseMove)
  //     document.removeEventListener('mouseup', handleMouseUp)
  //   }
  // }, [handleMouseDown, handleMouseMove, handleMouseUp])

  const knobStyle = {
    transform: `rotate(${calulateRotation()}deg)`,
    // Other styles based on size and disabled state
  }

  return (
    <div {...props} className={cn('knob', props.className)}>
      <div
        className="knob-track"
        ref={KnobRef}
        style={knobStyle}
        onMouseDown={handleMouseDown}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onMouseDownCapture={handleMouseDown}
        role="slider">
        <div className="knob-track__pointer" />
      </div>

      {label && <label className="knob-label">{label}</label>}
    </div>
  )
}
