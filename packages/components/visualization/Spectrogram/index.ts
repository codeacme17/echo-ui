import { Spectrogram as _Spectrogram } from './Spectrogram'
import type { SpectrogramProps, SpectrogramRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  SpectrogramProps & React.RefAttributes<SpectrogramRef>
>

const Spectrogram = _Spectrogram as CompoundedComponent
Spectrogram.displayName = 'Echo.Spectrogram'

export { Spectrogram }
export type { SpectrogramProps, SpectrogramRef, SpectrogramDataPoint } from './types'
