import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useCallback,
  useMemo,
  Children,
  isValidElement,
} from 'react'
import { scaleLinear, select } from 'd3'
import {
  KnobBottomLabelProps,
  KnobBottomLabelRef,
  KnobProps,
  KnobRef,
  KnobTopLabelProps,
  KnobTopLabelRef,
} from './types'
import { checkPropsIsValid } from './utils'
import {
  DEFAULT_VALUE,
  MIN,
  MAX,
  ROTATION_RANGE,
  STEP,
  SENSITIVITY,
  SIZE,
  BUTTON_COLOR,
  PROGRESS_COLOR,
  PROGRESS_WIDTH,
  POINTER_WIDTH,
  POINTER_HEIGHT,
  POINTER_COLOR,
} from './constants'
import { cn, validValue } from '../../../lib/utils'
import styles from './styles.module.css'

export const Knob = forwardRef<KnobRef, KnobProps>((props, ref) => {
  const {
    value: initialValue = DEFAULT_VALUE,
    min = MIN,
    max = MAX,
    step = STEP,
    disabled = false,
    bilateral = false,
    sensitivity = SENSITIVITY,
    children,
    size = SIZE,
    buttonColor = BUTTON_COLOR,
    progressColor = PROGRESS_COLOR,
    progressWidth = PROGRESS_WIDTH,
    pointerWidth = POINTER_WIDTH,
    pointerHeight = POINTER_HEIGHT,
    pointerColor = POINTER_COLOR,
    className,
    style,
    onChange,
    ...restProps
  }: KnobProps = props

  useEffect(() => {
    checkPropsIsValid({ value: initialValue, min, max })
  }, [])

  const [value, setValue] = useState(validValue(initialValue, min, max))
  const [isDragging, setIsDragging] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const knobRef = useRef(null)

  const scale = useRef(scaleLinear().domain([min, max]).range([0, ROTATION_RANGE]))
  const rotation = scale.current(value)
  const startValue = useRef(value) // Ref to store the initial value
  const startYRef = useRef(0) // Ref to store the initial Y position
  const direction = useRef<'l' | 'r'>('r')

  useEffect(() => {
    select(knobRef.current).style('transform', `rotate(${rotation}deg)`)
    setPercentage((rotation / 360) * 100)

    if (!bilateral) return
    if (rotation < ROTATION_RANGE / 2) {
      direction.current = 'l'
    } else {
      direction.current = 'r'
    }
  }, [rotation])

  const updateKnobValue = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      e.stopPropagation()

      const deltaY = startYRef.current - e.clientY
      const deltaValue = deltaY * (sensitivity / 10) * step
      let newValue = startValue.current + deltaValue
      newValue = parseFloat((Math.round(newValue / step) * step).toFixed(10))
      newValue = Math.max(min, Math.min(newValue, max))

      setValue(newValue)
      onChange && onChange(newValue)
    },
    [onChange],
  )

  const startDragging = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) return
    setIsDragging(true)
    startValue.current = value // Store the initial value
    startYRef.current = e.clientY // Store the initial Y position
    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', stopDragging)
  }

  const onDragging = (e: MouseEvent) => {
    e.preventDefault()
    requestAnimationFrame(() => updateKnobValue(e))
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

  const progressBackground = useMemo(() => {
    if (!bilateral) {
      return `conic-gradient(${progressColor} 0% ${percentage}%, transparent ${percentage}% 100%)`
    }

    const halfRangePercentage = ROTATION_RANGE / 2 / 3.6

    if (direction.current === 'l') {
      const startPercent =
        percentage + ROTATION_RANGE / 3.6 - halfRangePercentage / (ROTATION_RANGE / 90)
      return `conic-gradient(transparent ${startPercent}% , ${progressColor} 0% 100%)`
    } else {
      const startPercent = percentage - halfRangePercentage
      return `conic-gradient(${progressColor} ${startPercent}%, transparent 0% 100%)`
    }
  }, [percentage, bilateral, progressColor, direction])

  return (
    <div {...restProps} className="flex flex-col items-center" ref={ref}>
      {/* Top Label */}
      {Children.map(children, (child) => {
        if (isValidElement(child) && child.type === KnobTopLabel) return child
        return null
      })}

      <div
        onMouseDown={startDragging}
        className={cn(styles['echo-knob'], isDragging && styles['echo-knob__dragging'], className)}
        style={{
          ...style,
          padding: progressWidth,
          width: size,
          height: size,
          position: 'relative',
          userSelect: 'none',
          borderRadius: '100%',
        }}
      >
        {/* Progress */}
        <div
          className={cn(styles['echo-knob-progress'])}
          style={{
            rotate: bilateral ? '0deg' : `-${ROTATION_RANGE / 2}deg`,
            background: progressBackground,
          }}
        />

        {/* Trigger Button */}
        <div
          ref={knobRef}
          className={cn(styles['echo-knob-button'])}
          style={{ rotate: `-${ROTATION_RANGE / 2}deg`, backgroundColor: buttonColor }}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        >
          {/* button Pointer */}
          <div
            className={cn(styles['echo-knob-button-pointer'])}
            style={{
              width: pointerWidth,
              height: pointerHeight,
              backgroundColor: pointerColor,
            }}
          />
        </div>
      </div>

      {/* Bottom Label */}
      {Children.map(children, (child) => {
        if (isValidElement(child) && child.type === KnobBottomLabel) return child
        return null
      })}
    </div>
  )
})

export const KnobTopLabel = forwardRef<KnobTopLabelRef, KnobTopLabelProps>((props, ref) => {
  const { style, className, children, ...restProps } = props

  return (
    <div
      {...restProps}
      ref={ref}
      className={cn(styles['echo-knob-top-label'], className)}
      style={style}
    >
      {children}
    </div>
  )
})

export const KnobBottomLabel = forwardRef<KnobBottomLabelRef, KnobBottomLabelProps>(
  (props, ref) => {
    const { style, className, children, ...restProps } = props

    return (
      <div
        {...restProps}
        ref={ref}
        className={cn(styles['echo-knob-bottom-label'], className)}
        style={style}
      >
        {children}
      </div>
    )
  },
)
