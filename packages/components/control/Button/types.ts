import { AbstractProps } from '../../../lib/types'

export interface ButtonProps extends AbstractProps {
  isActive?: boolean
  isToggled?: boolean
  style?: React.CSSProperties
  className?: string
  toggledClassName?: string
  disabled?: boolean
}
