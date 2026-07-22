import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useVuMeter } from '../packages/hooks/useVuMeter'

const tone = vi.hoisted(() => ({ Meter: vi.fn(), Split: vi.fn() }))

vi.mock('tone', () => tone)

const createMeter = () => ({
  dispose: vi.fn(),
  getValue: vi.fn(() => -12),
})

const createSplit = () => ({
  connect: vi.fn(),
  dispose: vi.fn(),
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
  it('normalizes Tone 15 meter arrays and releases every stereo node', () => {
    const leftMeter = createMeter()
    const rightMeter = createMeter()
    leftMeter.getValue.mockReturnValue(new Float32Array([-11]) as never)
    rightMeter.getValue.mockReturnValue(new Float32Array([-13]) as never)
    const split = createSplit()
    tone.Meter.mockImplementationOnce(function Meter() {
      return leftMeter
    }).mockImplementationOnce(function Meter() {
      return rightMeter
    })
    tone.Split.mockImplementationOnce(function Split() {
      return split
    })
    const { result, unmount } = renderHook(() => useVuMeter({ value: [-60, -60] }))

    act(() => {
      result.current.init()
      result.current.getValue()
    })
    expect(result.current.value).toEqual([-11, -13])

    act(() => {
      result.current.observe()
      result.current.cancelObserve()
      result.current.cancelObserve()
    })

    expect(cancelAnimationFrame).toHaveBeenCalledOnce()
    unmount()
    expect(split.dispose).toHaveBeenCalledOnce()
    expect(leftMeter.dispose).toHaveBeenCalledOnce()
    expect(rightMeter.dispose).toHaveBeenCalledOnce()
  })
})
