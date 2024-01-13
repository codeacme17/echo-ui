import * as Tone from 'tone'
import { useEffect, useState } from 'react'
import { Envelope, EnvelopeData, Knob, EnvelopeLimits, Button } from '@echo-ui'
import { Play } from 'lucide-react'

export const EchoEnvelop = () => {
  const envelopeData: EnvelopeData = {
    delay: 0.1,
    attack: 0.2,
    hold: 0.2,
    decay: 0.2,
    sustain: 0.8,
    release: 0.2,
  }

  const limits: EnvelopeLimits = {
    delay: 0.5,
    attack: 0.5,
    hold: 0.5,
    decay: 0.5,
    release: 0.5,
  }

  const [data, setData] = useState({ ...envelopeData })
  const [delay, setDelay] = useState(envelopeData.delay)
  const [attack, setAttack] = useState(envelopeData.attack)
  const [hold, setHold] = useState(envelopeData.hold)
  const [decay, setDecay] = useState(envelopeData.decay)
  const [sustain, setSustain] = useState(envelopeData.sustain)
  const [release, setRelease] = useState(envelopeData.release)

  useEffect(() => {
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
    new Tone.Oscillator().connect(env).start()
    env.triggerAttack(`+${delay || 0}`)
    env.triggerRelease(`+${(delay || 0) + attack + (hold || 0) + decay}`)
  }

  return (
    <section className="flex flex-col items-center w-96">
      <Button className="mb-5" onClick={handlePlay}>
        <Play className="w-4 h-4 fill-current" />
      </Button>

      <Envelope data={data} onDataChange={handleDataChange} limits={limits} />

      <Knob.Group
        className="gap-8 mt-5 w-full"
        trackWidth={2}
        size={32}
        max={0.5}
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
