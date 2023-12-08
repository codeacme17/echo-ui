import { AbstractProps } from '../../../lib/types'

export interface SliderProps extends AbstractProps {
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  vertical?: boolean
  onChange?: (value: number) => void
}
