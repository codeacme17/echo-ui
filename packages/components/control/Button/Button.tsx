import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { ButtonProps, ButtonRef } from './types'
import styles from './styles.module.css'

export const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  const { disabled = false, toggled = false, toggledClassName, toggledStyle, ...restProps } = props

  return (
    <button
      ref={ref}
      className={cn(
        styles['echo-button'],
        toggled && styles['echo-button__toggled'],
        toggled && toggledClassName,
        restProps.className,
      )}
      disabled={disabled}
      onClick={restProps.onClick}
      style={{
        ...restProps.style,
        ...(toggled && toggledStyle),
      }}
    >
      <span className={cn(disabled && 'text-foreground/60')}>{restProps.children}</span>
    </button>
  )
})
