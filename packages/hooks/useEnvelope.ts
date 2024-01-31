import * as Tone from 'tone'
import { useRef, useState, useEffect } from 'react'
import { LIMITS } from '../components/controller/Envelope/constants'
import type { EnvelopeData, EnvelopeLimits } from '../components/controller/Envelope'

export interface UseEnvelopeProps {
  data: EnvelopeData
  limits?: EnvelopeLimits
}

export const useEnvelope = (props: UseEnvelopeProps) => {
  const { data: _data, limits = LIMITS } = props

  const [data, setData] = useState({ ..._data })
  const envelope = useRef<Tone.Envelope | null>(null)

  const [delay, setDelay] = useState(_data.delay)
  const [attack, setAttack] = useState(_data.attack)
  const [hold, setHold] = useState(_data.hold)
  const [decay, setDecay] = useState(_data.decay)
  const [sustain, setSustain] = useState(_data.sustain)
  const [release, setRelease] = useState(_data.release)

  useEffect(() => {
    if (!envelope.current) return

    envelope.current.attack = attack
    envelope.current.decay = decay
    envelope.current.sustain = sustain
    envelope.current.release = release
    setData({ attack, decay, sustain, release })

    if (_data.delay !== undefined) {
      envelope.current.triggerAttack(`+${delay || 0}`)
      setData({ delay, attack, decay, sustain, release })

      if (_data.hold !== undefined) {
        envelope.current.triggerRelease(`+${delay! + attack + hold! + decay}}`)
        setData({ delay, attack, decay, hold, sustain, release })
      }
    }
  }, [delay, attack, hold, decay, sustain, release])

  const init = () => {
    envelope.current = new Tone.AmplitudeEnvelope({
      attack: data.attack,
      decay: data.decay,
      sustain: data.sustain,
      release: data.release,
    })
  }

  return {
    init,
    data,
    envelope,
    limits,
    setAttack,
    setDecay,
    setSustain,
    setRelease,
    setDelay,
    setHold,
  }
}
