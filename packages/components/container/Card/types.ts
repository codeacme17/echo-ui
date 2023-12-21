export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  toggled?: boolean
  classNames?: Record<'toggled', string>
  styles?: Record<'toggled', React.CSSProperties>
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardRef extends HTMLDivElement {}
export interface CardHeaderRef extends HTMLDivElement {}
export interface CardBodyRef extends HTMLDivElement {}
