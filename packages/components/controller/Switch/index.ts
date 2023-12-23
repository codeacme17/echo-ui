import { Switch as _Switch } from './Switch'
import { SwitchProps, SwitchRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  SwitchProps & React.RefAttributes<SwitchRef>
>

const Switch = _Switch as CompoundedComponent
Switch.displayName = 'EchoUI.Switch'

export { Switch }
export default Switch
export type { SwitchProps, SwitchRef } from './types'
