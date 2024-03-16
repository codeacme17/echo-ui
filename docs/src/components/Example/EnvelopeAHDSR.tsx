import * as Tone from 'tone'
import * as React from 'react'
import { Envelope, EnvelopeData, Knob, Button } from 'echo-ui'
import { Activity } from 'lucide-react'

export const EnvelopeAHDSR = () => {
  const envelopeData: EnvelopeData = {
    attack: 0,
    hold: 1,
    decay: 0,
    sustain: 0,
    release: 0,
  }

  const [data, setData] = React.useState({ ...envelopeData })
  const [attack, setAttack] = React.useState(envelopeData.attack)
  const [hold, setHold] = React.useState(envelopeData.hold)
  const [decay, setDecay] = React.useState(envelopeData.decay)
  const [sustain, setSustain] = React.useState(envelopeData.sustain)
  const [release, setRelease] = React.useState(envelopeData.release)

  React.useEffect(() => {
    setData({ attack, decay, hold, sustain, release })
  }, [attack, hold, decay, sustain, release])

  const handleChange = (data: EnvelopeData) => {
    setAttack(data.attack)
    setDecay(data.decay)
    setHold(data.hold)
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
    envelope.current.triggerAttack()
    envelope.current.triggerRelease(`+${attack + hold! + decay}}`)
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
        <Knob bottomLabel="Attack" value={attack} onChange={setAttack} />
        <Knob bottomLabel="Hold" value={hold} onChange={setHold} />
        <Knob bottomLabel="Decay" value={decay} onChange={setDecay} />
        <Knob bottomLabel="Sustain" value={sustain} onChange={setSustain} />
        <Knob bottomLabel="Release" value={release} onChange={setRelease} />
      </Knob.Group>
    </section>
  )
}
