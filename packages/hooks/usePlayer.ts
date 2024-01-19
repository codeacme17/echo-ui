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
  } = props

  const player = useRef<Tone.Player | null>(null)
  const isReady = useRef(false)
  const isPlaying = useRef(false)
  const isFinish = useRef(false)
  const startTime = useRef<number>(0)
  const pauseTime = useRef<number>(0)
  const audioDuration = useRef(0)
  const observeId = useRef<number>(0)

  const [pickTime, setPickTime] = useState<number>(0)
  const [volume, setVolume] = useState(_volume)
  const [loop, setLoop] = useState(_loop)
  const [autostart, setAutostart] = useState(_autostart)
  const [mute, setMute] = useState(_mute)
  const [time, setTime] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const chainCache = useRef<Tone.InputNode[] | null>(null)

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
    if (!player.current) return
    const newPercentage = (time / audioDuration.current) * 100
    setPercentage(newPercentage)
  }, [time])

  useEffect(() => {
    if (!player.current || !isPlaying.current) return
    stop()
    play()
  }, [pickTime])

  useEffect(() => {
    if (error) logger.error(errorMessage)
  }, [error])

  const init = () => {
    if (!audioBuffer) return

    try {
      player.current = new Tone.Player(audioBuffer)
      isReady.current = true
      audioDuration.current = audioBuffer.duration
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
      isPlaying.current = true
      pauseTime.current = 0
      onPlay && onPlay()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const pause = () => {
    if (!player.current || error) return

    try {
      const elapsed = (player.current.immediate() as number) - startTime.current
      player.current.stop(elapsed)
      pauseTime.current = elapsed
      isPlaying.current = false
      onPause && onPause()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const stop = (time?: number) => {
    if (!player.current || error) return

    try {
      player.current.stop(time)
      isPlaying.current = false
      pauseTime.current = 0
      startTime.current = 0
      onStop?.()
    } catch (err) {
      setError(true)
      setErrorMessage(err as string)
    }
  }

  const connect = (destination: Tone.InputNode, outputNum?: number, inputNum?: number) => {
    if (!player.current || error) return

    try {
      player.current.connect(destination, outputNum, inputNum)
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
    isReady: isReady.current,
    isPlaying: isPlaying.current,
    isFinish: isFinish.current,
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
    connect,
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
