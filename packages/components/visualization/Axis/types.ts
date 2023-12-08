import { AbstractProps } from '../../../lib/types'

export interface AxiosProps extends AbstractProps {
  min: number
  max: number
  lumpsQuantity: number
  axisClassName?: string
}
