import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePlayer } from '../packages/hooks/usePlayer'

const tone = vi.hoisted(() => ({ Destination: {}, Player: vi.fn() }))

vi.mock('tone', () => tone)

let playerNode: {
  chain: ReturnType<typeof vi.fn>
  dispose: ReturnType<typeof vi.fn>
  immediate: ReturnType<typeof vi.fn>
  loop: boolean
  mute: boolean
  start: ReturnType<typeof vi.fn>
  state: string
  stop: ReturnType<typeof vi.fn>
  toDestination: ReturnType<typeof vi.fn>
  volume: { value: number }
}

beforeEach(() => {
  playerNode = {
    chain: vi.fn(),
    dispose: vi.fn(),
    immediate: vi.fn(() => 1),
    loop: false,
    mute: false,
    start: vi.fn(),
    state: 'stopped',
    stop: vi.fn(),
    toDestination: vi.fn(),
    volume: { value: 0 },
  }
  tone.Player.mockImplementation(function Player() {
    return playerNode
  })
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 42))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

describe('usePlayer', () => {
  it('can cancel progress observation after playback reports an error', async () => {
    const { result } = renderHook(() => usePlayer())
    playerNode.start.mockImplementationOnce(() => {
      throw new Error('playback failed')
    })

    act(() => {
      result.current.init({ duration: 10 } as AudioBuffer)
      result.current.observe()
      result.current.play()
    })

    await waitFor(() => expect(result.current.error).toBe(true))
    act(() => result.current.cancelObserve())

    expect(cancelAnimationFrame).toHaveBeenCalledWith(42)
  })

  it('cancels progress observation when its component unmounts', () => {
    const { result, unmount } = renderHook(() => usePlayer())

    act(() => {
      result.current.init({ duration: 10 } as AudioBuffer)
      result.current.observe()
    })
    unmount()

    expect(cancelAnimationFrame).toHaveBeenCalledWith(42)
    expect(playerNode.stop).toHaveBeenCalledOnce()
    expect(playerNode.dispose).toHaveBeenCalledOnce()
  })
})
