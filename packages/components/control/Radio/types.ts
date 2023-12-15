interface AbstractRadioProps<T> extends Omit<React.HTMLAttributes<T>, 'onChange'> {
  value?: any
  disabled?: boolean
  checked?: boolean
  size?: number | string
  buttonColor?: string
  buttonBorderWidth?: number | string
  checkedColor?: string
  onChange?: (e: RadioChangeEvent) => void
}

export interface RadioProps extends AbstractRadioProps<HTMLInputElement> {
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
}

export interface RadioGroupProps extends AbstractRadioProps<HTMLDivElement> {
  defaultValue?: any
  radioStyle?: React.CSSProperties
  radioClassName?: string
}

export interface RadioChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>
}

export interface RadioRef extends HTMLLabelElement {}

export interface RadioGroupRef extends HTMLDivElement {}
