import { AbstractProps } from '../../../lib/types'
import type { AxisProps } from '../../visualization'

export interface SliderProps extends AbstractProps {
  value?: number
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  vertical?: boolean
  disabled?: boolean
  hideThumb?: boolean
  hideThumbLabel?: boolean
  thumbLableClassName?: string
  interactive?: boolean
  showAxis?: boolean
  axisProps?: AxisProps
  onChange?: (value: number) => void
}
