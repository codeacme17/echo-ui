import { Radio as _Radio } from './Radio'
import { RadioGroup } from './Group'
import { RadioProps, RadioRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  RadioProps & React.RefAttributes<RadioRef>
> & {
  Group: typeof RadioGroup
}

const Radio = _Radio as CompoundedComponent
Radio.Group = RadioGroup

export { Radio }
export default Radio
export type { RadioProps, RadioChangeEvent, RadioRef, RadioGroupRef } from './types'
