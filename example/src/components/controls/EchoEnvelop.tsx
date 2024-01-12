import { Envelope, EnvelopeData, Knob } from '@echo-ui'
import { useEffect, useState } from 'react'

export const EchoEnvelop = () => {
  const envelopeData: EnvelopeData = {
    delay: 0.1,
    attack: 0.2,
    hold: 0.2,
    decay: 0.2,
    sustain: 0.8,
    release: 0.2,
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

  return (
    <section className="flex flex-col items-center">
      <Envelope data={data} onDataChange={handleDataChange} className="h-48" />

      <Knob.Group
        trackWidth={2}
        size={32}
        pointerHeight={5}
        pointerWidth={3}
        rotationRange={360}
        className="gap-8 mt-5"
        step={0.01}
        sensitivity={5}
      >
        <Knob bottomLabel="Delay" max={1} min={0} value={delay} onChange={setDelay} />
        <Knob bottomLabel="Attack" max={1} min={0} value={attack} onChange={setAttack} />
        <Knob bottomLabel="Hold" value={hold} max={1} min={0} onChange={setHold} />
        <Knob bottomLabel="Decay" value={decay} max={0.5} min={0} onChange={setDecay} />
        <Knob bottomLabel="Sustain" value={sustain} max={1} min={0} onChange={setSustain} />
        <Knob bottomLabel="Release" value={release} max={1} min={0} onChange={setRelease} />
      </Knob.Group>
    </section>
  )
}
