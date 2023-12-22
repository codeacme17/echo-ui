import { Button as _Button } from './Button'
import { ButtonGroup } from './Group'
import type { ButtonProps, ButtonRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<ButtonRef>
> & {
  Group: typeof ButtonGroup
}

const Button = _Button as CompoundedComponent
Button.Group = ButtonGroup
Button.displayName = 'EchoUI.Button'
Button.Group.displayName = 'EchoUI.ButtonGroup'

export { Button }
export default Button
export type { ButtonProps, ButtonRef, ButtonGroupProps, ButtonGroupRef } from './types'
