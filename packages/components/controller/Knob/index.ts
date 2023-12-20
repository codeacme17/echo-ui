import { KnobProps, KnobRef } from './types'
import { Knob as _Knob, KnobTopLabel, KnobBottomLabel } from './Knob'

type CompoundedComponent = React.ForwardRefExoticComponent<
  KnobProps & React.RefAttributes<KnobRef>
> & {
  TopLabel: typeof KnobTopLabel
  BottomLabel: typeof KnobBottomLabel
}

const Knob = _Knob as CompoundedComponent
Knob.TopLabel = KnobTopLabel
Knob.BottomLabel = KnobBottomLabel

Knob.displayName = 'EchoUI.Knob'
KnobTopLabel.displayName = 'EchoUI.Knob.TopLabel'
KnobBottomLabel.displayName = 'EchoUI.Knob.BottomLabel'

export { Knob }
export default Knob
export type {
  KnobProps,
  KnobTopLabelProps,
  KnobBottomLabelProps,
  KnobRef,
  KnobTopLabelRef,
  KnobBottomLabelRef,
} from './types'
