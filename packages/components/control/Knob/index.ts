import { KnobProps } from './types'
import { Knob as _Knob } from './Konb'

type CompoundedComponent = React.ForwardRefExoticComponent<KnobProps>
const Knob = _Knob as CompoundedComponent

export { Knob }
export type { KnobProps } from './types'
