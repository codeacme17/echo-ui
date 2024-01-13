import React from 'react'
import { EnvelopeDefault } from '../Example/EnvelopeDefault'
import { EnvelopeAHDSR } from '../Example/EnvelopeAHDSR'
import { EnvelopeDADSR } from '../Example/EnvelopeDADSR'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { EnvelopeDefault }
  const code = `<EnvelopeDefault />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/EnvelopeDefault.tsx"
    />
  )
}

export const AHDSR = () => {
  const scope = { EnvelopeAHDSR }
  const code = `<EnvelopeAHDSR />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/EnvelopeAHDSR.tsx"
    />
  )
}

export const DADSR = () => {
  const scope = { EnvelopeDADSR }
  const code = `<EnvelopeDADSR />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/EnvelopeDADSR.tsx"
    />
  )
}
