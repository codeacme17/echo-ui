import { KnobProps, KnobRef } from './types'
import { Knob as _Knob, KnobTopLabel, KnobBottomLabel } from './Knob'

type CompoundedComponent = React.ForwardRefExoticComponent<
  KnobProps & React.RefAttributes<KnobRef>
> & {
  TopLabel: typeof KnobTopLabel
  BottomLabel: typeof KnobBottomLabel
}
const Knob = _Knob as CompoundedComponent
Knob.displayName = 'EchoUI.Knob'
Knob.TopLabel = KnobTopLabel
Knob.BottomLabel = KnobBottomLabel

export { Knob }
export default Knob
export type { KnobProps, KnobRef } from './types'
