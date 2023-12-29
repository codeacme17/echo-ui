import React from 'react'
import { Knob } from 'echo-ui'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { Knob }
  const code = `<Knob />`

  return <UsageBox code={code} scope={scope} />
}

export const Disabled = () => {
  const scope = { Knob }
  const code = `<Knob disabled/>`

  return <UsageBox code={code} scope={scope} />
}
