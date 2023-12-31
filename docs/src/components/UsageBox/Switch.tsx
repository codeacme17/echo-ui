import React from 'react'
import { Switch } from 'echo-ui'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { Switch }
  const code = `<Switch> Switch </Switch>`

  return <UsageBox code={code} scope={scope} />
}

export const Toggled = () => {
  const scope = { Switch }
  const code = `<Switch toggled> Toggled </Switch>`

  return <UsageBox code={code} scope={scope} />
}

export const Disabled = () => {
  const scope = { Switch }
  const code = `<Switch disabled> Disabled </Switch>`

  return <UsageBox code={code} scope={scope} />
}

export const Size = () => {
  const scope = { Switch }
  const code = `<div className="flex gap-6 items-center">
  <Switch size="sm"> sm </Switch>
  <Switch size="md"> md </Switch>
  <Switch size="lg"> lg </Switch>
</div>`
  return <UsageBox code={code} scope={scope} />
}

export const Custom = () => {
  const scope = { Switch }
  const code = `<Switch classNames={{
  button: 'bg-slate-500 shadow-inner',
  thumb: 'bg-indigo-400 shadow-none', 
  label: 'text-slate-500'
}}> 
  Custom 
</Switch>`
  return <UsageBox code={code} scope={scope} />
}
