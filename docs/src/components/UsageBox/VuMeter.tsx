import React from 'react'
import { UsageBox } from '.'
import { VuMeter } from 'echo-ui'
import { VuMeterDefault } from '../Example/VuMeterDefault'
import { VuMeterColor } from '../Example/VuMeterColor'

export const Default = () => {
  const scope = { VuMeterDefault }
  const code = `<VuMeterDefault />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/VuMeterDefault.tsx"
      classNames={{ preview: 'p-0 px-3 py-10' }}
    />
  )
}

export const Horizontal = () => {
  const scope = { VuMeter }
  const code = `<VuMeter horizontal/>`

  return (
    <UsageBox
      code={code}
      scope={scope}
      classNames={{
        preview: 'p-0 pl-10 py-10',
      }}
    />
  )
}

export const Lumps = () => {
  const scope = { VuMeter }
  const code = `<div className='flex gap-16'>
  <div> <VuMeter lumpsQuantity={40} /> </div>
  <div> <VuMeter lumpsQuantity={50} /> </div>
</div>`

  return (
    <UsageBox
      code={code}
      scope={scope}
      classNames={{
        preview: 'p-0 pl-10 py-10',
      }}
    />
  )
}

export const Color = () => {
  const scope = { VuMeterColor }
  const code = `<VuMeterColor />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/VuMeterColor.tsx"
      classNames={{ preview: 'p-0 px-3 py-10' }}
    />
  )
}
