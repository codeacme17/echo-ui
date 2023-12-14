interface AbstractCheckboxpProps {
  value?: any
  disabled?: boolean
  checked?: boolean
  onChange?: (e: CheckboxChangeEvent) => void
}

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>,
    AbstractCheckboxpProps {
  onMouseDown?: React.MouseEventHandler
  onMouseLeave?: React.MouseEventHandler
}

export interface CheckboxGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    AbstractCheckboxpProps {
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
