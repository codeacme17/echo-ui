import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useOscilloscope } from '../packages/hooks/useOscilloscope'

const tone = vi.hoisted(() => ({ Analyser: vi.fn() }))

vi.mock('tone', () => ({ Analyser: tone.Analyser }))

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

describe('useOscilloscope', () => {
  it('releases replaced analysers and cancels each observation loop once', () => {
    const firstAnalyser = {
      dispose: vi.fn(),
      getValue: vi.fn(() => new Float32Array()),
    }
    const secondAnalyser = {
      dispose: vi.fn(),
      getValue: vi.fn(() => new Float32Array()),
    }
    tone.Analyser.mockImplementationOnce(function Analyser() {
      return firstAnalyser
    }).mockImplementationOnce(function Analyser() {
      return secondAnalyser
    })
    const { result, unmount } = renderHook(() => useOscilloscope())

    act(() => {
      result.current.init()
      result.current.init()
      result.current.observer()
      result.current.cancelObserve()
      result.current.cancelObserve()
    })

    expect(firstAnalyser.dispose).toHaveBeenCalledOnce()
    expect(cancelAnimationFrame).toHaveBeenCalledOnce()
    unmount()
    expect(secondAnalyser.dispose).toHaveBeenCalledOnce()
  })
})
