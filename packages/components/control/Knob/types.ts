import { AbstractProps } from '../../../lib/types'

export interface KnobProps extends AbstractProps {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  rotationRange?: number
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  progressColor?: string
  onChange?: (value: number) => void
}

export interface KnobRef extends HTMLDivElement {}
