import { __DEV__ } from '../../../lib/assertion'
import { logger } from '../../../lib/log'

import { KnobProps } from './types'
export const checkPropsIsValid = ({ value, min, max, rotationRange }: KnobProps) => {
  if (!__DEV__) return

  if (value! > max!) logger.warn(`Knob - value(${value}) is higher than max(${max})`)
  if (value! < min!) logger.warn(`Knob - value(${value}) is lower than min(${min})`)

  if (rotationRange! > 360)
    logger.warn(`Knob - rotationRange(${rotationRange}) is higher than max(360)`)
  if (rotationRange! < 90)
    logger.warn(`Knob - rotationRange(${rotationRange}) is lower than min(90)`)

  return true
}
