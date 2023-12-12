import { Radio as _Radio } from './Radio'
import { RadioGroup } from './Group'
import { RadioProps } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<RadioProps> & {
  Group: typeof RadioGroup
}
const Radio = _Radio as CompoundedComponent
Radio.Group = RadioGroup

export { Radio }
export default Radio
export type { RadioProps, RadioChangeEvent } from './types'
