import { KnobProps } from './types'
import { Knob as _Knob } from './Konb'

export type { KnobProps } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<KnobProps>
const Knob = _Knob as CompoundedComponent

export { Knob }
