import { Light as _Light } from './Light'
import { LightProps, LightRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  LightProps & React.RefAttributes<LightRef>
>

const Light = _Light as CompoundedComponent
Light.displayName = 'EchoUI.Light'

export { Light }
export default Light
export type { LightProps, LightRef } from './types'
