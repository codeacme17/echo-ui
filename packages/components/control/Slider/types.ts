import { AbstractProps } from '../../../lib/types'

export interface SliderProps extends AbstractProps {
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  vertical?: boolean
  disabled?: boolean
  showThumb?: boolean
  interactive?: boolean
  onChange?: (value: number) => void
}
