import { AbstractProps } from '../../../lib/types'

export interface CheckboxProps extends AbstractProps {
  value?: any
  disabled?: boolean
  checked?: boolean
  inputClassName?: string
  inputStyle?: React.CSSProperties
  labelClassName?: string
  labelStyle?: React.CSSProperties
  onChange?: (e: CheckboxChangeEvent) => void
}

export interface CheckboxGroupProps extends CheckboxProps {
  value?: any[]
  defaultValue?: any[]
  checkboxStyle?: React.CSSProperties
  checkboxClassName?: string
}

export interface CheckboxChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}

export interface CheckboxRef extends HTMLLabelElement {}

export interface CheckboxGroupRef extends HTMLDivElement {}
