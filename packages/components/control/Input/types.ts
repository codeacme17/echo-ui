import { AbstractProps } from '../../../lib/types'

export interface InputProps extends AbstractProps {
  value?: string
  onChange?: (value: InputEvent) => void
}

export interface InputEvent {
  value: string
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}
