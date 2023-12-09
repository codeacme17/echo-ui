import { AbstractProps } from '../../../lib/types'

export interface AxisProps extends AbstractProps {
  min?: number
  max?: number
  ticks?: number
  axisClassName?: string
  tickSize?: number
  vertical?: boolean
}
