import { AbstractProps } from '../../../lib/types'

export interface CheckboxProps extends AbstractProps {
  value?: any
  disabled?: boolean
  checked?: boolean
  checkboxInputClassName?: string
  onChange?: (e: CheckboxChangeEvent) => void
}

export interface CheckboxGroupProps extends CheckboxProps {
  value?: any[]
  defaultValue?: any[]
}

export interface CheckboxChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}
