import { __DEV__ } from '../../../lib/assertion'
import { logger } from '../../../lib/log'

import { KnobProps } from './types'
export const checkPropsIsValid = ({ value, min, max }: KnobProps) => {
  if (!__DEV__) return

  if (value! > max!) logger.warn(`Knob - value(${value}) is higher than max(${max})`)
  if (value! < min!) logger.warn(`Knob - value(${value}) is lower than min(${min})`)

  return true
}
