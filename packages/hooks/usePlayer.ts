import * as Tone from 'tone'
import { useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

export interface UsePlayerProps {
  audioBuffer: AudioBuffer | null
  chain?: Tone.InputNode[]
  volume?: number
  loop?: boolean
  autostart?: boolean
  mute?: boolean
  onReady?: () => void
  onPlay?: () => void
  onPause?: () => void
  onStop?: () => void
  onFinish?: () => void
}

const VOLUME = 5
const LOOP = false
const AUTOSTART = false
const MUTE = false

export const usePlayer = (props: UsePlayerProps) => {
  const {
    audioBuffer,
    chain = [],
    volume: _volume = VOLUME,
    loop: _loop = LOOP,
    autostart: _autostart = AUTOSTART,
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
  const audioDuration = useRef(0)
  const observeId = useRef<number>(0)
  const chainCache = useRef<Tone.InputNode[] | null>(null)

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [pickTime, setPickTime] = useState<number>(0)
  const [volume, setVolume] = useState(_volume)
  const [loop, setLoop] = useState(_loop)
  const [autostart, setAutostart] = useState(_autostart)
  const [mute, setMute] = useState(_mute)
  const [time, setTime] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    init()

    return () => {
      player.current?.stop()
      player.current?.dispose()
    }
  }, [audioBuffer])

  useEffect(() => {
    if (!player.current || error) return
    if (chainCache.current?.length === chain?.length) return

    try {
      if (chain?.length) player.current.chain(...chain, Tone.Destination)
      else player.current.toDestination()
      chainCache.current = chain!
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

  useEffect(() => {
    if (!player.current || !isPlaying) return

    stop()
    play()
  }, [pickTime])

  // Watch the audio play ended
  useEffect(() => {
    if (!player.current) return
    if (!isPlaying || player.current.state === 'started') return

    try {
      setIsPlaying(false)
      setIsFinish(true)
      onFinish && onFinish()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [player.current?.state])

  useEffect(() => {
    if (!player.current || error) return

    try {
      player.current.volume.value = volume
      player.current.loop = loop
      player.current.autostart = autostart
      player.current.mute = mute
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }, [volume, loop, autostart, mute])

  useEffect(() => {
    if (error) logger.error(errorMessage)
  }, [error])

  const init = () => {
    if (!audioBuffer) return

    try {
      player.current = new Tone.Player(audioBuffer)
      audioDuration.current = audioBuffer.duration
      setIsReady(true)
      onReady && onReady()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const play = (time?: number, offset?: number, duration?: number) => {
    if (!player.current || error) return

    try {
      const startOffset = offset ? offset : pickTime ? pickTime : pauseTime.current
      player.current.start(time, startOffset, duration)
      if (offset) startTime.current = offset
      else startTime.current = player.current.immediate() - startOffset
      pauseTime.current = 0
      setIsPlaying(true)
      onPlay && onPlay()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const pause = () => {
    if (!player.current || error) return

    try {
      player.current.stop()
      const elapsed = (player.current.immediate() as number) - startTime.current
      pauseTime.current = elapsed
      setIsPlaying(false)
      onPause && onPause()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const stop = () => {
    if (!player.current || error) return

    try {
      player.current.stop()
      setIsPlaying(false)
      pauseTime.current = 0
      startTime.current = 0
      setTime(0)
      onStop?.()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const getTime = () => {
    if (!player.current || error) return

    try {
      let newTime: number
      if (player.current.state === 'stopped' && pauseTime.current === 0) newTime = 0
      else if (pauseTime.current) newTime = pauseTime.current
      else if (startTime) newTime = player.current.immediate() - startTime.current
      else newTime = player.current.immediate()
      setTime(newTime)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const observe = () => {
    if (!player.current || error) return

    try {
      getTime()
      observeId.current = requestAnimationFrame(observe)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const cancelObserve = () => {
    if (!player.current || error) return

    try {
      cancelAnimationFrame(observeId.current)
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  return {
    player: player.current,
    isReady,
    isPlaying,
    isFinish,
    audioDuration: audioDuration.current,
    volume,
    loop,
    autostart,
    mute,
    time,
    percentage,
    pickTime,
    setPickTime,
    play,
    pause,
    stop,
    getTime,
    setVolume,
    setLoop,
    setAutostart,
    setMute,
    observe,
    cancelObserve,
    error,
    errorMessage,
  }
}
