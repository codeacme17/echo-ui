import { Checkbox as _Checkbox } from './Checkbox'
import { CheckboxGroup } from './Group'
import type { CheckboxProps } from './types'

export type { CheckboxProps, CheckboxChangeEvent } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  CheckboxProps & React.RefAttributes<HTMLLabelElement>
> & {
  Group: typeof CheckboxGroup
}

const Checkbox = _Checkbox as CompoundedComponent
Checkbox.Group = CheckboxGroup

export { Checkbox }
export default Checkbox
