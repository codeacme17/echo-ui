import { logger } from '../../../lib/log'
import { SliderProps } from './types'

export const checkPropsIsValid = ({ value, min, max }: SliderProps) => {
  if (process.env.NODE_ENV !== 'development') return

  if (value! > max!) logger.warn(`Slider - value(${value}) is higher than max(${max})`)
  if (value! < min!) logger.warn(`Slider - value(${value}) is lower than min(${min})`)

  return true
}
