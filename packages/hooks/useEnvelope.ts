import * as Tone from 'tone'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LIMITS } from '../components/controller/Envelope/constants'
import type { EnvelopeData, EnvelopeLimits } from '../components/controller/Envelope'

export interface UseEnvelopeProps {
  data: EnvelopeData
  limits?: EnvelopeLimits
}

export const useEnvelope = (props: UseEnvelopeProps) => {
  const { data: initialData, limits = LIMITS } = props

  const [data, setData] = useState({ ...initialData })
  const envelope = useRef<Tone.AmplitudeEnvelope | null>(null)
  const [delay, setDelay] = useState(initialData.delay)
  const [attack, setAttack] = useState(initialData.attack)
  const [hold, setHold] = useState(initialData.hold)
  const [decay, setDecay] = useState(initialData.decay)
  const [sustain, setSustain] = useState(initialData.sustain)
  const [release, setRelease] = useState(initialData.release)

  const releaseEnvelope = useCallback(() => {
    envelope.current?.dispose()
    envelope.current = null
  }, [])

  useEffect(() => releaseEnvelope, [releaseEnvelope])

  useEffect(() => {
    const currentEnvelope = envelope.current
    if (!currentEnvelope) return

    currentEnvelope.attack = attack
    currentEnvelope.decay = decay
    currentEnvelope.sustain = sustain
    currentEnvelope.release = release
    const nextData = { attack, decay, sustain, release, delay, hold }
    setData(nextData)

    if (delay !== undefined) {
      const now = currentEnvelope.immediate()
      currentEnvelope.cancel(now)
      currentEnvelope.triggerAttack(now + delay)
      if (hold !== undefined) {
        currentEnvelope.triggerRelease(now + delay + attack + hold + decay)
      }
    }
  }, [attack, decay, delay, hold, release, sustain])

  const init = useCallback(() => {
    releaseEnvelope()
    envelope.current = new Tone.AmplitudeEnvelope({ attack, decay, sustain, release })
  }, [attack, decay, release, releaseEnvelope, sustain])

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
