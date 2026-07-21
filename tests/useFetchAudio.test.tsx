import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFetchAudio } from '../packages/hooks/useFetchAudio'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('useFetchAudio', () => {
  it('exposes decoded audio after a successful fetch', async () => {
    const decodedAudio = {} as AudioBuffer
    const decodeAudioData = vi.fn().mockResolvedValue(decodedAudio)
    const arrayBuffer = new ArrayBuffer(8)
    const response = {
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(arrayBuffer),
    } as unknown as Response

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
    vi.stubGlobal(
      'AudioContext',
      vi.fn(function AudioContext() {
        return { decodeAudioData }
      }),
    )

    const { result } = renderHook(() => useFetchAudio({ url: '/audio/example.wav' }))

    await act(async () => {
      await result.current.fetchAudio()
    })

    await waitFor(() => {
      expect(result.current).toMatchObject({
        pending: false,
        fetched: true,
        error: false,
        audioBuffer: decodedAudio,
      })
    })
  })
})
