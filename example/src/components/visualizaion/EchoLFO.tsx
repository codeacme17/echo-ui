import React from 'react'
import { LFO, Knob } from '@echo-ui'

export const EchoLFO = () => {
  const [frequency, setFrequency] = React.useState(0)
  const [speed, setSpeed] = React.useState(0)
  const [delay, setDelay] = React.useState(0)

  return (
    <section className="h-32 w-2/3 mb-20">
      <LFO speed={speed} frequency={frequency} delay={delay} />

      <Knob.Group size={50} trackWidth={3} min={0} max={1} step={0.1}>
        <Knob
          value={frequency}
          onChange={setFrequency}
          topLabel="Frequency"
          bottomLabel={frequency * 100 + '%'}
        />

        <Knob
          className="mr-3"
          value={speed}
          onChange={setSpeed}
          topLabel="Speed"
          bottomLabel={speed * 100 + '%'}
        />

        <Knob
          value={delay}
          min={0}
          max={100}
          step={1}
          sensitivity={8}
          onChange={setDelay}
          topLabel="Delay"
          bottomLabel={delay}
        />
      </Knob.Group>
    </section>
  )
}
