import React from 'react'
import { UsageBox } from '.'
import { Spectrum } from 'echo-ui'
import { SpectrumDefault } from '../Example/SpectrumDefault'

export const Default = () => {
  const scope = { SpectrumDefault }
  const code = `<SpectrumDefault />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SpectrumDefault.tsx"
      classNames={{ preview: 'p-0 px-3 py-5' }}
    />
  )
}

export const Axis = () => {
  const scope = { Spectrum }
  const code = `<Spectrum 
  axis 
  amplitudeRange={[-120, 20]} 
  xAxisTicks={[50, 500, 5000]} 
  yAxisTicks={[10, -60, -80]} 
/>`

  return <UsageBox code={code} scope={scope} />
}

export const Grid = () => {
  const scope = { Spectrum }
  const code = `<Spectrum 
  grid
  amplitudeRange={[-120, 20]} 
  xAxisTicks={[50, 500, 5000]} 
  yAxisTicks={[10, -60, -80]} 
/>`

  return <UsageBox code={code} scope={scope} />
}
