import { VuMeter as _VuMeter } from './VuMeter'
import { VuMeterProps, VuMeterRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  VuMeterProps & React.RefAttributes<VuMeterRef>
>

const VuMeter = _VuMeter as CompoundedComponent

export { VuMeter }
export default VuMeter
export type { VuMeterProps, VuMeterRef } from './types'
