import React from 'react'
import { Slider } from 'echo-ui'
import { UsageBox } from '.'
import { SliderUncontrolled } from '../Example/SliderUncontrolled'

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
  className="bg-slate-300 h-1 w-80"
  classNames={{
    progress: 'bg-indigo-500 rounded-sm',
    thumb: 'bg-slate-500 w-4 h-4 rounded-full',
    thumbLabel: 'bg-slate-600',
  }}
/>`
  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-5 py-10' }} />
}

export const Uncontrolled = () => {
  const scope = { SliderUncontrolled }
  const code = `<SliderUncontrolled />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SliderUncontrolled.tsx"
      classNames={{ preview: 'p-0 px-5 py-10' }}
    />
  )
}
