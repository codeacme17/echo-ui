import React from 'react'
import { LFO, Knob } from '@echo-ui'

export const EchoLFO = () => {
  const [speed, setSpeed] = React.useState(0.1)
  const [frequency, setFrequency] = React.useState(0.1)

  return (
    <section className="h-32 w-2/3 mb-20">
      <LFO speed={speed} frequency={frequency} />

      <Knob.Group size={50} trackWidth={3}>
        <Knob
          value={frequency}
          onChange={setFrequency}
          min={0}
          max={1}
          step={0.1}
          topLabel="Frequency"
          bottomLabel={frequency * 100 + '%'}
        />

        <Knob
          value={speed}
          onChange={setSpeed}
          min={0.1}
          max={1}
          step={0.1}
          topLabel="Speed"
          bottomLabel={speed * 100 + '%'}
        />
      </Knob.Group>
    </section>
  )
}
