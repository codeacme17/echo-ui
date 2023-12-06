export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  isToggled?: boolean
  onClick?: () => void
  label?: string
  icon?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  block?: boolean
  ghost?: boolean
}
