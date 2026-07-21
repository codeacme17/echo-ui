export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * @description Whether the card is toggled or not.
   */
  toggled?: boolean
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>

export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>

export type CardRef = HTMLDivElement

export type CardHeaderRef = HTMLDivElement

export type CardBodyRef = HTMLDivElement
