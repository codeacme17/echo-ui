interface AbstractCheckboxProps<T> extends Omit<React.HTMLAttributes<T>, 'onChange' | 'value'> {
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
   * @description .
   */
  size?: 'sm' | 'md' | 'lg'

  color?: string

  /**
   * @description Custom class names for the checkbox.
   */
  classNames?: { label?: string }

  /**
   * @description Custom styles for the checkbox.
   */
  styles?: { label?: React.CSSProperties }

  /**
   * @description The event handler for when the checkbox value changes.
   */
  onChange?: (e: CheckboxChangeEvent) => void
}

export interface CheckboxProps extends AbstractCheckboxProps<HTMLInputElement> {
  onClick?: React.MouseEventHandler<HTMLElement>
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
}

export interface CheckboxGroupProps extends AbstractCheckboxProps<HTMLDivElement> {
  /**
   * @description The values of the checkbox group.
   */
  value?: any[]

  /**
   * @description Custom class names for the checkbox group.
   */
  classNames?: { checkbox?: string } & AbstractCheckboxProps<HTMLDivElement>['classNames']

  /**
   * @description Custom styles for the checkbox group.
   */
  styles?: { checkbox?: React.CSSProperties } & AbstractCheckboxProps<HTMLDivElement>['styles']
}

export interface CheckboxChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}

export interface CheckboxRef extends HTMLLabelElement {}

export interface CheckboxGroupRef extends HTMLDivElement {}
