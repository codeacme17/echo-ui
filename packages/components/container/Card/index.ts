import { Card as _Card, CardBody, CardHeader } from './Card'
import type { CardProps, CardRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<CardRef>
> & {
  Header: typeof CardHeader
  Body: typeof CardBody
}

const Card = _Card as CompoundedComponent
Card.Header = CardHeader
Card.Body = CardBody
Card.displayName = 'EchoUI.Card'
CardHeader.displayName = 'EchoUI.Card.Header'
CardBody.displayName = 'EchoUI.Card.Body'

export { Card }
export default Card
export type { CardProps, CardRef, CardHeaderProps, CardHeaderRef, CardBodyRef } from './types'
