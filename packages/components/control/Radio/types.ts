import { AbstractProps } from '../../../lib/types'

export interface RadioProps extends AbstractProps {
  value?: any
  disabled?: boolean
  checked?: boolean
  radioInputClassName?: string

  onChange?: (e: RadioChangeEvent) => void
}

export interface RadioGroupProps extends RadioProps {
  defaultValue?: any
}

export interface RadioChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}
