import { Button as _Button } from './Button'
import type { ButtonProps } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<ButtonProps>
const Button = _Button as CompoundedComponent

export { Button }
export default Button
export type { ButtonProps } from './types'
