import { Envelope as _Envelope } from './Envelope'
import type { EnvelopeProps, EnvelopeRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  EnvelopeProps & React.RefAttributes<EnvelopeRef>
>

const Envelope = _Envelope as CompoundedComponent
Envelope.displayName = 'EchoUI.Envelope'

export { Envelope }
export default Envelope
export type { EnvelopeProps, EnvelopeRef, EnvelopeData, EnvelopeLimits } from './types'
