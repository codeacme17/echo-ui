import * as Tone from 'tone'
import { useEffect, useRef, useState } from 'react'

interface UsePlayerProps {
  audioBuffer: AudioBuffer | null
  volume?: number
  loop?: boolean
  autostart?: boolean
  mute?: boolean
  chain?: Tone.InputNode[]
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
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [state, setState] = useState<Tone.BasicPlaybackState>('stopped' as Tone.BasicPlaybackState)
  const [volume, setVolume] = useState(_volume)
  const [loop, setLoop] = useState(_loop)
  const [autostart, setAutostart] = useState(_autostart)
  const [mute, setMute] = useState(_mute)

  useEffect(() => {
    init()

    return () => {
      player.current?.stop()
      player.current?.dispose()
    }
  }, [audioBuffer])

  const init = () => {
    if (!audioBuffer) return
    player.current = new Tone.Player(audioBuffer)

    // if there is a chain, connect to the chain
    if (chain?.length) {
      player.current.chain(...chain)
    } else player.current.toDestination()

    setIsReady(true)
    onReady?.()
  }

  useEffect(() => {
    if (!player.current) return
    player.current.volume.value = volume
    player.current.loop = loop
    player.current.autostart = autostart
    player.current.mute = mute
  }, [volume, loop, autostart, mute])

  useEffect(() => {
    if (!player.current) return
    setState(player.current?.state)
  }, [player.current?.state])

  const play = (time?: Tone.Unit.Time, offset?: Tone.Unit.Time, duration?: Tone.Unit.Time) => {
    if (!player.current) return
    player.current.start(time, offset, duration)
    setIsPlaying(true)
    onPlay?.()
  }

  const stop = (time?: Tone.Unit.Time) => {
    if (!player.current) return
    player.current.stop(time)
    setIsPlaying(false)
    onStop?.()
  }

  const connect = (destination: Tone.InputNode, outputNum?: number, inputNum?: number) => {
    if (!player.current) return
    player.current.connect(destination, outputNum, inputNum)
  }

  return {
    player: player.current,
    isReady,
    isPlaying,
    state,
    volume,
    loop,
    autostart,
    mute,
    play,
    stop,
    connect,
    setVolume,
    setLoop,
    setAutostart,
    setMute,
  }
}
