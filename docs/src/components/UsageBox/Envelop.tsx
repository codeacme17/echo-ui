import React from 'react'
import { EnvelopDefault } from '../Example/EnvelopDefault'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { EnvelopDefault }
  const code = `<EnvelopDefault />`

  return <UsageBox code={code} scope={scope} />
}
