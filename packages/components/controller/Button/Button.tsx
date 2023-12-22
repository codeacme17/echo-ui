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
    className,
    style,
    onClick,
    onToggleChange,
    ...restProps
  } = props

  const groupContext = useContext(ButtonGroupContext)
  const isInGroup = groupContext !== null

  let disabled = _disabled
  let toggled = _toggled
  let size = _size
  let radius = _radius

  if (isInGroup) {
    disabled = groupContext.disabled || _disabled
    toggled = groupContext.value?.length ? groupContext.value.includes(value) : _toggled
    size = groupContext.size || _size
    radius = groupContext.radius || _radius
  }

  // ================== Effects ================== //
  useEffect(() => {
    if (disabled) return
    onToggleChange && onToggleChange(toggled)
  }, [toggled])

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
  const sizeClassName = useMemo(() => {
    if (size === 'sm') return STYLES['echo-button__size-sm']
    if (size === 'lg') return STYLES['echo-button__size-lg']
    return STYLES['echo-button__size-md']
  }, [size])

  const radiusClassName = useMemo(() => {
    if (radius === 'sm') return 'rounded-sm'
    if (radius === 'lg') return 'rounded-lg'
    if (radius === 'full') return 'rounded-full'
    if (radius === 'none') return 'rounded-none'
    return 'rounded-md'
  }, [radius])

  const groupRadiusClassName = useMemo(() => {
    if (radius === 'sm') return 'first:rounded-l-sm last:rounded-r-sm'
    if (radius === 'lg') return 'first:rounded-l-lg last:rounded-r-lg'
    if (radius === 'full') return 'first:rounded-l-full last:rounded-r-full'
    if (radius === 'none') return 'first:rounded-l-none last:rounded-r-none'
    return 'first:rounded-l-md last:rounded-r-md'
  }, [radius])

  const buttonClassNames = useMemo(() => {
    return cn(
      sizeClassName,
      radiusClassName,
      STYLES['echo-button'],
      isInGroup && groupContext.classNames?.button,
      isInGroup && groupRadiusClassName,
      className,
      toggled && STYLES['echo-button__toggled'],
      toggled && isInGroup && groupContext.classNames?.toggled,
      toggled && classNames?.toggled,
      toggled && disabled && 'bg-muted',
    )
  }, [size, radius, className, toggled, disabled, isInGroup, groupContext?.classNames, classNames])

  const buttonStyles = useMemo(() => {
    return {
      ...style,
      ...(isInGroup && groupContext?.styles?.button),
      ...(toggled && isInGroup && groupContext.styles?.toggled),
      ...(toggled && styles?.toggled),
    }
  }, [style, isInGroup, groupContext, toggled, styles])

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
