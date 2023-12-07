import { ButtonProps } from './types'
import { cn } from '../../../lib/utils'
import './styles.css'

export const Button = ({ isToggled, toggledClassName, disabled, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'echo-button',
        !isToggled && 'shadow-neutral-500 dark:shadow-neutral-800 shadow-sm',
        isToggled &&
          `shadow-inner shadow-neutral-500 dark:shadow-neutral-900 bg-primary ${toggledClassName}`,
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
