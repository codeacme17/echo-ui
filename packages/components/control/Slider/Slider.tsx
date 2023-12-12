import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Axis } from '../../visualization/Axis'
import { cn, validValue } from '../../../lib/utils'
import { SliderProps, SliderRef } from './types'
import { MIN, MAX, STEP } from './constants'
import { checkPropsIsValid } from './utils'
import styles from './styles.module.css'

/**
 * TODO
 * - Add SliderGroup component
 */

export const Slider = forwardRef<SliderRef, SliderProps>((props, ref) => {
  const {
    value: initialValue = MIN,
    min = MIN,
    max = MAX,
    step = STEP,
    vertical = false,
    hideThumb = false,
    hideThumbLabel = false,
    thumbLableClassName,
    interactive = true,
    disabled = false,
    showAxis = false,
    axisProps,
    onChange,
    ...restProps
  }: SliderProps = props

  useEffect(() => {
    checkPropsIsValid({ value: initialValue, min, max })
  }, [])

  // Internal state for slider's value
  const [value, setValue] = useState(validValue(initialValue, min, max))
  // State to track if slider is being dragged
  const [isDragging, setIsDragging] = useState(false)
  // Ref for the slider element
  const sliderRef = useRef<HTMLDivElement | null>(null)
  // Ref to store slider dimensions
  const sliderRect = useRef({ left: 0, width: 0, bottom: 0, height: 0 })

  useImperativeHandle(ref, () => sliderRef.current as HTMLDivElement)

  useEffect(() => {
    setValue(validValue(initialValue, min, max))
  }, [initialValue])

  // Update slider value based on mouse event
  const updateSliderValue = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      e.stopPropagation()

      const { left, width, bottom, height } = sliderRect.current
      const radio = vertical ? (bottom - e.clientY) / height : (e.clientX - left) / width
      let newValue = radio * (max - min) + min
      newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
      newValue = Math.max(min, Math.min(newValue, max))

      setValue(newValue)
      onChange && onChange(newValue)
    },
    [min, max, step, vertical, onChange],
  )

  const startDragging = (e: React.MouseEvent) => {
    if (disabled || !interactive || !sliderRef.current) return

    const slider = sliderRef.current as HTMLDivElement
    sliderRect.current = slider.getBoundingClientRect()
    setIsDragging(true)
    updateSliderValue(e)

    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', stopDragging)
  }

  const onDragging = (e: MouseEvent) => {
    e.preventDefault()
    requestAnimationFrame(() => updateSliderValue(e))
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
      ref={sliderRef}
      className={cn(
        styles['echo-slider'],
        vertical && styles['echo-slider__vertical'],
        disabled && styles['echo-slider__disabled'],
        interactive && 'cursor-pointer',
        isDragging && 'cursor-grabbing',
        restProps.className,
      )}
      onMouseDown={startDragging}
    >
      {/* Progress track */}
      <div
        className={cn(
          styles['echo-slider-track'],
          vertical && styles['echo-slider-track-vertical'],
          disabled && styles['echo-slider-track__disabled'],
        )}
        style={{ [vertical ? 'height' : 'width']: `${((value - min) / (max - min)) * 100}%` }}
      />

      {/* Thumb */}
      {!hideThumb && (
        <div
          className={cn(
            styles['echo-slider-thumb'],
            vertical && styles['echo-slider-thumb__vertical'],
          )}
          style={{ [vertical ? 'bottom' : 'left']: `${((value - min) / (max - min)) * 100}%` }}
        >
          {/* Thumb Label */}
          <div
            className={cn(
              styles['echo-slider-thumb-label'],
              vertical && styles['echo-slider-thumb-label__vertical'],
              isDragging && !hideThumbLabel && 'scale-100 opacity-100',
              thumbLableClassName,
            )}
          >
            {value}
          </div>
        </div>
      )}

      {/* Axis */}
      {showAxis && (
        <Axis
          className={cn(vertical ? 'ml-5' : 'mt-2')}
          min={min}
          max={max}
          vertical={vertical}
          {...axisProps}
        />
      )}
    </div>
  )
})
