import { Switch } from 'echo-ui'
import { useState } from 'react'

export const EchoSwitch = () => {
  const [toggled, setToggled] = useState(false)

  return (
    <section>
      <Switch toggled={toggled} onClick={() => setToggled(!toggled)} size="sm">
        label
      </Switch>
    </section>
  )
}
