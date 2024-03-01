import React from 'react'
import { LFO, Knob, Button, LFOProps } from '@echo-ui'

export const EchoLFO = () => {
  const [type, setType] = React.useState<LFOProps['type']>('sine')
  const [frequency, setFrequency] = React.useState(0)
  const [speed, setSpeed] = React.useState(0)
  const [delay, setDelay] = React.useState(0)

  return (
    <section className="h-32 w-2/3 mb-32">
      <Button.Group size="sm" className="mb-2">
        <Button toggled={type === 'sine'} onClick={() => setType('sine')}>
          Sine
        </Button>
        <Button toggled={type === 'square'} onClick={() => setType('square')}>
          Square
        </Button>
        <Button toggled={type === 'triangle'} onClick={() => setType('triangle')}>
          Triangle
        </Button>
      </Button.Group>

      <LFO speed={speed} frequency={frequency} delay={delay} type={type} />

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
