export interface RadioProps {
  value?: any
  disabled?: boolean
  checked?: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  radioButtonClassName?: string

  onChange?: (e: RadioChangeEvent) => void
}

export interface RadioGroupProps extends RadioProps {
  defaultValue?: any
}

export interface RadioChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}
