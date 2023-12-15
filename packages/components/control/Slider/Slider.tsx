import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { SliderProps, SliderRef } from './types'
import { checkPropsIsValid } from './utils'
import { MIN, MAX, STEP, PROGRESS_COLOR } from './constants'
import { Axis } from '../../visualization/Axis'
import { cn, validValue } from '../../../lib/utils'
import styles from './styles.module.css'

export const Slider = forwardRef<SliderRef, SliderProps>((props, ref) => {
  const {
    value: _value = MIN,
    min = MIN,
    max = MAX,
    step = STEP,
    vertical = false,
    hideThumb = false,
    hideThumbLabel = false,
    prohibitInteraction = false,
    disabled = false,
    progressColor = PROGRESS_COLOR,
    thumbClassName,
    thumbStyle,
    thumbLabelClassName,
    thumbLabelStyle,
    hideAxis = false,
    axisProps,
    className,
    style,
    onChange,
    onMouseDown,
    ...restProps
  }: SliderProps = props

  useEffect(() => {
    checkPropsIsValid({ value: _value, min, max })
  }, [])

  // Internal state for slider's value
  const [value, setValue] = useState(validValue(_value, min, max))
  // State to track if slider is being dragged
  const [isDragging, setIsDragging] = useState(false)
  // Ref for the slider element
  const sliderRef = useRef<HTMLDivElement | null>(null)
  // Ref to store slider dimensions
  const sliderRect = useRef({ left: 0, width: 0, bottom: 0, height: 0 })

  useImperativeHandle(ref, () => sliderRef.current as HTMLDivElement)

  useEffect(() => {
    if (disabled) return
    setValue(validValue(_value, min, max))
  }, [_value])

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

  const startDragging = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onMouseDown && onMouseDown(e)

    if (disabled || prohibitInteraction || !sliderRef.current) return
    const slider = sliderRef.current
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
      {...restProps}
      ref={sliderRef}
      className={cn(
        styles['echo-slider'],
        prohibitInteraction && 'cursor-auto',
        isDragging && 'cursor-grabbing',
        vertical && styles['echo-slider__vertical'],
        disabled && styles['echo-slider__disabled'],
        className,
      )}
      style={style}
      onMouseDown={startDragging}
    >
      {/* Progress track */}
      <div
        className={cn(
          styles['echo-slider-track'],
          vertical && styles['echo-slider-track-vertical'],
          disabled && styles['echo-slider-track__disabled'],
        )}
        style={{
          [vertical ? 'height' : 'width']: `${((value - min) / (max - min)) * 100}%`,
          backgroundColor: disabled ? 'var(--echo-muted)' : progressColor,
        }}
      />

      {/* Thumb */}
      {!hideThumb && (
        <div
          className={cn(
            styles['echo-slider-thumb'],
            vertical && styles['echo-slider-thumb__vertical'],
            thumbClassName,
          )}
          style={{
            ...thumbStyle,
            [vertical ? 'bottom' : 'left']: `${((value - min) / (max - min)) * 100}%`,
          }}
        >
          {/* Thumb Label */}
          <div
            className={cn(
              styles['echo-slider-thumb-label'],
              vertical && styles['echo-slider-thumb-label__vertical'],
              isDragging && !hideThumbLabel && 'scale-100 opacity-100',
              thumbLabelClassName,
            )}
            style={thumbLabelStyle}
          >
            {value}
          </div>
        </div>
      )}

      {/* Axis */}
      {!hideAxis && (
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
