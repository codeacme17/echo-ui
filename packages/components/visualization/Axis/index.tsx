import { Axis as _Axis } from './Axis'
import type { AxisProps } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<AxisProps>

const Axis = _Axis as CompoundedComponent
Axis.displayName = 'EchoUI.Axis'

export { Axis }
export default Axis
export type { AxisProps } from './types'
