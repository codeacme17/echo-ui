import { Envelope, EnvelopeData, EnvelopeRef, Knob } from '@echo-ui'
import React, { useEffect, useState } from 'react'

export const EchoEnvelop = () => {
  const envelopeData: EnvelopeData = {
    delay: 0.1,
    attack: 0.2,
    decay: 0.2,
    // hold: 0.5,
    sustain: 0.8,
    release: 0.7,
  }

  const [data, setData] = useState({ ...envelopeData })
  const envelopRef = React.useRef<EnvelopeRef>(null)

  const [delay, setDelay] = useState(envelopeData.delay)
  const [attack, setAttack] = useState(envelopeData.attack)
  const [hold, setHold] = useState(envelopeData.hold)
  const [decay, setDecay] = useState(envelopeData.decay)
  const [sustain, setSustain] = useState(envelopeData.sustain)
  const [release, setRelease] = useState(envelopeData.release)

  useEffect(() => {
    setData({ delay, attack, decay, hold, sustain, release })
  }, [attack, decay, sustain, release])

  const handleDataChange = (data: EnvelopeData) => {
    if (!envelopRef.current) return
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
      >
        <Knob bottomLabel="Delay" max={1} min={0} value={delay} step={0.1} onChange={setDelay} />
        <Knob bottomLabel="Attack" max={1} min={0} value={attack} step={0.1} onChange={setAttack} />
        <Knob bottomLabel="Decay" value={decay} max={1} min={0} step={0.1} onChange={setDecay} />
        <Knob bottomLabel="Hold" value={hold} max={1} min={0} step={0.1} onChange={setHold} />
        <Knob
          bottomLabel="Sustain"
          value={sustain}
          max={1}
          min={0}
          step={0.1}
          onChange={setSustain}
        />
        <Knob
          bottomLabel="Release"
          value={release}
          max={1}
          min={0}
          step={0.1}
          onChange={setRelease}
        />
      </Knob.Group>
    </section>
  )
}
