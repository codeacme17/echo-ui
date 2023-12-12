import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { ButtonProps, ButtonRef } from './types'
import styles from './styles.module.css'

export const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  const { isToggled, toggledClassName, disabled, ...restProps } = props

  return (
    <button
      ref={ref}
      className={cn(
        styles['echo-button'],
        isToggled && styles['echo-button-toggle'],
        isToggled && toggledClassName,
        disabled && styles['echo-button-disabled'],
        restProps.className,
      )}
      disabled={disabled}
      onClick={restProps.onClick}
      style={restProps.style}
    >
      <span className={cn(disabled && 'text-foreground/60')}>{restProps.children}</span>
    </button>
  )
})
