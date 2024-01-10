import React from 'react'
import { UsageBox } from '.'
import { Spectrogram } from 'echo-ui'
import { SpectrogramDefault } from '../Example/SpectrogramDefault'
import { SpectrogramEQ3 } from '../Example/SpectrogramEQ3'

export const Default = () => {
  const scope = { SpectrogramDefault }
  const code = `<SpectrogramDefault />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SpectrogramDefault.tsx"
      classNames={{ preview: 'p-0 px-3 py-5' }}
    />
  )
}

export const Axis = () => {
  const scope = { Spectrogram }
  const code = `<Spectrogram 
  axis 
  amplitudeRange={[-120, 20]} 
  xAxisTicks={[50, 500, 5000]} 
  yAxisTicks={[10, -60, -80]} 
/>`

  return <UsageBox code={code} scope={scope} />
}

export const Grid = () => {
  const scope = { Spectrogram }
  const code = `<Spectrogram 
  grid
  amplitudeRange={[-120, 20]} 
  xAxisTicks={[50, 500, 5000]} 
  yAxisTicks={[10, -60, -80]} 
/>`

  return <UsageBox code={code} scope={scope} />
}

export const EQ3 = () => {
  const scope = { SpectrogramEQ3 }
  const code = `<SpectrogramEQ3 />`

  return (
    <UsageBox
      code={code}
      scope={scope}
      type="link"
      url="https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SpectrogramEQ3.tsx"
      classNames={{ preview: 'p-0 px-3 py-5' }}
    />
  )
}
