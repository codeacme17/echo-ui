export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'children'> {
  value?: any
  type?: 'text' | 'number'
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
