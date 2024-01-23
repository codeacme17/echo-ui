import * as Tone from 'tone'
import { useRef } from 'react'
import { LIMITS } from '../components/controller/Envelope/constants'
import type { EnvelopeData, EnvelopeLimits } from '../components/controller/Envelope'

export interface UseEnvelopeProps {
  data: EnvelopeData
  limits?: EnvelopeLimits
  setData?: (data: EnvelopeData) => void
}

export const useEnvelope = (props: UseEnvelopeProps) => {
  const { data, limits = LIMITS, setData } = props

  const envelope = useRef<Tone.Envelope | null>(null)

  const init = () => {
    envelope.current = new Tone.Envelope()

    return () => {}
  }

  const setAttack = (value: number) => {
    if (setData) {
      setData({ ...data, attack: value })
    }
  }

  const setDecay = (value: number) => {
    if (setData) {
      setData({ ...data, decay: value })
    }
  }

  const setDelay = (value: number) => {
    if (setData) {
      setData({ ...data, delay: value })
    }
  }

  const setHold = (value: number) => {
    if (setData) {
      setData({ ...data, hold: value })
    }
  }

  const setRelease = (value: number) => {
    if (setData) {
      setData({ ...data, release: value })
    }
  }

  return {
    envelope: envelope.current,
    data,
    limits,
    init,
    setAttack,
    setDecay,
    setDelay,
    setHold,
    setRelease,
  }
}
