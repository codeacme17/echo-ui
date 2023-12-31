import { Button, Switch } from '@echo-ui'
import { useState } from 'react'

export const EchoSwitch = () => {
  const [toggled, setToggled] = useState(false)

  return (
    <section className="flex flex-col gap-3">
      <Switch
        toggled={toggled}
        onChange={setToggled}
        size="sm"
        classNames={{
          button: 'bg-slate-500 shadow-inner group-data-[toggled=true]:bg-indigo-800',
          thumb: 'bg-slate-200 ',
          label: 'text-slate-500',
        }}
      >
        {`${toggled}`}
      </Switch>

      <Button onClick={() => setToggled(!toggled)}>ds</Button>
    </section>
  )
}
