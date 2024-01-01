import React from 'react'
import { Radio } from 'echo-ui'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { Radio }
  const code = `<Radio> Radio </Radio>`

  return <UsageBox code={code} scope={scope} />
}

export const Disabled = () => {
  const scope = { Radio }
  const code = `<Radio checked disabled> Radio </Radio>`

  return <UsageBox code={code} scope={scope} />
}

export const Size = () => {
  const scope = { Radio }
  const code = `<div className="flex gap-6 items-center">
  <Radio size="sm"> sm </Radio>
  <Radio size="md"> md </Radio>
  <Radio size="lg"> lg </Radio>
</div>`
  return <UsageBox code={code} scope={scope} />
}

export const Color = () => {
  const scope = { Radio }
  const code = `<Radio color='#6366f1'> Radio </Radio>`

  return <UsageBox code={code} scope={scope} />
}

export const Group = () => {
  const scope = { Radio }
  const code = `<Radio.Group value="2">
  <Radio value="1"> Radio 1 </Radio>
  <Radio value="2"> Radio 2 </Radio>
  <Radio value="3"> Radio 3 </Radio>
</Radio.Group>`
  return <UsageBox code={code} scope={scope} />
}
