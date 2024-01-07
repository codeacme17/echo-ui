import React from 'react'
import { UsageBox } from '.'
import { Spectrum } from 'echo-ui'
import { SpectrumDefault } from '../Example/SpectrumDefault'

export const Default = () => {
  const scope = { SpectrumDefault }
  const code = `<SpectrumDefault />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SpectrumDefault.tsx"
      classNames={{ preview: 'p-0 px-3 py-5' }}
    />
  )
}
