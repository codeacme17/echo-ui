import React from 'react'
import { Light } from 'echo-ui'
import { UsageBox } from '.'

export const DefaultLight = () => {
  const scope = { Light }
  const code = `<Light />`

  return <UsageBox code={code} scope={scope} />
}

export const OnLight = () => {
  const scope = { Light }
  const code = `<Light on />`

  return <UsageBox code={code} scope={scope} />
}

export const ColorLight = () => {
  const scope = { Light }
  const code = `<div className="flex gap-6">
  <Light color='#6366f1'/>
  <Light on color='#6366f1'/>
</div>`

  return <UsageBox code={code} scope={scope} />
}

export const SizeLight = () => {
  const scope = { Light }
  const code = `<Light on size={17} />`

  return <UsageBox code={code} scope={scope} />
}
