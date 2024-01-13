import React from 'react'
import { EnvelopDefault } from '../Example/EnvelopDefault'
import { EnvelopAHDSR } from '../Example/EnvelopAHDSR'
import { EnvelopDADSR } from '../Example/EnvelopDADSR'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { EnvelopDefault }
  const code = `<EnvelopDefault />`

  return <UsageBox code={code} scope={scope} />
}

export const AHDSR = () => {
  const scope = { EnvelopAHDSR }
  const code = `<EnvelopAHDSR />`

  return <UsageBox code={code} scope={scope} />
}

export const DADSR = () => {
  const scope = { EnvelopDADSR }
  const code = `<EnvelopDADSR />`

  return <UsageBox code={code} scope={scope} />
}
