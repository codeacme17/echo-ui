export interface SwitchProps extends React.HTMLAttributes<HTMLLabelElement> {
  toggled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export interface SwitchRef extends HTMLLabelElement {}
