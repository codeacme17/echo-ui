import React from 'react'
import { Radio } from 'echo-ui'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { Radio }
  const code = `<Radio size="sm" classNames={{
  }}> Radio </Radio>`

  return <UsageBox code={code} scope={scope} />
}
