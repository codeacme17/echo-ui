import React from 'react'
import { UsageBox } from '.'
import { OscilloscopeDefault } from '../Example/OscilloscopeDefault.tsx'

export const Defualt = () => {
  const scope = { OscilloscopeDefault }
  const code = `<OscilloscopeDefault />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/OscilloscopeDefault.tsx"
    />
  )
}
