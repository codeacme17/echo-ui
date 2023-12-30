import { forwardRef, useEffect, useState } from 'react'
import { cn } from '../../../lib/utils'
import { SwitchProps, SwitchRef } from './types'
import { SIZE } from './constants'
import { useStyle } from './styles'

export const Switch = forwardRef<SwitchRef, SwitchProps>((props, ref) => {
  const {
    toggled: _toggled = false,
    disabled = false,
    size = SIZE,
    classNames,
    styles,
    onClick,
    onChange,
    ...restProps
  } = props

  const [toggled, setToggled] = useState(_toggled) // useState to track the toggled state

  // useEffect to call onChange prop whenever toggled state changes
  useEffect(() => {
    if (disabled) return
    onChange?.(toggled)
  }, [toggled, disabled, onChange])

  // Sync the component's toggled state with the toggled prop
  useEffect(() => {
    setToggled(_toggled)
  }, [_toggled])

  // Handle click event
  const handleClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (disabled) return
    setToggled(!toggled)
    onClick && onClick(e)
  }

  const { base, button, thumb, label } = useStyle({ disabled, toggled, size })

  return (
    <label
      {...restProps}
      ref={ref}
      data-toggled={toggled}
      data-disabled={disabled}
      className={cn(base(), restProps.className)}
      style={restProps.style}
      onClick={handleClick}
    >
      {/* Button */}
      <span className={cn(button(), classNames?.button)} style={styles?.button}>
        {/* Thumb */}
        <span
          className={cn(thumb(), classNames?.thumb)}
          style={{ ...styles?.thumb, left: toggled ? `calc(50% + 0.75rem / 2)` : '' }}
        />
      </span>

      {/* Label */}
      <span className={cn(label(), classNames?.label)} style={styles?.label}>
        {restProps.children}
      </span>
    </label>
  )
})
