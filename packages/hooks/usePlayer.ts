import * as Tone from 'tone'
import { useCallback, useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

export interface UsePlayerProps {
  volume?: number
  loop?: boolean
  mute?: boolean
  onReady?: () => void
  onPlay?: () => void
  onPause?: () => void
  onStop?: () => void
  onFinish?: () => void
  onError?: () => void
}

const VOLUME = 5
const LOOP = false
const MUTE = false

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum)

/** Owns one Tone.Player and exposes playback/progress controls for a decoded AudioBuffer. */
export const usePlayer = (props: UsePlayerProps = {}) => {
  const {
    volume: initialVolume = VOLUME,
    loop: initialLoop = LOOP,
    mute: initialMute = MUTE,
    onReady,
    onPlay,
    onPause,
    onStop,
    onFinish,
    onError,
  } = props

  const player = useRef<Tone.Player | null>(null)
  const startTime = useRef(0)
  const pauseTime = useRef(0)
  const pickTime = useRef(0)
  const audioDuration = useRef(0)
  const observeId = useRef(0)
  const expectedEndTime = useRef(0)
  const completionArmed = useRef(false)
  const playingRef = useRef(false)
  const errorRef = useRef(false)
  const loopRef = useRef(initialLoop)
  const callbacks = useRef({ onReady, onPlay, onPause, onStop, onFinish, onError })
  callbacks.current = { onReady, onPlay, onPause, onStop, onFinish, onError }

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [volume, setVolume] = useState(initialVolume)
  const [loop, setLoop] = useState(initialLoop)
  const [mute, setMute] = useState(initialMute)
  const [time, setTime] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  loopRef.current = loop

  const reportError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err)
    errorRef.current = true
    setError(true)
    setErrorMessage(message)
    logger.error(message)
    callbacks.current.onError?.()
  }, [])

  const cancelObserve = useCallback(() => {
    if (!observeId.current) return
    cancelAnimationFrame(observeId.current)
    observeId.current = 0
  }, [])

  const resetPosition = useCallback(() => {
    startTime.current = 0
    pauseTime.current = 0
    pickTime.current = 0
    expectedEndTime.current = 0
    setTime(0)
    setPercentage(0)
  }, [])

  const completePlayback = useCallback(() => {
    const currentPlayer = player.current
    if (!currentPlayer || !completionArmed.current || loopRef.current) return
    if (currentPlayer.immediate() + 0.02 < expectedEndTime.current) return

    completionArmed.current = false
    playingRef.current = false
    startTime.current = 0
    pauseTime.current = 0
    pickTime.current = 0
    expectedEndTime.current = 0
    cancelObserve()
    setIsPlaying(false)
    setIsFinish(true)
    setTime(audioDuration.current)
    setPercentage(audioDuration.current > 0 ? 100 : 0)
    callbacks.current.onFinish?.()
  }, [cancelObserve])

  const releasePlayer = useCallback(() => {
    cancelObserve()
    completionArmed.current = false
    playingRef.current = false
    const currentPlayer = player.current
    player.current = null
    if (!currentPlayer) return
    try {
      currentPlayer.onstop = () => undefined
      currentPlayer.stop()
    } catch {
      // A source may already be stopped while React is performing cleanup.
    }
    currentPlayer.dispose()
  }, [cancelObserve])

  useEffect(() => releasePlayer, [releasePlayer])

  useEffect(() => {
    const currentPlayer = player.current
    if (!currentPlayer || errorRef.current) return
    try {
      currentPlayer.loop = loop
      currentPlayer.mute = mute
      currentPlayer.volume.value = mute ? -Infinity : volume
    } catch (err) {
      reportError(err)
    }
  }, [loop, mute, reportError, volume])

  const init = useCallback(
    (audioBuffer: AudioBuffer, chain: Tone.InputNode[] = []) => {
      if (!audioBuffer) return
      try {
        releasePlayer()
        resetPosition()
        errorRef.current = false
        setError(false)
        setErrorMessage('')
        setIsReady(false)
        setIsPlaying(false)
        setIsFinish(false)
        audioDuration.current = audioBuffer.duration

        const nextPlayer = new Tone.Player(audioBuffer)
        nextPlayer.onstop = completePlayback
        nextPlayer.loop = loop
        nextPlayer.mute = mute
        nextPlayer.volume.value = mute ? -Infinity : volume
        if (chain.length) nextPlayer.chain(...chain, Tone.Destination)
        else nextPlayer.toDestination()
        player.current = nextPlayer
        setIsReady(nextPlayer.loaded)
        callbacks.current.onReady?.()
      } catch (err) {
        reportError(err)
      }
    },
    [completePlayback, loop, mute, releasePlayer, reportError, resetPosition, volume],
  )

  const play = useCallback(() => {
    const currentPlayer = player.current
    if (!currentPlayer || errorRef.current) return
    try {
      const duration = audioDuration.current
      const startOffset = clamp(pickTime.current || pauseTime.current, 0, duration)
      if (currentPlayer.state === 'started') currentPlayer.restart(undefined, startOffset)
      else currentPlayer.start(undefined, startOffset)
      const now = currentPlayer.immediate()
      startTime.current = now - startOffset
      expectedEndTime.current = now + Math.max(duration - startOffset, 0)
      pauseTime.current = 0
      pickTime.current = 0
      completionArmed.current = !loop
      playingRef.current = true
      setIsPlaying(true)
      setIsFinish(false)
      callbacks.current.onPlay?.()
    } catch (err) {
      reportError(err)
    }
  }, [loop, reportError])

  const pause = useCallback(() => {
    const currentPlayer = player.current
    if (!currentPlayer || errorRef.current) return
    try {
      const elapsed = currentPlayer.immediate() - startTime.current
      const duration = audioDuration.current
      const nextTime = loop && duration > 0 ? elapsed % duration : clamp(elapsed, 0, duration)
      completionArmed.current = false
      playingRef.current = false
      currentPlayer.stop()
      cancelObserve()
      pauseTime.current = nextTime
      pickTime.current = 0
      setTime(nextTime)
      setPercentage(duration > 0 ? (nextTime / duration) * 100 : 0)
      setIsPlaying(false)
      callbacks.current.onPause?.()
    } catch (err) {
      reportError(err)
    }
  }, [cancelObserve, loop, reportError])

  const stop = useCallback(() => {
    const currentPlayer = player.current
    if (!currentPlayer || errorRef.current) return
    try {
      completionArmed.current = false
      playingRef.current = false
      currentPlayer.stop()
      cancelObserve()
      resetPosition()
      setIsPlaying(false)
      setIsFinish(false)
      callbacks.current.onStop?.()
    } catch (err) {
      reportError(err)
    }
  }, [cancelObserve, reportError, resetPosition])

  const getTime = useCallback(() => {
    const currentPlayer = player.current
    if (!currentPlayer || errorRef.current) return
    try {
      const duration = audioDuration.current
      let nextTime = pauseTime.current
      if (playingRef.current) {
        const elapsed = currentPlayer.immediate() - startTime.current
        nextTime =
          loopRef.current && duration > 0 ? elapsed % duration : clamp(elapsed, 0, duration)
      }
      setTime(nextTime)
      setPercentage(duration > 0 ? (nextTime / duration) * 100 : 0)
      if (currentPlayer.state === 'stopped') completePlayback()
    } catch (err) {
      reportError(err)
    }
  }, [completePlayback, reportError])

  const observe = useCallback(() => {
    if (!player.current || errorRef.current || observeId.current) return
    const readFrame = () => {
      getTime()
      if (playingRef.current) observeId.current = requestAnimationFrame(readFrame)
      else observeId.current = 0
    }
    getTime()
    observeId.current = requestAnimationFrame(readFrame)
  }, [getTime])

  const setPickTime = useCallback(
    (nextTime: number) => {
      const currentPlayer = player.current
      if (!currentPlayer || errorRef.current) return
      try {
        const duration = audioDuration.current
        const nextPosition = clamp(nextTime, 0, duration)
        pickTime.current = nextPosition
        pauseTime.current = nextPosition
        setTime(nextPosition)
        setPercentage(duration > 0 ? (nextPosition / duration) * 100 : 0)
        if (playingRef.current) {
          currentPlayer.restart(undefined, nextPosition)
          const now = currentPlayer.immediate()
          startTime.current = now - nextPosition
          expectedEndTime.current = now + Math.max(duration - nextPosition, 0)
          pickTime.current = 0
          pauseTime.current = 0
          completionArmed.current = !loopRef.current
        }
      } catch (err) {
        reportError(err)
      }
    },
    [reportError],
  )

  return {
    player,
    audioDuration,
    isReady,
    isPlaying,
    isFinish,
    volume,
    loop,
    mute,
    time,
    percentage,
    pickTime,
    init,
    play,
    pause,
    stop,
    getTime,
    setPickTime,
    setVolume,
    setLoop,
    setMute,
    observe,
    cancelObserve,
    error,
    errorMessage,
  }
}
