import { cn } from '../../../lib/utils'
import { ButtonProps } from './types'
import './styles.css'

export const Button = ({ isToggled, toggledClassName, disabled, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'echo-button',
        !isToggled && 'shadow-muted shadow-sm',
        isToggled && `shadow-inner shadow-muted bg-primary ${toggledClassName}`,
        disabled && 'cursor-not-allowed opacity-50',
        props.className,
      )}
      disabled={disabled}
      onClick={props.onClick}
    >
      <span className={cn(disabled && 'text-foreground/60')}>{props.children}</span>
    </button>
  )
}
