import { AbstractProps } from '../../../lib/types'

export interface InputProps extends AbstractProps {
  value?: any
  disabled?: boolean
  type?: 'text' | 'number'
  placeholder?: string
  min?: number
  max?: number
  step?: number
  sensitivity?: number
  draggable?: boolean
  hideProgress?: boolean
  progressColor?: string

  onChange?: (e: InputChangeEvent) => void
}

export interface InputChangeEvent {
  value: any
  nativeEvent?: React.ChangeEvent<HTMLInputElement>
}
