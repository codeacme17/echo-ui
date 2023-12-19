import { Card as _Card } from './Card'
import type { CardProps, CardRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<CardProps & React.RefAttributes<CardRef>>

const Card = _Card as CompoundedComponent
Card.displayName = 'EchoUI.Card'

export { Card }
export default Card
export type { CardProps, CardRef } from './types'
