import { InputProps, InputRef } from './types'
import { Input as _Input } from './Input'

type CompoundedComponent = React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<InputRef>
>
const Input = _Input as CompoundedComponent

export { Input }
export default Input
export type { InputProps, InputChangeEvent } from './types'
