import * as Tone from 'tone'
import * as React from 'react'
import { Envelope, EnvelopeData, Knob, Button } from 'echo-ui'
import { Activity } from 'lucide-react'

export const EnvelopDefault = () => {
  const envelopeData: EnvelopeData = {
    delay: 0.3,
    attack: 0.6,
    hold: 0.6,
    decay: 0.2,
    sustain: 0,
    release: 0.7,
  }

  const [data, setData] = React.useState({ ...envelopeData })
  const [delay, setDelay] = React.useState(envelopeData.delay)
  const [attack, setAttack] = React.useState(envelopeData.attack)
  const [hold, setHold] = React.useState(envelopeData.hold)
  const [decay, setDecay] = React.useState(envelopeData.decay)
  const [sustain, setSustain] = React.useState(envelopeData.sustain)
  const [release, setRelease] = React.useState(envelopeData.release)

  React.useEffect(() => {
    setData({ delay, attack, decay, hold, sustain, release })
  }, [delay, attack, hold, decay, sustain, release])

  const handleDataChange = (data: EnvelopeData) => {
    setDelay(data.delay)
    setAttack(data.attack)
    setDecay(data.decay)
    setHold(data.hold)
    setSustain(data.sustain)
    setRelease(data.release)
  }

  const handlePlay = () => {
    const env = new Tone.AmplitudeEnvelope({
      attack,
      decay,
      sustain,
      release,
    }).toDestination()
    env.triggerAttack(`+${delay || 0}`)
    env.triggerRelease(`+${(delay || 0) + attack + (hold || 0) + decay}`)
    new Tone.Oscillator().connect(env).start()
  }

  return (
    <section className="flex flex-col items-center w-full">
      <Button className="mb-5" onClick={handlePlay}>
        <Activity className="w-5 h-5" />
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
        <Knob bottomLabel="Delay" value={delay} onChange={setDelay} />
        <Knob bottomLabel="Attack" value={attack} onChange={setAttack} />
        <Knob bottomLabel="Hold" value={hold} onChange={setHold} />
        <Knob bottomLabel="Decay" value={decay} onChange={setDecay} />
        <Knob bottomLabel="Sustain" value={sustain} onChange={setSustain} />
        <Knob bottomLabel="Release" value={release} onChange={setRelease} />
      </Knob.Group>
    </section>
  )
}
