import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

interface UsePlayerProps {
  audioBuffer: AudioBuffer
  defaultVolume?: number
  onReady?: () => void
}

const VOLUME = 5

export const usePlayer = (props: UsePlayerProps) => {
  const { audioBuffer, defaultVolume = VOLUME, onReady: _onReady } = props

  const player = useRef<Tone.Player | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [volume, setVolume] = useState(defaultVolume)

  useEffect(() => {
    if (!audioBuffer) return
    init()

    return () => {
      player.current?.stop()
      player.current?.dispose()
    }
  }, [audioBuffer])

  const init = () => {
    player.current = new Tone.Player(audioBuffer)
    player.current.volume.value = volume
    onReady()
  }

  useEffect(() => {
    if (!player.current) return
    console.log(volume)
    player.current.volume.value = volume
  }, [volume])

  const onReady = () => {
    setIsReady(true)
    _onReady?.()
  }

  return { player: player.current, isReady, volume, setVolume }
}
