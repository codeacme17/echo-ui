import { logger } from '../../../lib/log'
import { MIN, MAX } from './constants'

export const checkPropsIsValid = (value: number | number[]) => {
  if (process.env.NODE_ENV !== 'development') return
  const isStereo = Array.isArray(value)

  if (isStereo) {
    if (value.length !== 2) {
      logger.error('VuMeter - dB array length is not equal to 2!')
      return false
    }

    const [leftValue, rightValue] = value
    if (leftValue > MAX)
      logger.warn(`VuMeter - dB left value(${value[0]}) is higher than MAX(${MAX})`)
    if (leftValue < MIN)
      logger.warn(`VuMeter - dB left value(${value[0]}) is lower than MIN(${MIN})`)
    if (rightValue > MAX)
      logger.warn(`VuMeter - dB right value(${value[1]}) is higher than MAX(${MAX})`)
    if (rightValue < MIN)
      logger.warn(`VuMeter - dB right value(${value[1]}) is lower than MIN(${MIN})`)
  } else {
    if (value > MAX) logger.warn(`VuMeter - dB value(${value}) is higher than MAX (${MAX})`)
    if (value < MIN) logger.warn(`VuMeter - dB value(${value}) is lower than MIN (${MIN})`)
  }

  return true
}
