export interface CheckboxProps {
  value?: any
  disabled?: boolean
  checked?: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
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
