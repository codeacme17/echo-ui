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

/**
 * usePlayer is a custom React hook that provides functionalities to play, pause, stop, and manage audio playback using Tone.js.
 * It allows control over playback volume, looping, muting, and offers callbacks for various audio playback states.
 *
 * @param {UsePlayerProps} props - Configuration properties for the player.
 * @param {number} props.volume - Initial volume for the player (default: 5).
 * @param {boolean} props.loop - Whether the audio should loop (default: false).
 * @param {boolean} props.mute - Whether the audio should be muted (default: false).
 * @param {Function} props.onReady - Callback executed when the player is ready.
 * @param {Function} props.onPlay - Callback executed when the audio starts playing.
 * @param {Function} props.onPause - Callback executed when the audio is paused.
 * @param {Function} props.onStop - Callback executed when the audio is stopped.
 * @param {Function} props.onFinish - Callback executed when the audio finishes playing.
 * @param {Function} props.onError - Callback executed in case of an error.
 *
 * @returns {object} An object containing various properties and methods for audio playback control:
 * - player: The Tone.js Player instance.
 * - audioDuration: The duration of the loaded audio.
 * - isReady: Boolean indicating if the player is ready.
 * - isPlaying: Boolean indicating if the audio is currently playing.
 * - isFinish: Boolean indicating if the audio has finished playing.
 * - volume: Current volume of the player.
 * - loop: Boolean indicating if the audio is set to loop.
 * - mute: Boolean indicating if the audio is muted.
 * - time: Current playback time.
 * - percentage: Current playback progress as a percentage.
 * - pickTime: Method to set the playback start time.
 * - init: Method to initialize the player with an AudioBuffer.
 * - play: Method to start playback.
 * - pause: Method to pause playback.
 * - stop: Method to stop playback.
 * - getTime: Method to get the current playback time.
 * - setPickTime: Method to set a specific playback time.
 * - setVolume: Method to set the volume.
 * - setLoop: Method to toggle looping.
 * - setMute: Method to toggle mute.
 * - observe: Method to start observing playback state.
 * - cancelObserve: Method to stop observing playback state.
 * - error: Boolean indicating if an error has occurred.
 * - errorMessage: The error message in case of an error.
 */
export const usePlayer = (props: UsePlayerProps = {}) => {
  const {
    volume: _volume = VOLUME,
    loop: _loop = LOOP,
    mute: _mute = MUTE,
    onReady,
    onPlay,
    onPause,
    onStop,
    onFinish,
    onError,
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
    return () => {
      if (!player.current) return
      player.current.stop()
      player.current.dispose()
    }
  }, [])

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
    if (!error) return
    logger.error(errorMessage)
    onError && onError()
  }, [error])

  const init = (audioBuffer: AudioBuffer, chain: Tone.InputNode[] = []) => {
    if (!audioBuffer) return

    try {
      player.current = new Tone.Player(audioBuffer)
      player.current.volume.value = volume
      audioDuration.current = audioBuffer.duration
      if (chain?.length) player.current.chain(...chain, Tone.Destination)
      else player.current.toDestination()
      setIsReady(true)
      onReady && onReady()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

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
