import React from 'react'
import { Card, Light } from 'echo-ui'
import { UsageBox } from '.'
import { CardActualScenario } from '../../components/Example/CardActualScenario'

export const Default = () => {
  const scope = { Card }
  const code = `<Card>
  <Card.Header> Header </Card.Header>
  <Card.Body> 
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum natus dolorem sit quas placeat cupiditate hic voluptatem blanditiis minima magnam asperiores laudantium deserunt tenetur eveniet soluta fuga, reprehenderit beatae repellendus. 
  </Card.Body>
</Card>`

  return <UsageBox code={code} scope={scope} />
}

export const Toggled = () => {
  const scope = { Card, Light }
  const code = `<Card toggled>
  <Card.Header> 
    <Light on className='mr-3' /> Header 
  </Card.Header>
  <Card.Body> 
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum natus dolorem sit quas placeat cupiditate hic voluptatem blanditiis minima magnam asperiores laudantium deserunt tenetur eveniet soluta fuga, reprehenderit beatae repellendus. 
  </Card.Body>
</Card>`

  return <UsageBox code={code} scope={scope} />
}

export const ActualScenario = () => {
  const scope = { CardActualScenario }
  const code = `<CardActualScenario />`
  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/CardActualScenario.tsx"
    />
  )
}
