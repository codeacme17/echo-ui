import { logger } from '../../../lib/log'

export const checkPropsIsValid = (value: number, min: number, max: number) => {
  if (process.env.NODE_ENV !== 'development') return

  if (value > max) logger.warn(`Slider - value(${value}) is higher than max(${max})`)
  if (value < min) logger.warn(`Slider - value(${value}) is lower than min(${min})`)

  return true
}
