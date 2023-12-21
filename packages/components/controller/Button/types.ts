export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  toggled?: boolean
  classNames?: { toggled?: string }
  styles?: { toggled?: React.CSSProperties }
  disabled?: boolean
  onToggleChange?: (toggled: boolean) => void
}

export interface ButtonRef extends HTMLButtonElement {}
