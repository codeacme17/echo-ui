import { forwardRef, useEffect, useContext, useCallback } from 'react'
import { cn } from '../../../lib/utils'
import { ButtonProps, ButtonRef } from './types'
import { ButtonGroupContext } from './context'
import { useStyle } from './styles'
import { RADIUS, SIZE } from './constants'

export const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  const {
    value,
    disabled: _disabled = false,
    toggled: _toggled = false,
    size: _size = SIZE,
    radius: _radius = RADIUS,
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

  return (
    <button
      {...restProps}
      ref={ref}
      data-toggled={toggled}
      data-disable={disabled}
      disabled={disabled}
      className={cn(
        useStyle({ toggled, size, radius, isInGroup }),
        isInGroup && groupContext.classNames?.button,
        restProps.className,
      )}
      style={{
        ...(isInGroup && groupContext?.styles?.button),
        ...restProps.style,
      }}
      onClick={handleClick}
    >
      <span className={cn(disabled && 'text-foreground/60')}>{restProps.children}</span>
    </button>
  )
})
