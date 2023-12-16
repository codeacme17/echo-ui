export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  rotationRange?: number
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  size?: number | string
  buttonColor?: string
  progressColor?: string
  progressWidth?: number | string
  pointerWidth?: number | string
  pointerHeight?: number | string
  pointerColor?: string
  onChange?: (value: number) => void
}

export interface KnobRef extends HTMLDivElement {}
