import * as Tone from 'tone'
import { useEffect, useRef, useState } from 'react'
import { logger } from '../lib/log'

interface UsePlayerProps {
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
    chain,
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [volume, setVolume] = useState(_volume)
  const [loop, setLoop] = useState(_loop)
  const [autostart, setAutostart] = useState(_autostart)
  const [mute, setMute] = useState(_mute)
  const [audioDuration, setAudioDuration] = useState(0)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const startTime = useRef<number>(0)
  const pauseTime = useRef<number>(0)
  const [pickTime, setPickTime] = useState<number>(0)

  useEffect(() => {
    init()

    return () => {
      player.current?.stop()
      player.current?.dispose()
    }
  }, [audioBuffer])

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

      if (chain?.length) player.current.chain(...chain)
      player.current.toDestination()
      setAudioDuration(audioBuffer.duration)
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

      setIsPlaying(true)
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

  const stop = (time?: number) => {
    if (!player.current || error) return

    try {
      player.current.stop(time)
      setIsPlaying(false)
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
    if (!player.current) return 0
    if (pauseTime.current) return pauseTime.current
    if (startTime) return player.current.immediate() - startTime.current
    return player.current.immediate()
  }

  const getPercent = () => {
    if (!player.current) return 0
    return getTime() / audioDuration
  }

  return {
    player: player.current,
    isReady,
    isPlaying,
    volume,
    loop,
    autostart,
    mute,
    audioDuration,
    play,
    pause,
    stop,
    connect,
    getTime,
    getPercent,
    setVolume,
    setLoop,
    setAutostart,
    setMute,
    setPickTime,
    error,
    errorMessage,
  }
}
