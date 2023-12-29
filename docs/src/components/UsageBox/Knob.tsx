import React from 'react'
import { Knob } from 'echo-ui'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { Knob }
  const code = `<Knob />`

  return <UsageBox code={code} scope={scope} />
}

export const Disabled = () => {
  const scope = { Knob }
  const code = `<Knob disabled/>`

  return <UsageBox code={code} scope={scope} />
}

export const Bilateral = () => {
  const scope = { Knob }
  const code = `<Knob bilateral />`

  return <UsageBox code={code} scope={scope} />
}

export const Range = () => {
  const scope = { Knob }
  const code = `<Knob rotationRange={360} />`

  return <UsageBox code={code} scope={scope} />
}

export const StepSensitivity = () => {
  const scope = { Knob }
  const code = `<Knob step={20} sensitivity={1} min={-100} max={100} />`

  return <UsageBox code={code} scope={scope} />
}

export const Label = () => {
  const scope = { Knob }
  const code = `<Knob topLabel="Volume" bottomLabel={<span className="-mt-2 text-sm">value</span>}/>`

  return <UsageBox code={code} scope={scope} />
}

export const Size = () => {
  const scope = { Knob }
  const code = `<Knob size={100} trackWidth={3} pointerWidth={7} pointerHeight={10}/>`

  return <UsageBox code={code} scope={scope} />
}

export const Color = () => {
  const scope = { Knob }
  const code = `<Knob trackColor="#6b7280" progressColor="#6366f1" buttonColor="#475569" pointerColor="#6366f1" />`

  return <UsageBox code={code} scope={scope} />
}
