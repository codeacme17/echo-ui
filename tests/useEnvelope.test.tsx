import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useEnvelope } from '../packages/hooks/useEnvelope'

const tone = vi.hoisted(() => ({ AmplitudeEnvelope: vi.fn() }))

vi.mock('tone', () => tone)

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('useEnvelope', () => {
  it('reschedules valid AHDSR times and disposes the Tone envelope', async () => {
    const envelopeNode = {
      attack: 0,
      cancel: vi.fn(),
      decay: 0,
      dispose: vi.fn(),
      immediate: vi.fn(() => 4),
      release: 0,
      sustain: 0,
      triggerAttack: vi.fn(),
      triggerRelease: vi.fn(),
    }
    tone.AmplitudeEnvelope.mockImplementationOnce(function AmplitudeEnvelope() {
      return envelopeNode
    })
    const { result, unmount } = renderHook(() =>
      useEnvelope({
        data: { attack: 0.6, decay: 0.2, delay: 0.1, hold: 0.5, release: 0.2, sustain: 0.8 },
      }),
    )

    act(() => {
      result.current.init()
      result.current.setHold(0.4)
    })

    await waitFor(() => expect(envelopeNode.triggerRelease).toHaveBeenCalled())
    expect(envelopeNode.cancel).toHaveBeenCalledWith(4)
    expect(envelopeNode.triggerAttack).toHaveBeenCalledWith(4.1)
    expect(envelopeNode.triggerRelease).toHaveBeenCalledWith(5.3)

    unmount()
    expect(envelopeNode.dispose).toHaveBeenCalledOnce()
  })
})
