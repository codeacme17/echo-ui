import React from 'react'
import { UsageBox } from '.'
import { LFODefault } from '../Example/LFODefault'
import { LFODelay } from '../Example/LFODelay'

export const Default = () => {
  const scope = { LFODefault }
  const code = `<LFODefault />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/LFODefault.tsx"
    />
  )
}

export const Delay = () => {
  const scope = { LFODelay }
  const code = `<LFODelay />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/LFODelay.tsx"
    />
  )
}
