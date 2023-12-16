import { IndicatorLight as _IndicatorLight } from './IndicatorLight'
import { IndicatorLightProps, IndicatorLightRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  IndicatorLightProps & React.RefAttributes<IndicatorLightRef>
>

const IndicatorLight = _IndicatorLight as CompoundedComponent

IndicatorLight.displayName = 'EchoUI.IndicatorLight'

export { IndicatorLight }
export default IndicatorLight
export type { IndicatorLightProps, IndicatorLightRef } from './types'
