import { VuMeter as _VuMeter } from './VuMeter'
import { VuMeterProps } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<VuMeterProps>
const VuMeter = _VuMeter as CompoundedComponent

export { VuMeter }
export type { VuMeterProps } from './types'
