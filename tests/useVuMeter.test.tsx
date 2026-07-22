import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useVuMeter } from '../packages/hooks/useVuMeter'

const tone = vi.hoisted(() => ({ Meter: vi.fn() }))

vi.mock('tone', () => tone)

const createMeter = () => ({
  dispose: vi.fn(),
  getValue: vi.fn(() => -12),
})

beforeEach(() => {
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn(() => 42),
  )
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

describe('useVuMeter', () => {
  it('uses the Tone 15 multichannel meter API and releases the stereo node', () => {
    const stereoMeter = createMeter()
    stereoMeter.getValue.mockReturnValue([-11, -13])
    tone.Meter.mockImplementationOnce(function Meter() {
      return stereoMeter
    })
    const { result, unmount } = renderHook(() => useVuMeter({ value: [-60, -60] }))

    act(() => {
      result.current.init()
      result.current.getValue()
    })
    expect(tone.Meter).toHaveBeenCalledWith({ channelCount: 2 })
    expect(result.current.value).toEqual([-11, -13])

    act(() => {
      result.current.observe()
      result.current.cancelObserve()
      result.current.cancelObserve()
    })

    expect(cancelAnimationFrame).toHaveBeenCalledOnce()
    unmount()
    expect(result.current.meter.current).toBe(null)
    expect(stereoMeter.dispose).toHaveBeenCalledOnce()
  })
})
