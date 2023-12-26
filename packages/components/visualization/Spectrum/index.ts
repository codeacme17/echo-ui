import { Spectrum as _Spectrum } from './Spectrum'
import type { SpectrumProps, SpectrumRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  SpectrumProps & React.RefAttributes<SpectrumRef>
>

const Spectrum = _Spectrum as CompoundedComponent
Spectrum.displayName = 'Echo.Spectrum'

export { Spectrum }
export type { SpectrumProps, SpectrumRef, SpectrumDataPoint } from './types'
