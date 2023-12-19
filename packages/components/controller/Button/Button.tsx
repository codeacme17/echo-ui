import { forwardRef, useEffect } from 'react'
import { ButtonProps, ButtonRef } from './types'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  const {
    disabled = false,
    toggled = false,
    children,
    className,
    style,
    toggledClassName,
    toggledStyle,
    onClick,
    onToggleChange,
    ...restProps
  } = props

  useEffect(() => {
    if (disabled) return
    onToggleChange && onToggleChange(toggled)
  }, [toggled])

  return (
    <button
      {...restProps}
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        styles['echo-button'],
        className,
        toggled && styles['echo-button__toggled'],
        toggled && toggledClassName,
      )}
      style={{
        ...style,
        ...(toggled && toggledStyle),
      }}
    >
      <span className={cn(disabled && 'text-foreground/60')}>{children}</span>
    </button>
  )
})
