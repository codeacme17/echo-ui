import { __DEV__ } from '../../../lib/assertion'
import { logger } from '../../../lib/log'

import { KnobProps } from './types'
export const checkPropsIsValid = ({ value, min, max, rotationRange }: KnobProps) => {
  if (!__DEV__) return

  if (value! > max!) logger.warn(`Knob - value(${value}) is higher than max(${max})`)
  if (value! < min!) logger.warn(`Knob - value(${value}) is lower than min(${min})`)

  if (rotationRange! < 0) logger.error(`Knob - rotationRange(${rotationRange}) can't lower than 0`)
  if (rotationRange! > 360)
    logger.error(`Knob - rotationRange(${rotationRange}) can't higher than 360`)

  return true
}
