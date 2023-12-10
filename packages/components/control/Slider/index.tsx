import { memo, useEffect, useRef, useState, useCallback } from 'react'
import { cn, validValue } from '../../../lib/utils'
import { Axis } from '../../visualization/Axis'
import { SliderProps } from './types'
import { MIN, MAX, STEP } from './constants'
import { checkPropsIsValid } from './utils'
import './styles.css'

export const Slider = memo(
  ({
    min = MIN,
    max = MAX,
    step = STEP,
    vertical = false,
    hideThumb = false,
    hideThumbLabel = false,
    thumbLableClassName,
    interactive = true,
    disabled = false,
    value: initialValue = MIN,
    onChange,
    showAxis = false,
    axisProps,
    ...props
  }: SliderProps) => {
    useEffect(() => {
      checkPropsIsValid({ value: initialValue, min, max })
    }, [])

    // Internal state for slider's value
    const [value, setValue] = useState(validValue(initialValue, min, max))
    // State to track if slider is being dragged
    const [isDragging, setIsDragging] = useState(false)
    // Ref for the slider element
    const sliderRef = useRef(null)
    // Ref to store slider dimensions
    const sliderRect = useRef({ left: 0, width: 0, bottom: 0, height: 0 })

    useEffect(() => {
      setValue(validValue(initialValue, min, max))
    }, [initialValue])

    // Update slider value based on mouse event
    const updateSliderValue = useCallback(
      (e: MouseEvent | React.MouseEvent) => {
        e.stopPropagation()

        const { left, width, bottom, height } = sliderRect.current
        const ratio = vertical ? (bottom - e.clientY) / height : (e.clientX - left) / width
        let newValue = ratio * (max - min) + min
        newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
        newValue = Math.max(min, Math.min(newValue, max))

        setValue(newValue)
        onChange && onChange(newValue)
      },
      [min, max, step, vertical, onChange],
    )

    const startDragging = (e: React.MouseEvent) => {
      if (disabled || !interactive) return

      setIsDragging(true)
      if (sliderRef.current) {
        const slider = sliderRef.current as HTMLDivElement
        sliderRect.current = slider.getBoundingClientRect()
      }
      updateSliderValue(e)
    }

    const onDragging = (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      requestAnimationFrame(() => updateSliderValue(e))
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
        className={cn(
          'echo-slider',
          vertical && 'echo-slider-vertical',
          interactive && 'cursor-pointer',
          disabled && 'cursor-not-allowed opacity-70',
          isDragging && 'cursor-grabbing',
          props.className,
        )}
        ref={sliderRef}
        onMouseDown={startDragging}
      >
        {/* Progress track */}
        <div
          className={cn(
            'echo-slider-track',
            vertical && 'echo-slider-track-vertical',
            disabled && 'bg-muted',
          )}
          style={{ [vertical ? 'height' : 'width']: `${((value - min) / (max - min)) * 100}%` }}
        />

        {/* Thumb */}
        {!hideThumb && (
          <div
            className={cn('echo-slider-thumb', vertical && 'echo-slider-thumb-vertical')}
            style={{ [vertical ? 'bottom' : 'left']: `${((value - min) / (max - min)) * 100}%` }}
          >
            {/* Thumb Label */}
            <div
              className={cn(
                'echo-slider-thumb-label',
                isDragging && !hideThumbLabel && 'scale-100 opacity-100',
                vertical && 'echo-slider-thumb-label-vertical',
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
  },
)
