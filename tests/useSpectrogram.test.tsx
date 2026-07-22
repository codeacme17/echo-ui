import { act, cleanup, renderHook } from '@testing-library/react'
import { StrictMode, type PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSpectrogram } from '../packages/hooks/useSpectrogram'

const tone = vi.hoisted(() => ({ Analyser: vi.fn() }))

vi.mock('tone', () => ({ Analyser: tone.Analyser }))

const StrictModeWrapper = ({ children }: PropsWithChildren) => (
  <StrictMode>{children}</StrictMode>
)

beforeEach(() => {
  tone.Analyser.mockImplementation(function Analyser() {
    return {
      dispose: vi.fn(),
      getValue: vi.fn(() => new Float32Array()),
      size: 1024,
    }
  })
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('useSpectrogram', () => {
  it('notifies callers when the analyser is ready', () => {
    const onReady = vi.fn()
    const { result } = renderHook(() => useSpectrogram({ onReady }))

    act(() => result.current.init())

    expect(onReady).toHaveBeenCalledOnce()
  })

  it('notifies callers when analyser initialization fails', () => {
    const onError = vi.fn()
    tone.Analyser.mockImplementationOnce(function Analyser() {
      throw new Error('invalid fft size')
    })
    const { result } = renderHook(() => useSpectrogram({ onError }), {
      wrapper: StrictModeWrapper,
    })

    act(() => result.current.init())

    expect(onError).toHaveBeenCalledOnce()
  })
})
