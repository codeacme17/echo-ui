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
  size?: 'small' | 'medium' | 'large'

  // Label or description text for the knob
  label?: string

  // Range of rotation for the knob in degrees, default is usually 270 degrees
  rotationRange?: number

  onChange?: (value: number) => void
}

/* 
  value 0 ~ 100
  deg 0 + 360 - 270 / 2 ~ 360 - 260 - 270 / 2
  

*/

export const Knob = ({
  value: initialValue = 0,
  min = -10,
  max = 10,
  step = 1,
  disabled = false,
  size = 'medium',
  label,
  rotationRange = 270,
  onChange,
  ...props
}: KnobProps) => {
  const [value, setValue] = useState<number>(initialValue)
  const knobRef = useRef<HTMLDivElement>(null)

  const [rotation, setRotation] = useState<number>(180)

  const getAngle = (centerX: number, centerY: number, x: number, y: number) => {
    const dx = x - centerX
    const dy = y - centerY
    let angle = Math.atan2(dy, dx) * (180 / Math.PI)

    angle -= 90

    // 如果角度为负值，将其转换为 0 到 360 度范围
    if (angle < 0) {
      angle += 360
    }

    return angle
  }

  // returns angles between 0 and 360 for values lower 0 or greater 360
  const nomalizeAngle = (angle: number): number => {
    if (angle < 0) return (angle += 360)
    else if (angle > 360) return angle - 360

    return angle
  }

  // converts a value to an angle for the knob respecting the additional rotateDegrees prop
  const convertValueToAngle = (value: number): number => {
    const range = max - min
    const normalizedValue = value - min
    return (normalizedValue / range) * rotationRange
  }

  // converts an angle to a value for the knob respecting the additional rotateDegrees prop
  const convertAngleToValue = (angle: number): number => {
    const range = max - min
    const value = (angle / rotationRange) * range
    return value + min
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    const knobRect = knobRef.current!.getBoundingClientRect()
    const centerX = knobRect.left + knobRect.width / 2
    const centerY = knobRect.top + knobRect.height / 2
    const initialAngle = getAngle(
      centerX,
      centerY,
      event.clientX,
      event.clientY
    )

    let lastAngle = initialAngle

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentAngle = getAngle(
        centerX,
        centerY,
        moveEvent.clientX,
        moveEvent.clientY
      )

      lastAngle = currentAngle

      const gap = (360 - rotationRange) / 2
      console.log(lastAngle)

      if (lastAngle < gap || lastAngle > 360 - gap) return

      setRotation(lastAngle)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Calculate rotation based on value
  const calculateRotation = () => {
    // Convert value to rotation angle
  }

  // 创建刻度
  const ticks = Array.from({ length: max - min }, (_, i) => i + min).map(
    (tickValue) => {
      const angle = (tickValue / (max - min)) * 360

      const tickStyle = {
        transform: `rotate(${angle}deg) translateX(-90%)`,
      }

      return (
        <div key={tickValue} className="knob-tick" style={tickStyle}>
          {tickValue}
        </div>
      )
    }
  )

  // Tailwind CSS classes based on size prop
  const shapeSizeClass = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  }[size]

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[size]

  // Style for rotation
  const knobStyle = {
    transform: `rotate(${calculateRotation()}deg)`,
  }

  return (
    <div {...props} className={cn('knob', props.className)}>
      {ticks}

      <div
        className={cn('knob-trigger', shapeSizeClass)}
        ref={knobRef}
        style={knobStyle}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onMouseDown={handleMouseDown}
        role="slider">
        <div className="knob-trigger__pointer" />
      </div>

      {label && (
        <label className={cn('knob-label', fontSizeClass)}>{label}</label>
      )}
    </div>
  )
}
