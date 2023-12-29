import React from 'react'
import { Knob } from 'echo-ui'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { Knob }
  const code = `<Knob />`

  return <UsageBox code={code} scope={scope} />
}
