export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  toggled?: boolean
  toggledClassName?: string
  toggledStyle?: React.CSSProperties
  disabled?: boolean
  onToggleChange?: (toggled: boolean) => void
}

export interface ButtonRef extends HTMLButtonElement {}
