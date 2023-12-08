import { AbstractProps } from '../../../lib/types'

export interface KnobProps extends AbstractProps {
  // Current value of the knob
  value?: number

  // Minimum value the knob can represent
  min?: number

  // Maximum value the knob can represent
  max?: number

  // Step size for the knob's value changes
  step?: number

  // If true, the knob will be disabled and not interactive
  disabled?: boolean

  // Size of the knob, can be a specific number or predefined sizes like 'small', 'medium', 'large'
  size?: 'small' | 'medium' | 'large'

  // Label or description text for the knob
  label?: string

  // Range of rotation for the knob in degrees, default is usually 270 degrees
  rotationRange?: number

  onValueChange?: (value: number) => void
}
