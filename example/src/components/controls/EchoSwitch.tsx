import { Button, Switch } from '@echo-ui'
import { useState } from 'react'

export const EchoSwitch = () => {
  const [toggled, setToggled] = useState(false)

  return (
    <section className="flex flex-col gap-3">
      <Switch toggled={toggled} onChange={setToggled} size="sm">
        {`${toggled}`}
      </Switch>

      <Button onClick={() => setToggled(!toggled)}>ds</Button>
    </section>
  )
}
