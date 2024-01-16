import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react'
import { cn, halfRange, validValue } from '../../../lib/utils'
import { useCommandAltClick } from '../../../lib/hooks'
import { Axis } from '../../visualization/Axis'
import { SliderProps, SliderRef } from './types'
import { checkPropsIsValid } from './utils'
import { useStyle } from './styles'
import { MIN, MAX, STEP } from './constants'

export const Slider = forwardRef<SliderRef, SliderProps>((props, ref) => {
  const {
    value: _value = MIN,
    min = MIN,
    max = MAX,
    step = STEP,
    vertical = false,
    bilateral = false,
    hideThumb = false,
    hideThumbLabel = false,
    prohibitInteraction = false,
    disabled = false,
    axis = false,
    axisProps,
    classNames,
    styles,
    onChange,
    onChangeEnd,
    onMouseDown,
    ...restProps
  }: SliderProps = props

  useImperativeHandle(ref, () => sliderRef.current as HTMLDivElement)

  useEffect(() => {
    checkPropsIsValid({ value: _value, min, max })
  }, [])

  const [value, setValue] = useState(validValue(_value, min, max)) // Internal state for slider's value
  const [isDragging, setIsDragging] = useState(false) // State to track if slider is being dragged
  const [direction, setDirection] = useState<'positive' | 'negative'>('positive')
  const currentValue = useRef(value) // Ref to store current value
  const sliderRef = useRef<HTMLDivElement | null>(null) // Ref for the slider element
  const sliderRect = useRef({ left: 0, width: 0, bottom: 0, height: 0 }) // Ref to store slider dimensions

  // ================ events ================= //
  useEffect(() => {
    if (disabled) return
    const validatedValue = validValue(_value, min, max)
    setValue(validatedValue)
  }, [_value, min, max, disabled])

  const handleResetClick = useCommandAltClick(() => {
    if (bilateral) setValue(halfRange(min, max))
    else setValue(min)
    onChange?.(bilateral ? halfRange(min, max) : min)
  })

  // Update slider value based on mouse event
  const updateSliderValue = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      e.stopPropagation()

      const { left, width, bottom, height } = sliderRect.current
      const radio = vertical ? (bottom - e.clientY) / height : (e.clientX - left) / width
      let newValue = radio * (max - min) + min
      newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
      newValue = Math.max(min, Math.min(newValue, max))
      currentValue.current = newValue
      setValue(newValue)
    },
    [min, max, step, vertical],
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
    handleResetClick(e)
  }

  const onDragging = (e: MouseEvent) => {
    e.preventDefault()
    requestAnimationFrame(() => updateSliderValue(e))
  }

  const stopDragging = (e: MouseEvent) => {
    e.preventDefault()
    updateSliderValue(e)
    setIsDragging(false)
    onChangeEnd && onChangeEnd(currentValue.current)
    document.removeEventListener('mousemove', onDragging)
    document.removeEventListener('mouseup', stopDragging)
    handleResetClick(e)
  }

  // ================ styles ================= //
  useEffect(() => {
    if (isDragging) document.getElementsByTagName('body')[0].style.cursor = 'grabbing'
    else document.getElementsByTagName('body')[0].style.cursor = ''
  }, [isDragging])

  const progressStyle = useMemo<React.CSSProperties>(() => {
    const percentage = ((value - min) / (max - min)) * 100
    let progressLength = percentage
    let progressStart = 0

    // if (bilateral) {

    if (bilateral) {
      if (value >= halfRange(min, max)) {
        setDirection('positive')
        progressLength = percentage - 50
        progressStart = 50
      } else {
        setDirection('negative')
        progressLength = 50 - percentage
        progressStart = percentage
      }
    }

    return {
      height: vertical ? `${progressLength}%` : '100%',
      width: vertical ? '100%' : `${progressLength}%`,
      bottom: vertical ? `${progressStart}%` : '0',
      left: vertical ? '0' : `${progressStart}%`,
    }
  }, [value, min, max, bilateral, disabled, vertical])

  const { base, progress, thumb, thumbLabel } = useStyle({
    disabled,
    vertical,
    isDragging,
    prohibitInteraction,
    hideThumbLabel,
  })

  return (
    <div
      {...restProps}
      ref={sliderRef}
      data-dragging={isDragging}
      data-bilateral={bilateral}
      data-vertical={vertical}
      data-disabled={disabled}
      data-direction={direction}
      onMouseDown={startDragging}
      className={cn(base(), restProps.className)}
      style={{
        ...restProps.style,
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Progress track */}
      <div
        className={cn(progress(), classNames?.progress)}
        style={{
          ...styles?.progress,
          ...progressStyle,
          borderRadius: bilateral ? 0 : undefined,
        }}
      />

      {/* Thumb */}
      {!hideThumb && (
        <div
          className={cn(thumb(), classNames?.thumb)}
          style={{
            ...styles?.thumb,
            position: 'absolute',
            left: vertical ? '50%' : `${((value - min) / (max - min)) * 100}%`,
            top: vertical ? '' : '50%',
            bottom: vertical ? `${((value - min) / (max - min)) * 100}%` : '',
            transform: vertical
              ? 'translateX(-50%) translateY(50%)'
              : 'translateX(-50%) translateY(-50%)',
          }}
        >
          {/* Thumb Label */}
          <div
            className={cn(thumbLabel(), classNames?.thumbLabel)}
            style={{
              ...styles?.thumbLabel,
              position: 'absolute',
              bottom: vertical ? '50%' : '100%',
              transform: vertical ? 'translateX(-0.25rem) translateY(50%)' : 'translateX(-50%)',
              left: vertical ? '100%' : '50%',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {value}
          </div>
        </div>
      )}

      {/* Axis */}
      {axis && (
        <Axis
          className={cn(vertical ? 'ml-5' : 'mt-3', classNames?.axis)}
          style={styles?.axis}
          min={min}
          max={max}
          vertical={vertical}
          relatedRef={sliderRef}
          {...axisProps}
        />
      )}
    </div>
  )
})
