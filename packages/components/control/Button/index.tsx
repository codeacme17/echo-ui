import { cn } from '../../../lib/utils'
import { ButtonProps } from './types'
import './style.css'

export const Button = ({ disabled, block, ghost, ...props }: ButtonProps) => {
  return (
    <button
      className={cn('echo-button', block && 'w-full', ghost && 'bg-transparent', props.className)}
      disabled={disabled}
      onClick={props.onClick}
    >
      <span>{props.children}</span>
    </button>
  )
}
