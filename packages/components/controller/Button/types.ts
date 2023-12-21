export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  toggled?: boolean
  classNames?: Record<'toggled', string>
  styles?: Record<'toggled', React.CSSProperties>
  disabled?: boolean
  onToggleChange?: (toggled: boolean) => void
}

export interface ButtonRef extends HTMLButtonElement {}
