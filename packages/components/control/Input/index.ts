import { InputProps } from './types'
import { Input as _Input } from './Input'

type CompoundedComponent = React.ForwardRefExoticComponent<InputProps>
const Input = _Input as CompoundedComponent

export { Input }
