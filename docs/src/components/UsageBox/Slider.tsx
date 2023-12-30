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

export const Uncontrolled = () => {
  const scope = { UncontrolledSlider }
  const code = `<UncontrolledSlider />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/bc2bccb9312a030ff1ffc8517349bf543e6fa3da/example/src/components/controls/UncontrolledSlider.tsx#L6"
      classNames={{ preview: 'p-0 px-5 py-10' }}
    />
  )
}
