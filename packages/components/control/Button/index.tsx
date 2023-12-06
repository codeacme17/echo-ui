import { cn } from '../../../lib/utils'
import { ButtonProps } from './types'
import './style.css'

export const Button = ({ ...props }: ButtonProps) => {
  return (
    <button className={cn(props.className)} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
