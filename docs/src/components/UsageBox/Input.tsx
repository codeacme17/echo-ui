import React from 'react'
import { Input } from 'echo-ui'
import { UsageBox } from '.'

export const DefaultInput = () => {
  const scope = { Input }
  const code = `<Input />`

  return <UsageBox code={code} scope={scope} />
}

export const DisabledInput = () => {
  const scope = { Input }
  const code = `<Input disabled value={30}/>`

  return <UsageBox code={code} scope={scope} />
}

export const SizeInput = () => {
  const scope = { Input }
  const code = `<div className="flex gap-4 items-center flex-wrap">
  <Input size="sm" />
  <Input size="md" />
  <Input size="lg" />
</div>`

  return <UsageBox code={code} scope={scope} />
}

export const RadiusInput = () => {
  const scope = { Input }
  const code = `<div className="flex gap-4 flex-wrap">
  <Input radius="none" />
  <Input radius="sm" />
  <Input radius="md" />
  <Input radius="lg" />
  <Input radius="full" />
</div>`

  return <UsageBox code={code} scope={scope} />
}

export const MinMaxInput = () => {
  const scope = { Input }
  const code = `<Input min={-50} max={50} />`

  return <UsageBox code={code} scope={scope} />
}

export const Bilateral = () => {
  const scope = { Input }
  const code = `<Input bilateral value={50} />`

  return <UsageBox code={code} scope={scope} />
}

export const TextInput = () => {
  const scope = { Input }
  const code = `<Input type='text' value={'echo-ui'} />`

  return <UsageBox code={code} scope={scope} />
}

export const StepInput = () => {
  const scope = { Input }
  const code = `<Input step={10} sensitivity={1} />`

  return <UsageBox code={code} scope={scope} />
}

export const ProgresColorInput = () => {
  const scope = { Input }
  const code = `<Input value={30} progressColor='#8b5cf6' className='focus:border-[#8b5cf6]' />`

  return <UsageBox code={code} scope={scope} />
}
