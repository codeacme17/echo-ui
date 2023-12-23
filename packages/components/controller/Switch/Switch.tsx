import { forwardRef, useEffect, useMemo, useState } from 'react'
import { SwitchProps, SwitchRef } from './types'
import { SIZE } from './constants'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

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

  // =========== events ============= //
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

  // =========== styles ============= //
  // Define the class names based on the size prop
  const sizeClassNames = useMemo(() => {
    if (size === 'sm') return { button: 'w-12 h-6', thumb: 'w-3 h-3', label: 'text-sm' }
    if (size === 'lg') return { button: 'w-16 h-10', thumb: 'w-5 h-5', label: 'text-lg' }
    return { button: 'w-14 h-8', thumb: 'w-4 h-4' }
  }, [size])

  return (
    <label
      {...restProps}
      ref={ref}
      data-toggled={toggled}
      data-disabled={disabled}
      className={cn(
        'group',
        STYLES['echo-switch'],
        restProps.className,
        disabled && STYLES['echo-switch__disabled'],
      )}
      style={restProps.style}
      onClick={handleClick}
    >
      {/* Button */}
      <span
        className={cn(
          STYLES['echo-switch-button'],
          sizeClassNames.button,
          classNames?.button,
          toggled && STYLES['echo-switch-button__toggled'],
          disabled && STYLES['echo-switch-button__disabled'],
        )}
        style={styles?.button}
      >
        {/* Thumb */}
        <span
          className={cn(
            STYLES['echo-switch-thumb'],
            sizeClassNames.thumb,
            classNames?.thumb,
            toggled && STYLES['echo-switch-thumb__toggled'],
            disabled && STYLES['echo-switch-thumb__disabled'],
          )}
          style={styles?.thumb}
        />
      </span>

      {/* Label */}
      <span
        className={cn(STYLES['echo-switch-label'], sizeClassNames.label, classNames?.label)}
        style={styles?.label}
      >
        {restProps.children}
      </span>
    </label>
  )
})
