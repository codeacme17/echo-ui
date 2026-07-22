import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useWaveform } from '../packages/hooks/useWaveform'

const createAudioBuffer = (channels: number[][], duration = 1) =>
  ({
    duration,
    numberOfChannels: channels.length,
    getChannelData: (channel: number) => Float32Array.from(channels[channel]),
  }) as AudioBuffer

afterEach(cleanup)

describe('useWaveform', () => {
  it('recomputes finite samples for source changes and available channels', async () => {
    const monoBuffer = createAudioBuffer([[0.25, -0.25, 0.25, -0.25]])
    const stereoBuffer = createAudioBuffer([
      [0.75, -0.75, 0.75, -0.75],
      [0.5, -0.5, 0.5, -0.5],
    ])
    const { result, rerender } = renderHook(
      ({ audioBuffer }) => useWaveform({ audioBuffer, channel: 2, samples: 8 }),
      { initialProps: { audioBuffer: monoBuffer } },
    )

    await waitFor(() => expect(result.current.data).toHaveLength(1))
    expect(result.current.data[0]).toHaveLength(8)
    expect(result.current.data.flat().every((value) => Number.isFinite(value))).toBe(true)
    expect(result.current.error).toBe(false)

    rerender({ audioBuffer: stereoBuffer })

    await waitFor(() => expect(result.current.data).toHaveLength(2))
    expect(result.current.data[0][0]).toBeCloseTo(0.75)
    expect(result.current.data[1][0]).toBeCloseTo(0.5)
    expect(result.current.audioDuration.current).toBe(1)
  })
})
