export interface ButtonProps extends Omit<React.HTMLAttributes<ButtonRef>, 'onChange'> {
  /**
   * @description The current button value.
   */
  value?: any

  /**
   * @description Whether the button is toggled or not.
   */
  toggled?: boolean

  /**
   * @description Allows to set custom class names for the button slots.
   */
  classNames?: { toggled?: string }

  /**
   * @description Allows to set custom style sheets for the button slots.
   */
  styles?: { toggled?: React.CSSProperties }

  /**
   * @description Indicates if the button is disabled.
   */
  disabled?: boolean

  /**
   * @description Callback function when the toggle state changes.
   */
  onChange?: (toggled: boolean) => void
}

export interface ButtonGroupProps extends Omit<React.HTMLAttributes<ButtonGroupRef>, 'onChange'> {
  values?: any[]
  disabled?: boolean
  onChange?: (values: any[]) => void
}

export interface ButtonRef extends HTMLButtonElement {}

export interface ButtonGroupRef extends HTMLDivElement {}
