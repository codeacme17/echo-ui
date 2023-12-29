import React from 'react'
import { Input } from 'echo-ui'
import { UsageBox } from '.'

export const DefaultInput = () => {
  const scope = { Input }
  const code = `<Input />`

  return <UsageBox code={code} scope={scope} />
}

export const DisabledInput = () => {
  const scope = { Input }
  const code = `<Input disabled value={30}/>`

  return <UsageBox code={code} scope={scope} />
}

export const MinMaxInput = () => {
  const scope = { Input }
  const code = `<Input min={-10} max={10} />`

  return <UsageBox code={code} scope={scope} />
}

export const TextInput = () => {
  const scope = { Input }
  const code = `<Input type='text' value={'echo-ui'} />`

  return <UsageBox code={code} scope={scope} />
}

export const StepInput = () => {
  const scope = { Input }
  const code = `<Input step={10} sensitivity={1} />`

  return <UsageBox code={code} scope={scope} />
}

export const ProgresColorInput = () => {
  const scope = { Input }
  const code = `<Input value={30} progressColor='#8b5cf6' />`

  return <UsageBox code={code} scope={scope} />
}
