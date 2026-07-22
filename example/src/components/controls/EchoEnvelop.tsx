import * as Tone from 'tone'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Envelope, EnvelopeData, Knob, Button } from '@nafr/echo-ui'
import { Play, Hand } from 'lucide-react'

type EnvelopeVoice = {
  envelope: Tone.AmplitudeEnvelope
  oscillator: Tone.Oscillator
}

const disposeVoice = (voice: EnvelopeVoice | null) => {
  if (!voice) return
  try {
    voice.oscillator.stop()
  } catch {
    // The oscillator may already have stopped at the scheduled release.
  }
  voice.oscillator.dispose()
  voice.envelope.dispose()
}

export const EchoEnvelopADSR = () => {
  const envelopeData: EnvelopeData = { attack: 0.6, decay: 0.2, sustain: 0.8, release: 0.2 }
  const [data, setData] = useState({ ...envelopeData })
  const [attack, setAttack] = useState(envelopeData.attack)
  const [decay, setDecay] = useState(envelopeData.decay)
  const [sustain, setSustain] = useState(envelopeData.sustain)
  const [release, setRelease] = useState(envelopeData.release)
  const [isPlaying, setIsPlaying] = useState(false)
  const voice = useRef<EnvelopeVoice | null>(null)
  const releaseTimer = useRef(0)
  const voiceVersion = useRef(0)

  useEffect(() => setData({ attack, decay, sustain, release }), [attack, decay, sustain, release])

  const releaseCurrentVoice = useCallback(() => {
    voiceVersion.current += 1
    if (releaseTimer.current) window.clearTimeout(releaseTimer.current)
    releaseTimer.current = 0
    const currentVoice = voice.current
    voice.current = null
    disposeVoice(currentVoice)
  }, [])

  useEffect(() => releaseCurrentVoice, [releaseCurrentVoice])

  const handleMouseDown = async () => {
    releaseCurrentVoice()
    const version = voiceVersion.current
    try {
      await Tone.start()
      if (version !== voiceVersion.current) return
      const nextEnvelope = new Tone.AmplitudeEnvelope({
        attack,
        decay,
        sustain,
        release,
      }).toDestination()
      const nextOscillator = new Tone.Oscillator().connect(nextEnvelope)
      voice.current = { envelope: nextEnvelope, oscillator: nextOscillator }
      nextOscillator.start()
      nextEnvelope.triggerAttack()
      setIsPlaying(true)
    } catch {
      releaseCurrentVoice()
      setIsPlaying(false)
    }
  }

  const handleMouseUp = () => {
    const currentVoice = voice.current
    if (!currentVoice) return
    currentVoice.envelope.triggerRelease()
    releaseTimer.current = window.setTimeout(
      () => {
        if (voice.current === currentVoice) voice.current = null
        disposeVoice(currentVoice)
        releaseTimer.current = 0
      },
      release * 1000 + 20,
    )
    setIsPlaying(false)
  }

  return (
    <section
      className="flex flex-col items-center w-2/3"
      data-audio-example="envelope-adsr"
      data-audio-state={isPlaying ? 'playing' : 'stopped'}
    >
      <Button
        aria-label="Hold ADSR envelope"
        className="mb-5 cursor-grab"
        toggled={isPlaying}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        <Hand className="w-4 h-4" />
      </Button>

      <Envelope
        data={data}
        onChange={({ attack, decay, sustain, release }) => {
          setAttack(attack)
          setDecay(decay)
          setSustain(sustain)
          setRelease(release)
        }}
      />

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
  const [scheduled, setScheduled] = useState(false)
  const voice = useRef<EnvelopeVoice | null>(null)
  const disposeTimer = useRef(0)
  const voiceVersion = useRef(0)

  useEffect(
    () => setData({ delay, attack, decay, hold, sustain, release }),
    [delay, attack, hold, decay, sustain, release],
  )

  const releaseCurrentVoice = useCallback(() => {
    voiceVersion.current += 1
    if (disposeTimer.current) window.clearTimeout(disposeTimer.current)
    disposeTimer.current = 0
    const currentVoice = voice.current
    voice.current = null
    disposeVoice(currentVoice)
  }, [])

  useEffect(() => releaseCurrentVoice, [releaseCurrentVoice])

  const handleTrigger = async () => {
    releaseCurrentVoice()
    const version = voiceVersion.current
    try {
      await Tone.start()
      if (version !== voiceVersion.current) return
      const nextEnvelope = new Tone.AmplitudeEnvelope({
        attack,
        decay,
        sustain,
        release,
      }).toDestination()
      const nextOscillator = new Tone.Oscillator().connect(nextEnvelope)
      const now = nextEnvelope.immediate()
      const attackAt = now + (delay ?? 0)
      const releaseAt = attackAt + attack + (hold ?? 0) + decay
      const nextVoice = { envelope: nextEnvelope, oscillator: nextOscillator }
      voice.current = nextVoice
      nextOscillator.start(now)
      nextEnvelope.triggerAttack(attackAt)
      nextEnvelope.triggerRelease(releaseAt)
      setScheduled(true)
      disposeTimer.current = window.setTimeout(
        () => {
          if (voice.current === nextVoice) voice.current = null
          disposeVoice(nextVoice)
          disposeTimer.current = 0
          setScheduled(false)
        },
        (releaseAt + release - now) * 1000 + 20,
      )
    } catch {
      releaseCurrentVoice()
      setScheduled(false)
    }
  }

  return (
    <section
      className="flex flex-col items-center w-2/3"
      data-audio-example="envelope-ahdsr"
      data-audio-state={scheduled ? 'scheduled' : 'stopped'}
    >
      <Button aria-label="Trigger AHDSR envelope" className="mb-5" onMouseDown={handleTrigger}>
        <Play className="w-4 h-4 fill-current" />
      </Button>

      <Envelope
        data={data}
        onChange={({ delay, attack, hold, decay, sustain, release }) => {
          setDelay(delay)
          setAttack(attack)
          setHold(hold)
          setDecay(decay)
          setSustain(sustain)
          setRelease(release)
        }}
      />

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
