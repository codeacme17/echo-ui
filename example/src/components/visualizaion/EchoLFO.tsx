import React from 'react'
import * as Tone from 'tone'
import { LFO, Knob, Button, LFOProps, SineIcon, SquareIcon, TriangleIcon } from '@nafr/echo-ui'
import { Play, StopCircle } from 'lucide-react'

export const EchoLFO = () => {
  const [type, setType] = React.useState<LFOProps['type']>('sine')
  const [frequency, setFrequency] = React.useState(1)
  const [amplitude, setAmplitude] = React.useState(0)
  const [delay, setDelay] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const autoFilter = React.useRef<Tone.AutoFilter | null>(null)
  const osc = React.useRef<Tone.Oscillator | null>(null)

  const disposeVoice = React.useCallback(() => {
    const currentOscillator = osc.current
    const currentFilter = autoFilter.current
    osc.current = null
    autoFilter.current = null
    try {
      currentOscillator?.stop()
      currentFilter?.stop()
    } catch {
      // Tone sources may already be stopped during unmount.
    }
    currentOscillator?.dispose()
    currentFilter?.dispose()
  }, [])

  React.useEffect(() => disposeVoice, [disposeVoice])

  React.useEffect(() => {
    autoFilter.current?.set({ frequency })
    osc.current?.set({ type, frequency: 440, volume: amplitude })
  }, [type, frequency, amplitude])

  const triggerPlay = async () => {
    if (isPlaying) {
      disposeVoice()
      setIsPlaying(false)
      return
    }

    try {
      await Tone.start()
      disposeVoice()
      const nextFilter = new Tone.AutoFilter({ depth: 1, frequency }).toDestination().start()
      const nextOscillator = new Tone.Oscillator({
        frequency: 'C4',
        type,
        volume: amplitude,
      }).connect(nextFilter)
      nextOscillator.start(`+${delay / 1000}`)
      autoFilter.current = nextFilter
      osc.current = nextOscillator
      setIsPlaying(true)
    } catch {
      disposeVoice()
      setIsPlaying(false)
    }
  }

  return (
    <section
      className="h-32 w-2/3 mb-32"
      data-audio-example="lfo"
      data-audio-state={isPlaying ? 'playing' : 'stopped'}
      data-tone-version={Tone.version}
    >
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

      <Button aria-label={isPlaying ? 'Stop LFO' : 'Start LFO'} onClick={triggerPlay}>
        {isPlaying ? <StopCircle size={24} /> : <Play size={24} />}
      </Button>

      <LFO amplitude={amplitude} frequency={frequency} delay={delay} type={type} />

      <Knob.Group className="mt-2" size={40} trackWidth={3} pointerHeight={6}>
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

        <Knob
          value={delay}
          min={0}
          max={1000}
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
