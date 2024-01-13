import { Envelope, EnvelopeData, Knob, EnvelopeLimits } from '@echo-ui'
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

  const limits: EnvelopeLimits = {
    delay: 0.5,
    attack: 0.5,
    hold: 1,
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

  return (
    <section className="flex flex-col items-center w-96">
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
        <Knob topLabel={delay} bottomLabel="Delay" value={delay} onChange={setDelay} />
        <Knob topLabel={attack} bottomLabel="Attack" value={attack} onChange={setAttack} />
        <Knob topLabel={hold} bottomLabel="Hold" value={hold} onChange={setHold} />
        <Knob topLabel={decay} bottomLabel="Decay" value={decay} onChange={setDecay} />
        <Knob topLabel={sustain} bottomLabel="Sustain" value={sustain} onChange={setSustain} />
        <Knob topLabel={release} bottomLabel="Release" value={release} onChange={setRelease} />
      </Knob.Group>
    </section>
  )
}
