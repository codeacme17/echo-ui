export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
  onToggleChange?: (toggled: boolean) => void
}

export interface ButtonRef extends HTMLButtonElement {}
