import { Checkbox as _Checkbox } from './Checkbox'
import { CheckboxGroup } from './Group'
import type { CheckboxProps, CheckboxRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  CheckboxProps & React.RefAttributes<CheckboxRef>
> & {
  Group: typeof CheckboxGroup
}

const Checkbox = _Checkbox as CompoundedComponent
Checkbox.displayName = 'EchoUI.Checkbox'
CheckboxGroup.displayName = 'EchoUI.CheckboxGroup'
Checkbox.Group = CheckboxGroup

export { Checkbox }
export default Checkbox
export type { CheckboxProps, CheckboxChangeEvent, CheckboxRef, CheckboxGroupRef } from './types'
