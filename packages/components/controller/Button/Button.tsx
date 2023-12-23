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
  /**
   * I have tried to use dynmaic class name for different props value,
   * but there will occure a issue which can not render the style
   * @todo refactor that shxt
   */
  const sizeClassName = useMemo(() => {
    if (size === 'sm') return STYLES['echo-button__size-sm']
    if (size === 'lg') return STYLES['echo-button__size-lg']
    return STYLES['echo-button__size-md']
  }, [size])
  const radiusClassName = useMemo(() => {
    if (radius === 'none')
      return {
        base: 'rounded-none',
        group: 'first:rounded-l-none last:rounded-r-none',
      }
    if (radius === 'sm')
      return {
        base: 'rounded-sm',
        group: 'first:rounded-l-sm last:rounded-r-sm',
      }
    if (radius === 'lg')
      return {
        base: 'rounded-lg',
        group: 'first:rounded-l-lg last:rounded-r-lg',
      }
    if (radius === 'full')
      return {
        base: 'rounded-full',
        group: 'first:rounded-l-full last:rounded-r-full',
      }
    return {
      base: 'rounded-md',
      group: 'first:rounded-l-md last:rounded-r-md',
    }
  }, [radius])

  const buttonClassNames = useMemo(() => {
    return cn(
      sizeClassName,
      STYLES['echo-button'],
      radiusClassName.base,
      isInGroup && radiusClassName.group,
      isInGroup && groupContext.classNames?.button,
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
