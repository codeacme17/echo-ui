import { forwardRef } from 'react'
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
    ...restProps
  } = props

  return (
    <button
      {...restProps}
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        styles['echo-button'],
        toggled && styles['echo-button__toggled'],
        toggled && toggledClassName,
        className,
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
