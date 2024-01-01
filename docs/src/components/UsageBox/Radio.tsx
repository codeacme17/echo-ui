import React from 'react'
import { Radio } from 'echo-ui'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { Radio }
  const code = `<Radio> Radio </Radio>`

  return <UsageBox code={code} scope={scope} />
}
