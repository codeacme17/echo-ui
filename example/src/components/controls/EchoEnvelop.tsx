import * as Tone from 'tone'
import { useEffect, useRef, useState } from 'react'
import { Envelope, EnvelopeData, Knob, Button } from '@echo-ui'
import { Play, Hand } from 'lucide-react'

export const EchoEnvelopADSR = () => {
  const envelopeData: EnvelopeData = {
    attack: 0.6,
    decay: 0.2,
    sustain: 0.8,
    release: 0.2,
  }

  const [data, setData] = useState({ ...envelopeData })
  const [attack, setAttack] = useState(envelopeData.attack)
  const [decay, setDecay] = useState(envelopeData.decay)
  const [sustain, setSustain] = useState(envelopeData.sustain)
  const [release, setRelease] = useState(envelopeData.release)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setData({ attack, decay, sustain, release })
  }, [attack, decay, sustain, release])

  const handleDataChange = (data: EnvelopeData) => {
    setAttack(data.attack)
    setDecay(data.decay)
    setSustain(data.sustain)
    setRelease(data.release)
  }

  const envelope = useRef<Tone.AmplitudeEnvelope>()
  const oscillator = useRef<Tone.Oscillator>()

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
    <section className="flex flex-col items-center w-2/3">
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

export const EchoEnvelopAHDSR = () => {
  const envelopeData: EnvelopeData = {
    delay: 0.1,
    attack: 0.6,
    hold: 0.5,
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

  const envelope = useRef<Tone.AmplitudeEnvelope>()
  const oscillator = useRef<Tone.Oscillator>()

  const handleMouseDown = () => {
    envelope.current = new Tone.AmplitudeEnvelope({
      attack,
      decay,
      sustain,
      release,
    }).toDestination()
    oscillator.current = new Tone.Oscillator().connect(envelope.current).start()
    envelope.current.triggerAttack(`+${delay || 0}`)
    envelope.current.triggerRelease(`+${delay! + attack + hold! + decay}}`)
  }

  return (
    <section className="flex flex-col items-center w-2/3">
      <Button className="mb-5" onMouseDown={handleMouseDown}>
        <Play className="w-4 h-4 fill-current" />
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
