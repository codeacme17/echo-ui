'use client'

import { Button, Checkbox, Knob, Radio } from '@nafr/echo-ui'
import type { CSSProperties, FC } from 'react'
import { useState } from 'react'

const variantRowStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  justifyContent: 'center',
  width: '100%',
}

const rotationRanges = [360, 270, 180] as const
type RotationRange = (typeof rotationRanges)[number]

export const buttonGroupSource = `<ButtonGroupExample />

function ButtonGroupExample() {
  const [waveform, setWaveform] = useState('sine')
  return (
    <Button.Group
      aria-label="Waveform"
      role="group"
      value={waveform}
      onChange={(nextValue) => setWaveform(String(nextValue))}
    >
      <Button value="sine">Sine</Button>
      <Button value="square">Square</Button>
    </Button.Group>
  )
}`

export const checkboxGroupSource = `<CheckboxGroupExample />

function CheckboxGroupExample() {
  const [effects, setEffects] = useState<unknown[]>(['delay'])
  return (
    <Checkbox.Group
      aria-label="Effects"
      role="group"
      value={effects}
      onChange={(event) => setEffects(event.value as unknown[])}
    >
      <Checkbox value="delay">Delay</Checkbox>
      <Checkbox value="reverb">Reverb</Checkbox>
    </Checkbox.Group>
  )
}`

export const radioGroupSource = `<RadioGroupExample />

function RadioGroupExample() {
  const [quality, setQuality] = useState('balanced')
  return (
    <Radio.Group
      aria-label="Quality"
      role="radiogroup"
      value={quality}
      onChange={(event) => setQuality(String(event.value))}
    >
      <Radio value="draft">Draft</Radio>
      <Radio value="balanced">Balanced</Radio>
    </Radio.Group>
  )
}`

export const knobRotationRangeSource = `<KnobRotationRangeExample />

const rotationRanges = [360, 270, 180] as const
type RotationRange = (typeof rotationRanges)[number]

function KnobRotationRangeExample() {
  const [values, setValues] = useState<Record<RotationRange, number>>({
    180: 30,
    270: 30,
    360: 30,
  })

  const updateValue = (rotationRange: RotationRange, value: number) => {
    setValues((current) => ({ ...current, [rotationRange]: value }))
  }

  return rotationRanges.map((rotationRange) => (
    <label key={rotationRange}>
      <Knob
        bottomLabel={values[rotationRange]}
        rotationRange={rotationRange}
        topLabel={rotationRange + '°'}
        value={values[rotationRange]}
        onChange={(value) => updateValue(rotationRange, value)}
      />
      <input
        aria-label={rotationRange + '° rotation range'}
        max={100}
        min={0}
        type="range"
        value={values[rotationRange]}
        onChange={(event) => updateValue(rotationRange, Number(event.target.value))}
      />
    </label>
  ))
}`

export const KnobRotationRangePreview: FC = () => {
  const [values, setValues] = useState<Record<RotationRange, number>>({
    180: 30,
    270: 30,
    360: 30,
  })

  const updateValue = (rotationRange: RotationRange, value: number) => {
    setValues((current) => ({ ...current, [rotationRange]: value }))
  }

  return (
    <div style={variantRowStyle}>
      {rotationRanges.map((rotationRange) => (
        <label
          key={rotationRange}
          style={{ alignItems: 'center', display: 'grid', gap: 8, justifyItems: 'center' }}
        >
          <Knob
            bottomLabel={`${values[rotationRange]}`}
            rotationRange={rotationRange}
            topLabel={`${rotationRange}°`}
            value={values[rotationRange]}
            onChange={(value) => updateValue(rotationRange, value)}
          />
          <input
            aria-label={`${rotationRange}° rotation range`}
            max={100}
            min={0}
            type="range"
            value={values[rotationRange]}
            onChange={(event) => updateValue(rotationRange, Number(event.target.value))}
          />
        </label>
      ))}
    </div>
  )
}

export const ButtonGroupPreview: FC = () => {
  const [waveform, setWaveform] = useState('sine')

  return (
    <Button.Group
      aria-label="Waveform"
      role="group"
      value={waveform}
      onChange={(nextValue) => setWaveform(String(nextValue))}
    >
      <Button value="sine">Sine</Button>
      <Button value="square">Square</Button>
    </Button.Group>
  )
}

export const CheckboxGroupPreview: FC = () => {
  const [effects, setEffects] = useState<unknown[]>(['delay'])

  return (
    <Checkbox.Group
      aria-label="Effects"
      role="group"
      value={effects}
      onChange={(event) => setEffects(event.value as unknown[])}
    >
      <Checkbox value="delay">Delay</Checkbox>
      <Checkbox value="reverb">Reverb</Checkbox>
    </Checkbox.Group>
  )
}

export const RadioGroupPreview: FC = () => {
  const [quality, setQuality] = useState('balanced')

  return (
    <Radio.Group
      aria-label="Quality"
      role="radiogroup"
      value={quality}
      onChange={(event) => setQuality(String(event.value))}
    >
      <Radio value="draft">Draft</Radio>
      <Radio value="balanced">Balanced</Radio>
    </Radio.Group>
  )
}
