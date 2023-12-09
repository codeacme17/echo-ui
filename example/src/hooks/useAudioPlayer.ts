import { useState, useEffect } from 'react'
import * as Tone from 'tone'

export const useAudioPlayer = (url: string, initDB: number | number[]) => {
  const [player, setPlayer] = useState<Tone.Player | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [dbValue, setDbValue] = useState<number | number[]>(initDB)
  const [meter, setMeter] = useState<Tone.Meter | null>(null)

  useEffect(() => {
    const newPlayer = new Tone.Player(url).toDestination()
    const newMeter = new Tone.Meter()
    newPlayer.connect(newMeter)
    setPlayer(newPlayer)
    setMeter(newMeter)

    return () => {
      newPlayer.stop()
      newPlayer.disconnect()
    }
  }, [url])

  const togglePlay = () => {
    if (!player) return
    setIsPlaying(!isPlaying)

    if (player.state === 'started') {
      player.stop()
    } else {
      player.start()
      monitorDb()
    }
  }

  const monitorDb = () => {
    if (!player || player.state === 'stopped') {
      setDbValue(-60)
      return
    }

    const dbLevel = meter!.getValue()
    setDbValue(dbLevel)
    requestAnimationFrame(monitorDb)
  }

  return { player, dbValue, isPlaying, togglePlay }
}

export default useAudioPlayer
