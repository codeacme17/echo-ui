export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'children' | 'size'> {
  value?: any
  type?: 'text' | 'number'
  size?: 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  placeholder?: string
  min?: number
  max?: number
  step?: number
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  prohibitDrag?: boolean
  hideProgress?: boolean
  progressColor?: string
  onChange?: (e: InputChangeEvent) => void
}

export interface InputChangeEvent {
  value: any
  nativeEvent?: React.ChangeEvent<HTMLInputElement>
}

export interface InputRef extends HTMLInputElement {}
