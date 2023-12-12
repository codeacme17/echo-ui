import { KnobProps, KnobRef } from './types'
import { Knob as _Knob } from './Konb'

type CompoundedComponent = React.ForwardRefExoticComponent<KnobProps & React.RefAttributes<KnobRef>>
const Knob = _Knob as CompoundedComponent

export { Knob }
export default Knob
export type { KnobProps, KnobRef } from './types'
