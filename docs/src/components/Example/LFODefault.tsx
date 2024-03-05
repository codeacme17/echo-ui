import React from 'react'
import * as Tone from 'tone'
import { LFO, Knob, Button, LFOProps, SineIcon, SquareIcon, TriangleIcon } from 'echo-ui'
import { Play, Pause } from 'lucide-react'

export const LFODefault = () => {
  const [type, setType] = React.useState<LFOProps['type']>('sine')
  const [frequency, setFrequency] = React.useState(1)
  const [amplitude, setAmplitude] = React.useState(0.7)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const autoFilter = React.useRef<Tone.AutoFilter | null>(null)
  const osc = React.useRef<Tone.Oscillator | null>(null)

  React.useEffect(() => {
    autoFilter.current = new Tone.AutoFilter({
      frequency: frequency,
      depth: 1,
    })
      .toDestination()
      .start()

    osc.current = new Tone.Oscillator({
      volume: -(1 - amplitude) * 100,
      frequency,
    }).connect(autoFilter.current)
  }, [])

  React.useEffect(() => {
    autoFilter.current?.set({
      frequency: frequency,
    })

    osc.current?.set({
      type,
      frequency: 440,
      volume: -(1 - amplitude) * 60,
    })
  }, [type, frequency, amplitude])

  const triggerPlay = () => {
    if (isPlaying) {
      osc.current?.stop()
      setIsPlaying(false)
    } else {
      osc.current?.start()
      setIsPlaying(true)
    }
  }

  return (
    <section className="h-32 mb-32 mx-auto">
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
        <Button
          onClick={triggerPlay}
          toggled={isPlaying}
          className="data-[toggled='true']:bg-green-500"
        >
          {isPlaying ? (
            <Pause className="fill-current" size={15} />
          ) : (
            <Play className="fill-current" size={15} />
          )}
        </Button>
      </Button.Group>

      <LFO amplitude={amplitude} frequency={frequency} type={type} />

      <Knob.Group className="mt-2 flex justify-center" size={40} trackWidth={3} pointerHeight={6}>
        <Knob
          value={frequency}
          onChange={setFrequency}
          topLabel="Frequency"
          min={1}
          max={15}
          step={1}
          bottomLabel={frequency + 'Hz'}
        />

        <Knob
          className="mr-3"
          value={amplitude}
          min={0}
          max={1}
          step={0.1}
          onChange={setAmplitude}
          topLabel="Amplitude"
          bottomLabel={amplitude * 100 + '%'}
        />
      </Knob.Group>
    </section>
  )
}
