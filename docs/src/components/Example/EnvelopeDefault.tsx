import * as Tone from 'tone'
import * as React from 'react'
import { Envelope, EnvelopeData, Knob, Button } from 'echo-ui'
import { Hand } from 'lucide-react'

export const EnvelopeDefault = () => {
  const envelopeData: EnvelopeData = {
    attack: 0.6,
    decay: 0.2,
    sustain: 0.8,
    release: 0.2,
  }

  const [data, setData] = React.useState({ ...envelopeData })
  const [attack, setAttack] = React.useState(envelopeData.attack)
  const [decay, setDecay] = React.useState(envelopeData.decay)
  const [sustain, setSustain] = React.useState(envelopeData.sustain)
  const [release, setRelease] = React.useState(envelopeData.release)
  const [isPlaying, setIsPlaying] = React.useState(false)

  React.useEffect(() => {
    setData({ attack, decay, sustain, release })
  }, [attack, decay, sustain, release])

  const handleDataChange = (data: EnvelopeData) => {
    setAttack(data.attack)
    setDecay(data.decay)
    setSustain(data.sustain)
    setRelease(data.release)
  }

  const envelope = React.useRef<Tone.AmplitudeEnvelope>()
  const oscillator = React.useRef<Tone.Oscillator>()

  const handleMouseDown = () => {
    setIsPlaying(true)
    envelope.current = new Tone.AmplitudeEnvelope({
      attack,
      decay,
      sustain,
      release,
    }).toDestination()
    oscillator.current = new Tone.Oscillator().connect(envelope.current).start()
    envelope.current.triggerAttack()
  }

  const handleMouseUp = () => {
    setIsPlaying(false)
    if (!envelope.current) return
    envelope.current.triggerRelease()

    setTimeout(() => {
      if (!envelope.current || !oscillator.current) return
      oscillator.current.stop()
      oscillator.current.dispose()
      envelope.current.dispose()
    }, release * 1000)
  }

  return (
    <section className="flex flex-col items-center w-full">
      <Button
        className="mb-5 cursor-grab"
        toggled={isPlaying}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <Hand className="w-4 h-4" />
      </Button>

      <Envelope data={data} onDataChange={handleDataChange} />

      <Knob.Group
        className="gap-8 mt-5 w-full justify-center"
        trackWidth={2}
        size={32}
        max={1}
        min={0}
        pointerHeight={5}
        pointerWidth={3}
        rotationRange={360}
        step={0.01}
        sensitivity={5}
      >
        <Knob bottomLabel="Attack" value={attack} onChange={setAttack} />
        <Knob bottomLabel="Decay" value={decay} onChange={setDecay} />
        <Knob bottomLabel="Sustain" value={sustain} onChange={setSustain} />
        <Knob bottomLabel="Release" value={release} onChange={setRelease} />
      </Knob.Group>
    </section>
  )
}
