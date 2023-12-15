export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  toggled?: boolean
  toggledClassName?: string
  toggledStyle?: React.CSSProperties
  disabled?: boolean
}

export interface ButtonRef extends HTMLButtonElement {}
