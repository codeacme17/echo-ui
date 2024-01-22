import { Waveform as _Waveform } from './Waveform'
import type { WaveformProps, WaveformRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  WaveformProps & React.RefAttributes<WaveformRef>
>

const Waveform = _Waveform as CompoundedComponent
Waveform.displayName = 'EchoUI.Waveform'

export { Waveform }
export default Waveform
export type { WaveformProps, WaveformRef, WaveformMouseEvent } from './types'
