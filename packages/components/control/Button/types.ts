import { AbstractProps } from '../../../lib/types'

export interface ButtonProps extends AbstractProps {
  toggled?: boolean
  className?: string
  style?: React.CSSProperties
  toggledClassName?: string
  toggledStyle?: React.CSSProperties
  disabled?: boolean
}

export interface ButtonRef extends HTMLButtonElement {}
