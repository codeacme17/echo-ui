import React from 'react'
import { Checkbox } from 'echo-ui'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { Checkbox }
  const code = `<Checkbox> Checkbox </Checkbox>`

  return <UsageBox code={code} scope={scope} />
}

export const Disabled = () => {
  const scope = { Checkbox }
  const code = `<Checkbox checked disabled> Checkbox </Checkbox>`

  return <UsageBox code={code} scope={scope} />
}

export const Size = () => {
  const scope = { Checkbox }
  const code = `<div className="flex gap-6 items-center">
  <Checkbox size="sm"> sm </Checkbox>
  <Checkbox size="md"> md </Checkbox>
  <Checkbox size="lg"> lg </Checkbox>
</div>`
  return <UsageBox code={code} scope={scope} />
}

export const Color = () => {
  const scope = { Checkbox }
  const code = `<Checkbox color='#6366f1' classNames={{ label: 'color-slate-500' }}> 
  Checkbox 
</Checkbox>`

  return <UsageBox code={code} scope={scope} />
}

export const Group = () => {
  const scope = { Checkbox }
  const code = `<Checkbox.Group value={[1, 2]}>
  <Checkbox value={1}> Checkbox 1 </Checkbox>
  <Checkbox value={2}> Checkbox 2 </Checkbox>
  <Checkbox value={3}> Checkbox 3 </Checkbox>
</Checkbox.Group>`
  return <UsageBox code={code} scope={scope} />
}
