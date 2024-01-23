import * as Tone from 'tone'
import { useCallback, useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

export interface UsePlayerProps {
  audioBuffer?: AudioBuffer | null
  chain?: Tone.InputNode[]
  volume?: number
  loop?: boolean
  mute?: boolean
  onReady?: () => void
  onPlay?: () => void
  onPause?: () => void
  onStop?: () => void
  onFinish?: () => void
}

const VOLUME = 5
const LOOP = false
const MUTE = false

/**
 * Custom hook for controlling audio play events.
 *
 * @param UsePlayerProps - The hook props.
 *  - audioBuffer: The audio buffer to play,
 *                 When this parameter is passed in,
 *                 it means that the Player will be created immediately after obtaining a valid `audioBuffer` value.
 *                 Or you can use the `init` method to choose the creation time yourself.
 *  - chain: The chain of audio nodes to connect to the player.
 *  - volume: The volume of the player.
 *  - loop: Whether the player should loop.
 *  - mute: Whether the player should be muted.
 *  - onReady: Callback function to be called when the player is ready.
 *  - onPlay: Callback function to be called when the player starts playing.
 *  - onPause: Callback function to be called when the player is paused.
 *  - onStop: Callback function to be called when the player is stopped.
 *  - onFinish: Callback function to be called when the player finishes playing.
 *
 * @returns An object containing various functions and state variables for controlling audio playback.
 */
export const usePlayer = (props: UsePlayerProps) => {
  const {
    audioBuffer,
    chain = [],
    volume: _volume = VOLUME,
    loop: _loop = LOOP,
    mute: _mute = MUTE,
    onReady,
    onPlay,
    onPause,
    onStop,
    onFinish,
  } = props

  const player = useRef<Tone.Player | null>(null)
  const startTime = useRef<number>(0)
  const pauseTime = useRef<number>(0)
  const pickTime = useRef<number>(0)
  const audioDuration = useRef(0)
  const observeId = useRef<number>(0)

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [volume, setVolume] = useState(_volume)
  const [loop, setLoop] = useState(_loop)
  const [mute, setMute] = useState(_mute)
  const [time, setTime] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!player.current && audioBuffer) init(audioBuffer)

    return () => {
      if (!player.current) return
      player.current.stop()
      player.current.dispose()
    }
  }, [audioBuffer])

  // Watch the chain is changed and update the chain
  useEffect(() => {
    if (!player.current || error) return

    try {
      if (chain?.length) player.current.chain(...chain, Tone.Destination)
      else player.current.toDestination()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [chain])

  useEffect(() => {
    if (!player.current) return

    const newPercentage = (time / audioDuration.current) * 100
    setPercentage(newPercentage)
  }, [time])

  // Watch the audio play ended
  useEffect(() => {
    if (!player.current || error) return
    if (!isPlaying || player.current.state === 'started') return

    try {
      setIsPlaying(false)
      setIsFinish(true)
      startTime.current = 0
      pauseTime.current = 0
      pickTime.current = 0
      cancelObserve()
      setTime(audioDuration.current)
      onFinish && onFinish()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [player.current?.state])

  useEffect(() => {
    if (!player.current || error) return

    try {
      player.current.loop = loop
      player.current.mute = mute
      player.current.volume.value = mute ? -Infinity : volume
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [player.current, volume, loop, mute])

  useEffect(() => {
    if (error) logger.error(errorMessage)
  }, [error])

  const init = useCallback(
    (audioBuffer: AudioBuffer) => {
      if (!audioBuffer) return

      try {
        player.current = new Tone.Player(audioBuffer)
        player.current.volume.value = 1
        audioDuration.current = audioBuffer.duration
        setIsReady(true)
        onReady && onReady()
      } catch (err) {
        setError(true)
        setErrorMessage(err as string)
      }
    },
    [audioBuffer],
  )

  const play = useCallback(() => {
    if (!player.current || error) return

    try {
      if (isPlaying) player.current.stop()
      const startOffset = pickTime.current ? pickTime.current : pauseTime.current
      player.current.start(undefined, startOffset)
      startTime.current = player.current.immediate() - startOffset
      pauseTime.current = 0
      setIsPlaying(true)
      setIsFinish(false)
      onPlay && onPlay()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [player.current, pickTime.current, pauseTime.current, error])

  const pause = useCallback(() => {
    if (!player.current || error) return

    try {
      player.current.stop()
      const elapsed = (player.current.immediate() as number) - startTime.current
      pauseTime.current = elapsed % audioDuration.current
      pickTime.current = 0
      setIsPlaying(false)
      onPause && onPause()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [player.current, startTime.current, error])

  const stop = useCallback(() => {
    if (!player.current || error) return

    try {
      player.current.stop()
      setIsPlaying(false)
      pauseTime.current = 0
      startTime.current = 0
      pickTime.current = 0
      setTime(0)
      onStop?.()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [player.current, error])

  const setPickTime = (time: number) => {
    if (!player.current || error) return
    pickTime.current = time

    if (isPlaying) {
      play()
      cancelObserve()
    }
  }

  const getTime = useCallback(() => {
    if (!player.current || error) return

    try {
      let newTime: number
      // if paused, use the pauseTime
      if (pauseTime.current) newTime = pauseTime.current
      // if startTime is set, use the startTime
      else if (startTime.current) newTime = player.current.immediate() - startTime.current
      else newTime = player.current.immediate()

      newTime = newTime % audioDuration.current
      setTime(newTime)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [player.current, startTime.current, error])

  const observe = useCallback(() => {
    if (!player.current || error) return

    try {
      getTime()
      observeId.current = requestAnimationFrame(observe)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [getTime, error])

  const cancelObserve = () => {
    if (!player.current || error) return
    if (!observeId.current) return

    try {
      cancelAnimationFrame(observeId.current)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  return {
    player: player.current,
    audioDuration: audioDuration.current,
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
