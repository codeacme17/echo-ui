import { Checkbox as _Checkbox } from './Checkbox'
import { CheckboxGroup } from './Group'

export type { CheckboxProps, CheckboxChangeEvent } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<CheckboxProps, HTMLLabelElement> & {
  Group: typeof CheckboxGroup
}

const Checkbox = _Checkbox as CompoundedComponent
Checkbox.Group = CheckboxGroup as CompoundedComponent

export { Checkbox }
export default Checkbox
