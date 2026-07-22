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
  onstop: () => void
  restart: ReturnType<typeof vi.fn>
  start: ReturnType<typeof vi.fn>
  state: string
  stop: ReturnType<typeof vi.fn>
  toDestination: ReturnType<typeof vi.fn>
  volume: { value: number }
}

const createPlayerNode = () => ({
  chain: vi.fn(),
  dispose: vi.fn(),
  immediate: vi.fn(() => 1),
  loop: false,
  mute: false,
  onstop: vi.fn(),
  restart: vi.fn(),
  start: vi.fn(),
  state: 'stopped',
  stop: vi.fn(),
  toDestination: vi.fn(),
  volume: { value: 0 },
})

beforeEach(() => {
  playerNode = createPlayerNode()
  tone.Player.mockImplementation(function Player() {
    return playerNode
  })
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

describe('usePlayer', () => {
  it('reports natural completion without treating an explicit stop as a finish', () => {
    const onFinish = vi.fn()
    let immediateTime = 5
    const node = createPlayerNode()
    node.immediate.mockImplementation(() => immediateTime)
    tone.Player.mockImplementationOnce(function Player() {
      return node
    })
    const { result } = renderHook(() => usePlayer({ onFinish }))

    act(() => {
      result.current.init({ duration: 2 } as AudioBuffer)
      result.current.play()
      result.current.stop()
      node.onstop()
    })
    expect(onFinish).not.toHaveBeenCalled()

    act(() => {
      result.current.play()
      immediateTime = 7
      node.onstop()
    })

    expect(onFinish).toHaveBeenCalledOnce()
    expect(result.current.isFinish).toBe(true)
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.time).toBe(2)
    expect(result.current.percentage).toBe(100)
  })

  it('releases the previous player and resets progress when the source changes', () => {
    const firstPlayer = createPlayerNode()
    const secondPlayer = createPlayerNode()
    tone.Player.mockImplementationOnce(function Player() {
      return firstPlayer
    }).mockImplementationOnce(function Player() {
      return secondPlayer
    })
    const { result } = renderHook(() => usePlayer())

    act(() => {
      result.current.init({ duration: 10 } as AudioBuffer)
      result.current.setPickTime(4)
      result.current.getTime()
    })
    expect(result.current.time).toBe(4)

    act(() => result.current.init({ duration: 2 } as AudioBuffer))

    expect(firstPlayer.stop).toHaveBeenCalledOnce()
    expect(firstPlayer.dispose).toHaveBeenCalledOnce()
    expect(result.current.player.current).toBe(secondPlayer)
    expect(result.current.audioDuration.current).toBe(2)
    expect(result.current.time).toBe(0)
    expect(result.current.percentage).toBe(0)
  })

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
