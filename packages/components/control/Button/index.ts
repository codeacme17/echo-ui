import { Button as _Button } from './Button'
import type { ButtonProps, ButtonRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<ButtonRef>
>
const Button = _Button as CompoundedComponent

export { Button }
export default Button
export type { ButtonProps, ButtonRef } from './types'
