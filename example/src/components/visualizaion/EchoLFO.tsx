import React from 'react'
import * as Tone from 'tone'
import { LFO, Knob, Button, LFOProps, SineIcon, SquareIcon, TriangleIcon } from '@echo-ui'

export const EchoLFO = () => {
  const [type, setType] = React.useState<LFOProps['type']>('sine')
  const [frequency, setFrequency] = React.useState(0)
  const [amplitude, setAmplitude] = React.useState(0)
  const [delay, setDelay] = React.useState(0)

  const lfo = React.useRef<Tone.LFO | null>(null)

  React.useEffect(() => {
    lfo.current = new Tone.LFO('4n', 400, 4000)
  }, [])

  return (
    <section className="h-32 w-2/3 mb-32">
      <Button.Group className="mb-2" radius="sm">
        <Button toggled={type === 'sine'} onClick={() => setType('sine')}>
          <SineIcon />
        </Button>
        <Button toggled={type === 'square'} onClick={() => setType('square')}>
          <SquareIcon />
        </Button>
        <Button toggled={type === 'triangle'} onClick={() => setType('triangle')}>
          <TriangleIcon />
        </Button>
      </Button.Group>

      <LFO amplitude={amplitude} frequency={frequency} delay={delay} type={type} />

      <Knob.Group
        className="mt-2"
        size={40}
        trackWidth={3}
        min={0}
        max={1}
        step={0.1}
        pointerHeight={6}
      >
        <Knob
          value={frequency}
          onChange={setFrequency}
          topLabel="Frequency"
          bottomLabel={frequency * 100 + '%'}
        />

        <Knob
          className="mr-3"
          value={amplitude}
          onChange={setAmplitude}
          topLabel="Amplitude"
          bottomLabel={amplitude * 100 + '%'}
        />

        <Knob
          value={delay}
          min={0}
          max={100}
          step={1}
          sensitivity={8}
          onChange={setDelay}
          topLabel="Delay"
          bottomLabel={delay + ' ms'}
        />
      </Knob.Group>
    </section>
  )
}
