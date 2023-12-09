import { memo, useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '../../../lib/utils'
import { Axis } from '../../visualization/Axis'
import { SliderProps } from './types'
import { MIN, MAX, DEFAULT_VALUE, STEP } from './constants'
import './styles.css'

export const Slider = memo(
  ({
    min = MIN,
    max = MAX,
    step = STEP,
    defaultValue = DEFAULT_VALUE,
    vertical = false,
    showThumb = true,
    interactive = true,
    disabled = false,
    value: dynamicValue,
    onChange,
    showAxis = false,
    axisProps,
    ...props
  }: SliderProps) => {
    const [value, setValue] = useState(defaultValue)
    const [isDragging, setIsDragging] = useState(false)
    const sliderRef = useRef(null)
    const sliderRect = useRef({ left: 0, width: 0, bottom: 0, height: 0 })

    const updateValue = useCallback(
      (e: MouseEvent | React.MouseEvent) => {
        if (disabled) return

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

    const startDragging = useCallback(
      (e: React.MouseEvent) => {
        if (!interactive) return
        setIsDragging(true)
        if (sliderRef.current) {
          const slider = sliderRef.current as HTMLDivElement
          sliderRect.current = slider.getBoundingClientRect()
        }
        updateValue(e)
      },
      [interactive, updateValue],
    )

    const onDrag = useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return
        e.preventDefault()
        requestAnimationFrame(() => updateValue(e))
      },
      [isDragging, updateValue],
    )

    const stopDragging = useCallback((e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(false)
    }, [])

    useEffect(() => {
      if (dynamicValue !== undefined) setValue(dynamicValue)
    }, [dynamicValue])

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

        {showThumb && (
          <div
            className={cn('echo-slider-thumb', vertical && 'echo-slider-thumb-vertical')}
            style={{ [vertical ? 'bottom' : 'left']: `${((value - min) / (max - min)) * 100}%` }}
          />
        )}

        {showAxis && (
          <Axis
            className={cn(vertical ? 'ml-5' : 'mt-3')}
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
