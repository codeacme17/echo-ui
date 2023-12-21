export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  toggled?: boolean
  classNames?: { toggled?: string }
  styles?: { toggled?: React.CSSProperties }
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardRef extends HTMLDivElement {}
export interface CardHeaderRef extends HTMLDivElement {}
export interface CardBodyRef extends HTMLDivElement {}
