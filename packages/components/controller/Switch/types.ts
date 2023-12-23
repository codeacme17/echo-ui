export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
  disabled?: boolean
  toggled?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (toggled: boolean) => void
}

export interface SwitchRef extends HTMLLabelElement {}
