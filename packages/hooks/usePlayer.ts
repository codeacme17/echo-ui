import * as Tone from 'tone'
import { useEffect, useRef, useState } from 'react'

export interface UsePlayerProps {
  audioBuffer: AudioBuffer | null
  volume?: number
  loop?: boolean
  autostart?: boolean
  mute?: boolean
  chain?: Tone.InputNode[]
  fadeIn?: Tone.Unit.Time
  fadeOut?: Tone.Unit.Time
  onReady?: () => void
  onPlay?: () => void
  onPlaying?: () => void
  onStop?: () => void
}

const VOLUME = 5
const LOOP = false
const AUTOSTART = false
const MUTE = false

export const usePlayer = (props: UsePlayerProps) => {
  const {
    audioBuffer,
    volume: _volume = VOLUME,
    loop: _loop = LOOP,
    autostart: _autostart = AUTOSTART,
    mute: _mute = MUTE,
    chain,
    onReady,
    onPlay,
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

  const startTime = useRef(Date.now())

  useEffect(() => {
    init()

    return () => {
      player.current?.stop()
      player.current?.dispose()
    }
  }, [audioBuffer])

  useEffect(() => {
    if (!player.current) return
    player.current.volume.value = volume
    player.current.loop = loop
    player.current.autostart = autostart
    player.current.mute = mute
  }, [volume, loop, autostart, mute])

  const init = () => {
    if (!audioBuffer) return
    player.current = new Tone.Player(audioBuffer)

    if (chain?.length) player.current.chain(...chain)
    player.current.toDestination()
    setAudioDuration(audioBuffer.duration)
    setIsReady(true)
    onReady && onReady()
  }

  const play = (time?: Tone.Unit.Time, offset?: Tone.Unit.Time, duration?: Tone.Unit.Time) => {
    if (!player.current) return
    player.current.start(time, offset, duration)
    setIsPlaying(true)
    onPlay && onPlay()
  }

  const stop = (time?: Tone.Unit.Time) => {
    if (!player.current) return
    player.current.stop(time)
    setIsPlaying(false)
    onStop?.()
    startTime.current = Date.now()
  }

  const connect = (destination: Tone.InputNode, outputNum?: number, inputNum?: number) => {
    if (!player.current) return
    player.current.connect(destination, outputNum, inputNum)
  }

  const getTime = () => {
    if (!player.current || player.current.state === 'stopped') return 0
    return (Date.now() - startTime.current) / 1000
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
    stop,
    connect,
    getTime,
    getPercent,
    setVolume,
    setLoop,
    setAutostart,
    setMute,
  }
}
