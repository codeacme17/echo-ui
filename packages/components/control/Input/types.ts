import { AbstractProps } from '../../../lib/types'

export interface InputProps extends AbstractProps {
  value?: any
  disabled?: boolean
  type?: React.HTMLInputTypeAttribute
  placeholder?: string

  onChange?: (e: InputChangeEvent) => void
}

export interface InputChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}
