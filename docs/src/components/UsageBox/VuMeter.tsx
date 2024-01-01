import React from 'react'
import { UsageBox } from '.'
import { VuMeterMono } from '../Example/DefaultVuMeter'

export const Default = () => {
  const scope = { VuMeterMono }
  const code = `<VuMeterMono />`

  return <UsageBox code={code} scope={scope} />
}
