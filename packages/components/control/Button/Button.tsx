import { forwardRef } from 'react'
import { ButtonProps } from './types'
import { cn } from '../../../lib/utils'
import './styles.css'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { isToggled, toggledClassName, disabled, ...restProps } = props

  return (
    <button
      ref={ref}
      className={cn(
        'echo-button',
        isToggled && `echo-button-toggle ${toggledClassName}`,
        disabled && 'echo-button-disabled',
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
