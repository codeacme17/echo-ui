export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  bilateral?: boolean
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

export interface KnobTopLabelProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface KnobBottomLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface KnobRef extends HTMLDivElement {}
export interface KnobTopLabelRef extends HTMLDivElement {}
export interface KnobBottomLabelRef extends HTMLDivElement {}
