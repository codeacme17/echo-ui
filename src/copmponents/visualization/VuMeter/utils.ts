import { logger } from '@/lib/log'
import { MIN, MAX } from './constants'

export const checkPropsIsValid = (value: number | number[]) => {
  if (process.env.NODE_ENV !== 'development') return
  const isStero = Array.isArray(value)

  if (isStero) {
    if (value.length !== 2) {
      logger.error('VuMeter - dB array length is not equal to 2!')
      return false
    }

    const [leftValue, rightValue] = value
    if (leftValue > MAX)
      logger.warn('VuMeter - dB left value is higher than MAX (5)')
    if (leftValue < MIN)
      logger.warn('VuMeter - dB left value is lower than MIN (-60)')
    if (rightValue > MAX)
      logger.warn('VuMeter - dB right value is higher than MAX (5)')
    if (rightValue < MIN)
      logger.warn('VuMeter - dB right value is lower than MIN (-60)')
  } else {
    if (value > MAX) logger.warn('VuMeter - dB value is higher than MAX (5)')
    if (value < MIN) logger.warn('VuMeter - dB value is lower than MIN (-60)')
  }

  return true
}
