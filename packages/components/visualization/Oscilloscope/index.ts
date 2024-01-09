import { Oscilloscope as _Oscilloscope } from './Oscilloscope'
import type { OscilloscopeProps, OscilloscopeRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  OscilloscopeProps & React.RefAttributes<OscilloscopeRef>
>

const Oscilloscope = _Oscilloscope as CompoundedComponent
Oscilloscope.displayName = 'EchoUI.Oscilloscope'

export { Oscilloscope }
export default Oscilloscope
export type { OscilloscopeProps, OscilloscopeRef } from './types'
