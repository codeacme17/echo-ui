import React from 'react'
import { Slider } from 'echo-ui'
import { UsageBox } from '.'
import { UncontrolledSlider } from '../Example/UncontrolledSlider'

export const Default = () => {
  const scope = { Slider }
  const code = `<Slider />`

  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-5 py-10' }} />
}

export const Disabled = () => {
  const scope = { Slider }
  const code = `<Slider disabled value={30}/>`

  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-5 py-10' }} />
}

export const Vertical = () => {
  const scope = { Slider }
  const code = `<Slider vertical className='h-80'/>`

  return (
    <UsageBox
      code={code}
      scope={scope}
      classNames={{ preview: 'flex justify-center p-0 py-5 pl-10' }}
    />
  )
}

export const Bilateral = () => {
  const scope = { Slider }
  const code = `<Slider bilateral value={50}/>`

  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-5 py-10' }} />
}

export const Axis = () => {
  const scope = { Slider }
  const code = `<Slider axis/>`

  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-7 pt-10 pb-12' }} />
}

export const Step = () => {
  const scope = { Slider }
  const code = `<Slider step={10}/>`
  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-5 py-10' }} />
}

export const CustomColors = () => {
  const scope = { Slider }
  const code = `<Slider
  className="bg-[#94a3b8] h-1"
  classNames={{
    progress: 'bg-red-500 rounded-sm',
    thumb: 'bg-[#475569] w-4 h-4 rounded-full',
    thumbLabel: 'bg-slate-600',
  }}
/>`
  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-5 py-10' }} />
}

export const Uncontrolled = () => {
  const scope = { UncontrolledSlider }
  const code = `<UncontrolledSlider />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/UncontrolledSlider.tsx"
      classNames={{ preview: 'p-0 px-5 py-10' }}
    />
  )
}
