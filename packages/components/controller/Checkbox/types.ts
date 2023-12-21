interface AbstractCheckboxpProps<T> extends Omit<React.HTMLAttributes<T>, 'onChange' | 'value'> {
  /**
   * @description The value of the checkbox.
   */
  value?: any

  /**
   * @description Determines whether the checkbox is disabled or not.
   */
  disabled?: boolean

  /**
   * @description Determines whether the checkbox is checked or not.
   */
  checked?: boolean

  /**
   * @description The size of the checkbox.
   */
  size?: number | string

  /**
   * @description The color of the checkbox button.
   */
  buttonColor?: string

  /**
   * @description The border width of the checkbox button.
   */
  buttonBorderWidth?: number | string

  /**
   * @description The color of the checkbox when checked.
   */
  checkedColor?: string

  /**
   * @description The event handler for when the checkbox value changes.
   */
  onChange?: (e: CheckboxChangeEvent) => void
}

export interface CheckboxProps extends AbstractCheckboxpProps<HTMLInputElement> {
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
  onClick?: React.MouseEventHandler<HTMLElement>
}

export interface CheckboxGroupProps extends AbstractCheckboxpProps<HTMLDivElement> {
  value?: any[]
  classNames?: Record<'checkbox', string>
  styles?: Record<'checkbox', React.CSSProperties>
}

export interface CheckboxChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}

export interface CheckboxRef extends HTMLLabelElement {}

export interface CheckboxGroupRef extends HTMLDivElement {}
