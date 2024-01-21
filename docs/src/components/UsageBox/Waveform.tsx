import React from 'react'
import { WaveformDefault } from '../Example/WaveformDefault'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { WaveformDefault }
  const code = `<WaveformDefault />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/WaveformDefault.tsx"
      className="p-0 px-3 py-5"
      classNames={{
        preview: 'overflow-hidden',
      }}
    />
  )
}
