import { memo, useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '../../../lib/utils'
import { Axis } from '../../visualization/Axis'
import { SliderProps } from './types'
import { MIN, MAX, STEP } from './constants'
import './styles.css'
import { checkPropsIsValid, validValue } from './utils'

export const Slider = memo(
  ({
    min = MIN,
    max = MAX,
    step = STEP,
    vertical = false,
    hideThumb = false,
    interactive = true,
    disabled = false,
    value: _value = MIN,
    onChange,
    showAxis = false,
    axisProps,
    ...props
  }: SliderProps) => {
    useEffect(() => {
      checkPropsIsValid(_value, min, max)
    }, [])

    const [value, setValue] = useState(validValue(_value, min, max))
    const [isDragging, setIsDragging] = useState(false)
    const sliderRef = useRef(null)
    const sliderRect = useRef({ left: 0, width: 0, bottom: 0, height: 0 })

    const updateSliderValue = useCallback(
      (e: MouseEvent | React.MouseEvent) => {
        e.stopPropagation()

        const { left, width, bottom, height } = sliderRect.current
        let ratio: number
        if (vertical) ratio = (bottom - e.clientY) / height
        else ratio = (e.clientX - left) / width

        let newValue = ratio * (max - min) + min
        newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
        newValue = Math.max(min, Math.min(newValue, max))

        setValue(newValue)
        if (onChange) onChange(newValue)
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

    const onDrag = (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      requestAnimationFrame(() => updateSliderValue(e))
    }

    const stopDragging = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(false)
    }

    useEffect(() => {
      if (_value !== undefined) setValue(validValue(_value, min, max))
    }, [_value])

    useEffect(() => {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDragging)

      if (isDragging) {
        document.getElementsByTagName('body')[0].style.cursor = 'grabbing'
      } else {
        document.getElementsByTagName('body')[0].style.cursor = ''
      }

      return () => {
        document.removeEventListener('mousemove', onDrag)
        document.removeEventListener('mouseup', stopDragging)
      }
    }, [onDrag, stopDragging])

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
        <div
          className={cn(
            'echo-slider-track',
            vertical && 'echo-slider-track-vertical',
            disabled && 'bg-muted',
          )}
          style={{ [vertical ? 'height' : 'width']: `${((value - min) / (max - min)) * 100}%` }}
        />

        {!hideThumb && (
          <div
            className={cn('echo-slider-thumb', vertical && 'echo-slider-thumb-vertical')}
            style={{ [vertical ? 'bottom' : 'left']: `${((value - min) / (max - min)) * 100}%` }}
          />
        )}

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
