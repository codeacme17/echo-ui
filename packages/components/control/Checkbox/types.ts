interface AbstractCheckboxpProps<T> extends Omit<React.HTMLAttributes<T>, 'onChange' | 'value'> {
  value?: any
  disabled?: boolean
  checked?: boolean
  onChange?: (e: CheckboxChangeEvent) => void
}

export interface CheckboxProps extends AbstractCheckboxpProps<HTMLInputElement> {
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
}

export interface CheckboxGroupProps extends AbstractCheckboxpProps<HTMLDivElement> {
  value?: any[]
  checkboxStyle?: React.CSSProperties
  checkboxClassName?: string
}

export interface CheckboxChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}

export interface CheckboxRef extends HTMLLabelElement {}

export interface CheckboxGroupRef extends HTMLDivElement {}
