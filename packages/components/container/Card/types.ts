export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * @description Whether the card is toggled or not.
   */
  toggled?: boolean

  /**
   * @description Allows to set custom class names for the card slots.
   */
  classNames?: { toggled?: string }

  /**
   * @description Allows to set custom style sheets for the card slots.
   */
  styles?: { toggled?: React.CSSProperties }
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardRef extends HTMLDivElement {}

export interface CardHeaderRef extends HTMLDivElement {}

export interface CardBodyRef extends HTMLDivElement {}
