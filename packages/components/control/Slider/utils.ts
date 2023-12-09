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
    if (leftValue > MAX) logger.warn('VuMeter - dB left value is higher than MAX (5)')
    if (leftValue < MIN) logger.warn('VuMeter - dB left value is lower than MIN (-60)')
    if (rightValue > MAX) logger.warn('VuMeter - dB right value is higher than MAX (5)')
    if (rightValue < MIN) logger.warn('VuMeter - dB right value is lower than MIN (-60)')
  } else {
    if (value > MAX) logger.warn('VuMeter - dB value is higher than MAX (5)')
    if (value < MIN) logger.warn('VuMeter - dB value is lower than MIN (-60)')
  }

  return true
}

export const validValue = (v: number, min: number, max: number) => {
  if (v < min) return min
  if (v > max) return max
  return v
}
