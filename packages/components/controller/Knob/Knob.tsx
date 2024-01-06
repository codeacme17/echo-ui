import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useCallback,
  useMemo,
  isValidElement,
  useContext,
} from 'react'
import { scaleLinear, select } from 'd3'
import { cn, halfRange, validValue } from '../../../lib/utils'
import { useCommandAltClick } from '../../../hooks/useCommandAltClick'
import { KnobProps, KnobRef } from './types'
import { KnobGroupContext } from './context'
import { checkPropsIsValid } from './utils'
import { useStyle } from './styles'
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

export const Knob = forwardRef<KnobRef, KnobProps>((props, ref) => {
  const {
    value: _value = DEFAULT_VALUE,
    min: _min,
    max: _max,
    step: _step = STEP,
    bilateral: _bilateral,
    disabled: _disabled,
    sensitivity: _sensitivity,
    rotationRange: _rotationRange = ROTATION_RANGE,
    size: _size,
    trackWidth: _trackWidth,
    trackColor: _trackColor,
    buttonColor: _buttonColor,
    progressColor: _progressColor,
    pointerWidth: _pointerWidth,
    pointerHeight: _pointerHeight,
    pointerColor: _pointerColor,
    topLabel,
    bottomLabel,
    classNames,
    styles,
    onChange,
    onChangeEnd,
    ...restProps
  }: KnobProps = props

  useEffect(() => {
    checkPropsIsValid(props)
  }, [])

  const groupContext = useContext(KnobGroupContext)
  const isInGroup = groupContext !== null

  const disabled = _disabled === undefined ? groupContext?.disabled : _disabled
  const progressColor = _progressColor
    ? _progressColor
    : groupContext?.progressColor ?? PROGRESS_COLOR
  const pointerColor = _pointerColor ? _pointerColor : groupContext?.pointerColor ?? POINTER_COLOR
  const size = _size ? _size : groupContext?.size ?? SIZE
  const trackWidth = _trackWidth ? _trackWidth : groupContext?.trackWidth ?? TRACK_WIDTH
  const trackColor = _trackColor ? _trackColor : groupContext?.trackColor ?? TRACK_COLOR
  const buttonColor = _buttonColor ? _buttonColor : groupContext?.buttonColor ?? BUTTON_COLOR
  const pointerWidth = _pointerWidth ? _pointerWidth : groupContext?.pointerWidth ?? POINTER_WIDTH
  const pointerHeight = _pointerHeight
    ? _pointerHeight
    : groupContext?.pointerHeight ?? POINTER_HEIGHT
  const bilateral = _bilateral ? _bilateral : groupContext?.bilateral
  const sensitivity = _sensitivity ? _sensitivity : groupContext?.sensitivity ?? SENSITIVITY
  const step = _step ? _step : groupContext?.step ?? STEP
  const min = _min ? _min : groupContext?.min ?? MIN
  const max = _max ? _max : groupContext?.max ?? MAX

  const [value, setValue] = useState(validValue(_value, min, max))
  const [isDragging, setIsDragging] = useState(false)
  const [direction, setDirection] = useState<'positive' | 'negative'>('negative')
  const rotationRange = validValue(_rotationRange, 90, 360)
  const scale = useRef(scaleLinear().domain([min, max]).range([0, rotationRange]))
  const [rotation, setRotation] = useState(scale.current(validValue(_value, min, max))) // The current rotation deg
  const currentValue = useRef(value)
  const knobRef = useRef(null)
  const startValue = useRef(value) // Ref to store the initial value
  const startYRef = useRef(0) // Ref to store the initial Y position

  // ================== handlers ================== //
  useEffect(() => {
    const validatedValue = validValue(_value, min, max)
    setValue(validatedValue)
  }, [_value, min, max])

  useEffect(() => {
    if (disabled) return
    const validatedValue = validValue(value, min, max)
    setRotation(scale.current(validatedValue))
  }, [value, min, max, scale])

  useEffect(() => {
    if (bilateral) setDirection(rotation < rotationRange / 2 ? 'negative' : 'positive')
    updateKnobButtonRotateTransform()
  }, [bilateral, rotation, rotationRange])

  const handleResetClick = useCommandAltClick(() => {
    if (bilateral) setValue(halfRange(min, max))
    else setValue(min)
    onChange?.(validValue(bilateral ? halfRange(min, max) : min, min, max))
  })

  const startDragging = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) return
    e.stopPropagation()
    setIsDragging(true)
    startValue.current = value
    startYRef.current = e.clientY
    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', stopDragging)
    handleResetClick(e)
  }

  const onDragging = (e: MouseEvent) => {
    e.preventDefault()
    requestAnimationFrame(() => updateKnobValue(e))
  }

  const stopDragging = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    onChangeEnd && onChangeEnd(currentValue.current)
    document.removeEventListener('mousemove', onDragging)
    document.removeEventListener('mouseup', stopDragging)
    handleResetClick(e)
  }

  const updateKnobValue = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      const deltaY = startYRef.current - e.clientY
      const deltaValue = deltaY * (sensitivity / 10) * step
      let newValue = startValue.current + deltaValue
      newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
      newValue = validValue(newValue, min, max)
      currentValue.current = newValue
      setValue(newValue)
      onChange?.(validValue(newValue, min, max))
    },
    [startYRef, startValue, sensitivity, step, min, max, onChange],
  )

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

  const progressBackground = useMemo(() => {
    const _progressColor = disabled ? 'var(--echo-muted)' : progressColor

    if (!bilateral) {
      return `conic-gradient(${_progressColor} 0% ${rotation}deg, transparent ${rotation}deg 100%)`
    }

    // bilateral mode
    if (direction === 'negative') {
      const startRotation = rotationRange / 2 + rotation + 360 - rotationRange
      const endRotation = 360 - rotation
      return `conic-gradient(transparent ${startRotation}deg, ${_progressColor} 0% ${endRotation}deg)`
    } else {
      const startRotation = rotation - rotationRange / 2
      return `conic-gradient(${_progressColor} ${startRotation}deg, transparent 0% 100%)`
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
  ) => {
    if (!label) return null

    if (isValidElement(label)) return label
    return (
      <div className={className} style={style}>
        {label}
      </div>
    )
  }

  const {
    base,
    button,
    progress,
    trigger,
    triggerPointer,
    topLabel: _topLabel,
    bottomLabel: _bottomLabel,
  } = useStyle({ disabled, isDragging })

  return (
    <div
      {...restProps}
      ref={ref}
      data-dragging={isDragging}
      data-disabled={disabled}
      data-bilateral={bilateral}
      data-direction={direction}
      className={cn(base(), isInGroup ? groupContext.classNames?.knob : restProps.className)}
      style={{
        width: size,
        ...(isInGroup ? groupContext.styles?.knob : restProps.style),
      }}
    >
      {/* Top Label */}
      {renderLabel(topLabel, styles?.topLabel, cn(_topLabel(), classNames?.topLabel))}

      {/* Knob */}
      <div
        onMouseDown={startDragging}
        className={cn(button(), classNames?.button)}
        style={{
          ...styles?.button,
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
          className={cn(progress())}
          style={{
            rotate: bilateral ? '0deg' : `-${rotationRange / 2}deg`,
            background: progressBackground,
          }}
        />

        {/* Trigger Button */}
        <div
          ref={knobRef}
          className={cn(trigger())}
          style={{ rotate: `-${rotationRange / 2}deg`, backgroundColor: buttonColor }}
          role="slider"
        >
          {/* button Pointer */}
          <div
            className={cn(triggerPointer())}
            style={{
              width: pointerWidth,
              height: pointerHeight,
              backgroundColor: disabled ? 'var(--echo-muted)' : pointerColor,
            }}
          />
        </div>
      </div>

      {/* Bottom Label */}
      {renderLabel(bottomLabel, styles?.bottomLabel, cn(_bottomLabel(), classNames?.bottomLabel))}
    </div>
  )
})
