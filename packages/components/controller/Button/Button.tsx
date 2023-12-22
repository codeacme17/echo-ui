import { forwardRef, useEffect, useContext, useCallback, useMemo } from 'react'
import { ButtonProps, ButtonRef } from './types'
import { ButtonGroupContext } from './context'
import { RADIUS, SIZE } from './constants'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  const {
    value,
    disabled: _disabled = false,
    toggled: _toggled = false,
    size: _size = SIZE,
    radius: _radius = RADIUS,
    classNames,
    styles,
    onClick,
    onToggleChange,
    ...restProps
  } = props

  const groupContext = useContext(ButtonGroupContext)
  const isInGroup = groupContext !== null
  const disabled = isInGroup ? groupContext.disabled : _disabled
  const size = isInGroup ? groupContext.size : _size
  const radius = isInGroup ? groupContext.radius : _radius

  let toggled = _toggled
  if (isInGroup) {
    toggled = groupContext.value?.length ? groupContext.value.includes(value) : _toggled
  }

  // ================== Effects ================== //
  useEffect(() => {
    if (disabled) return
    onToggleChange && onToggleChange(toggled)
  }, [disabled, toggled, onToggleChange])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      onClick && onClick(e)

      // If the button is in a group and have the specifical value,
      // we need to handle the toggling
      if (!isInGroup || !value) return
      groupContext.onChange && groupContext.onChange(value)
    },
    [disabled, isInGroup, groupContext, value, onClick],
  )

  // ================== Styles ================== //
  const sizeClassName = useMemo(() => STYLES[`echo-button__size-${size}`], [size])
  const radiusClassName = useMemo(() => `rounded-${radius}`, [radius])
  const groupRadiusClassName = useMemo(
    () => `first:rounded-l-${radius} last:rounded-r-${radius}`,
    [radius],
  )

  const buttonClassNames = useMemo(() => {
    return cn(
      sizeClassName,
      radiusClassName,
      STYLES['echo-button'],
      isInGroup && groupContext.classNames?.button,
      isInGroup && groupRadiusClassName,
      restProps.className,
      toggled && STYLES['echo-button__toggled'],
      toggled && isInGroup && groupContext.classNames?.toggled,
      toggled && classNames?.toggled,
      toggled && disabled && 'bg-muted',
    )
  }, [
    size,
    radius,
    restProps.className,
    toggled,
    disabled,
    isInGroup,
    groupContext?.classNames,
    classNames,
  ])

  const buttonStyles = useMemo(() => {
    return {
      ...(isInGroup && groupContext?.styles?.button),
      ...restProps.style,
      ...(toggled && isInGroup && groupContext.styles?.toggled),
      ...(toggled && styles?.toggled),
    }
  }, [restProps.style, isInGroup, groupContext, toggled, styles])

  return (
    <button
      {...restProps}
      ref={ref}
      disabled={disabled}
      className={buttonClassNames}
      style={buttonStyles}
      onClick={handleClick}
    >
      <span className={cn(disabled && 'text-foreground/60')}>{restProps.children}</span>
    </button>
  )
})
