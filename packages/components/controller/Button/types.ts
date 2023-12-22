interface AbstractButtonProps<T> extends React.HTMLAttributes<T> {
  /**
   * @description The current button value, only meaningful in button group.
   */
  value?: any

  /**
   * @description Indicates if the button is disabled.
   */
  disabled?: boolean

  /**
   * @description The button size.
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * @description Allows to set custom class names for the button slots.
   */
  classNames?: { toggled?: string }

  /**
   * @description Allows to set custom style sheets for the button slots.
   */
  styles?: { toggled?: React.CSSProperties }
}

export interface ButtonProps extends AbstractButtonProps<ButtonRef> {
  /**
   * @description Whether the button is toggled or not.
   */
  toggled?: boolean

  /**
   * @description Callback function when the toggle state changes.
   */
  onToggleChange?: (toggled: boolean) => void
}

export interface ButtonGroupProps extends Omit<AbstractButtonProps<ButtonGroupRef>, 'onChange'> {
  /**
   * @description The values associated with the button group.
   */
  value?: any[]

  /**
   * @description Allows to set custom class names for the button and toggled state.
   */
  classNames?: { button?: string; toggled?: string }

  /**
   * @description Allows to set custom style sheets for the button and toggled state.
   */
  styles?: { button?: React.CSSProperties; toggled?: React.CSSProperties }

  /**
   * @description Callback function when the values in the button group change.
   */
  onChange?: (values: any[]) => void
}

export interface ButtonRef extends HTMLButtonElement {}

export interface ButtonGroupRef extends HTMLDivElement {}
