import { CardHeader, Card as _Card } from './Card'
import type { CardProps, CardRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<CardRef>
> & {
  Header: typeof CardHeader
}

const Card = _Card as CompoundedComponent
Card.Header = CardHeader
Card.displayName = 'EchoUI.Card'
CardHeader.displayName = 'EchoUI.Card.Header'

export { Card }
export default Card
export type { CardProps, CardRef, CardHeaderProps, CardHeaderRef } from './types'
