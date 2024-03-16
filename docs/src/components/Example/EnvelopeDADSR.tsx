import * as Tone from 'tone'
import * as React from 'react'
import { Envelope, EnvelopeData, Knob, Button } from 'echo-ui'
import { Activity } from 'lucide-react'

export const EnvelopeDADSR = () => {
  const envelopeData: EnvelopeData = {
    delay: 0.5,
    attack: 0.6,
    decay: 0.6,
    sustain: 0.4,
    release: 0.8,
  }

  const [data, setData] = React.useState({ ...envelopeData })
  const [delay, setDelay] = React.useState(envelopeData.delay)
  const [attack, setAttack] = React.useState(envelopeData.attack)
  const [decay, setDecay] = React.useState(envelopeData.decay)
  const [sustain, setSustain] = React.useState(envelopeData.sustain)
  const [release, setRelease] = React.useState(envelopeData.release)

  React.useEffect(() => {
    setData({ delay, attack, decay, sustain, release })
  }, [delay, attack, decay, sustain, release])

  const handleChange = (data: EnvelopeData) => {
    setDelay(data.delay)
    setAttack(data.attack)
    setDecay(data.decay)
    setSustain(data.sustain)
    setRelease(data.release)
  }

  const envelope = React.useRef<Tone.AmplitudeEnvelope>()
  const oscillator = React.useRef<Tone.Oscillator>()

  const handleMouseDown = () => {
    envelope.current = new Tone.AmplitudeEnvelope({
      attack,
      decay,
      sustain,
      release,
    }).toDestination()
    oscillator.current = new Tone.Oscillator().connect(envelope.current).start()
    envelope.current.triggerAttack(`+${delay || 0}`)
    envelope.current.triggerRelease(`+${delay! + attack + decay}}`)
  }

  return (
    <section className="flex flex-col items-center">
      <Button className="mb-5" onMouseDown={handleMouseDown}>
        <Activity className="w-4 h-4" />
      </Button>

      <Envelope data={data} onChange={handleChange} />

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
        <Knob bottomLabel="Delay" value={delay} onChange={setDelay} />
        <Knob bottomLabel="Attack" value={attack} onChange={setAttack} />
        <Knob bottomLabel="Decay" value={decay} onChange={setDecay} />
        <Knob bottomLabel="Sustain" value={sustain} onChange={setSustain} />
        <Knob bottomLabel="Release" value={release} onChange={setRelease} />
      </Knob.Group>
    </section>
  )
}
