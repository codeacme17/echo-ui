import { LFO as _LFO } from './LFO'
import { LFOProps, LFORef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<LFOProps & React.RefAttributes<LFORef>>

const LFO = _LFO as CompoundedComponent
LFO.displayName = 'EchoUI.LFO'

export { LFO }
export default LFO
export type { LFOProps, LFORef } from './types'
