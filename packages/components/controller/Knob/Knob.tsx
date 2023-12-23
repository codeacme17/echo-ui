import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useCallback,
  useMemo,
  isValidElement,
} from 'react'
import { scaleLinear, select } from 'd3'
import { KnobProps, KnobRef } from './types'
import { checkPropsIsValid } from './utils'
import {
  DEFAULT_VALUE,
  MIN,
  MAX,
  ROTATION_RANGE,
  STEP,
  SENSITIVITY,
  SIZE,
  TRACK_COLOR,
  BUTTON_COLOR,
  PROGRESS_COLOR,
  TRACK_WIDTH,
  POINTER_WIDTH,
  POINTER_HEIGHT,
  POINTER_COLOR,
} from './constants'
import { cn, validValue } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Knob = forwardRef<KnobRef, KnobProps>((props, ref) => {
  const {
    value: _value = DEFAULT_VALUE,
    min = MIN,
    max = MAX,
    step = STEP,
    disabled = false,
    bilateral = false,
    sensitivity = SENSITIVITY,
    rotationRange = ROTATION_RANGE,

    // ===== styles ===== //
    size = SIZE,
    trackColor = TRACK_COLOR,
    buttonColor = BUTTON_COLOR,
    progressColor: _progressColor = PROGRESS_COLOR,
    trackWidth = TRACK_WIDTH,
    pointerWidth = POINTER_WIDTH,
    pointerHeight = POINTER_HEIGHT,
    pointerColor: _pointerColor = POINTER_COLOR,
    classNames,
    styles,

    // ===== slots ===== //
    topLabel,
    bottomLabel,

    // ===== events ===== //
    onChange,
    ...restProps
  }: KnobProps = props

  useEffect(() => {
    checkPropsIsValid({ value: _value, min, max })
  }, [])

  const [value, setValue] = useState(validValue(_value, min, max))
  const [isDragging, setIsDragging] = useState(false)
  const knobRef = useRef(null)
  const scale = useRef(scaleLinear().domain([min, max]).range([0, rotationRange]))
  const rotation = scale.current(validValue(_value, min, max))
  const startValue = useRef(value) // Ref to store the initial value
  const startYRef = useRef(0) // Ref to store the initial Y position
  const direction = useRef<'l' | 'r'>('l')

  // ================== handlers ================== //
  useEffect(() => {
    if (disabled) return
    if (bilateral) direction.current = rotation < rotationRange / 2 ? 'l' : 'r'
    updateKnobButtonRotateTransform()
  }, [bilateral, rotation, rotationRange])

  const updateKnobValue = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      e.stopPropagation()
      const deltaY = startYRef.current - e.clientY
      const deltaValue = deltaY * (sensitivity / 10) * step
      let newValue = startValue.current + deltaValue
      newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
      newValue = validValue(newValue, min, max)
      setValue(newValue)
      onChange && onChange(newValue)
    },
    [onChange],
  )

  const startDragging = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if (disabled) return
    setIsDragging(true)
    startValue.current = value
    startYRef.current = e.clientY
    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', stopDragging)
  }

  const onDragging = (e: MouseEvent) => {
    e.preventDefault()
    requestAnimationFrame(() => updateKnobValue(e))
  }

  const stopDragging = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    document.removeEventListener('mousemove', onDragging)
    document.removeEventListener('mouseup', stopDragging)
  }

  // ================== Styles ================== //
  useEffect(() => {
    if (isDragging) document.getElementsByTagName('body')[0].style.cursor = 'grabbing'
    else document.getElementsByTagName('body')[0].style.cursor = ''
  }, [isDragging])

  const updateKnobButtonRotateTransform = () => {
    requestAnimationFrame(() =>
      select(knobRef.current).style('transform', `rotate(${rotation}deg)`),
    )
  }

  const progressColor = disabled ? 'var(--echo-muted)' : _progressColor
  const pointerColor = disabled ? 'var(--echo-muted)' : _pointerColor
  const progressBackground = useMemo(() => {
    if (!bilateral) {
      return `conic-gradient(${progressColor} 0% ${rotation}deg, transparent ${rotation}deg 100%)`
    }

    // bilateral mode
    if (direction.current === 'l') {
      const startRotation = rotationRange / 2 + rotation + 360 - rotationRange
      const endRotation = 360 - rotation
      return `conic-gradient(transparent ${startRotation}deg, ${progressColor} 0% ${endRotation}deg)`
    } else {
      const startRotation = rotation - rotationRange / 2
      return `conic-gradient(${progressColor} ${startRotation}deg, transparent 0% 100%)`
    }
  }, [rotation, bilateral, progressColor, direction, rotationRange])

  const trackBackground = useMemo(() => {
    const halfRotationRange = rotationRange / 2
    return `conic-gradient(
      ${trackColor} ${halfRotationRange}deg, 
      transparent 0% ${360 - halfRotationRange}deg, 
      ${trackColor} ${halfRotationRange}deg)`
  }, [trackColor, rotationRange])

  const renderLabel = (
    label?: string | React.ReactNode,
    style?: React.CSSProperties,
    className?: string,
  ) =>
    isValidElement(label) ? (
      label
    ) : (
      <div className={className} style={style}>
        {label}
      </div>
    )

  return (
    <div {...restProps} ref={ref} className="flex flex-col items-center">
      {/* Top Label */}
      {renderLabel(
        topLabel,
        styles?.topLabel,
        cn(STYLES['echo-knob-top-label'], classNames?.topLabel),
      )}

      {/* Knob */}
      <div
        onMouseDown={startDragging}
        className={cn(
          STYLES['echo-knob'],
          restProps.className,
          isDragging && STYLES['echo-knob__dragging'],
          disabled && STYLES['echo-knob__disabled'],
        )}
        style={{
          ...restProps.style,
          padding: trackWidth,
          width: size,
          height: size,
          position: 'relative',
          userSelect: 'none',
          borderRadius: '100%',
          background: trackBackground,
        }}
      >
        {/* Progress */}
        <div
          className={cn(STYLES['echo-knob-progress'])}
          style={{
            rotate: bilateral ? '0deg' : `-${rotationRange / 2}deg`,
            background: progressBackground,
          }}
        />

        {/* Trigger Button */}
        <div
          ref={knobRef}
          className={cn(STYLES['echo-knob-button'])}
          style={{ rotate: `-${rotationRange / 2}deg`, backgroundColor: buttonColor }}
          role="slider"
        >
          {/* button Pointer */}
          <div
            className={cn(STYLES['echo-knob-button-pointer'])}
            style={{
              width: pointerWidth,
              height: pointerHeight,
              backgroundColor: pointerColor,
            }}
          />
        </div>
      </div>

      {/* Bottom Label */}
      {renderLabel(
        bottomLabel,
        styles?.bottomLabel,
        cn(STYLES['echo-knob-bottom-label'], classNames?.bottomLabel),
      )}
    </div>
  )
})
