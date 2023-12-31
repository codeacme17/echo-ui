import React from 'react'
import { Checkbox } from 'echo-ui'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { Checkbox }
  const code = `<Checkbox> Checkbox </Checkbox>`

  return <UsageBox code={code} scope={scope} />
}
