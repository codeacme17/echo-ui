export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
  disabled?: boolean
  toggled?: boolean
  size?: 'sm' | 'md' | 'lg'
  classNames?: {
    label?: string
    button?: string
    thumb?: string
  }
  styles?: {
    label?: React.CSSProperties
    button?: React.CSSProperties
    thumb?: React.CSSProperties
  }
  onChange?: (toggled: boolean) => void
}

export interface SwitchRef extends HTMLLabelElement {}
