import { Knob as _Knob } from './Knob'
import { KnobGroup } from './Group'
import type { KnobProps, KnobRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  KnobProps & React.RefAttributes<KnobRef>
> & {
  Group: typeof KnobGroup
}

const Knob = _Knob as CompoundedComponent
Knob.displayName = 'EchoUI.Knob'
KnobGroup.displayName = 'EchoUI.KnobGroup'
Knob.Group = KnobGroup

export { Knob }
export default Knob
export type { KnobProps, KnobRef, KnobGroupProps, KnobGroupRef } from './types'
