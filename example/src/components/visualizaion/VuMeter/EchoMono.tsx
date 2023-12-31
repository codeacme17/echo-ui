import * as Tone from 'tone'
import { useEffect, useState } from 'react'
import { VuMeter, Button } from '@echo-ui'
import { Play, Square } from 'lucide-react'

export const VuMeterMono = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'
  const [value, setValue] = useState<number | number[]>(-60)
  const [player, setPlayer] = useState<Tone.Player | null>(null)
  const [isPlay, setIsPlay] = useState(false)
  const [meter] = useState<Tone.Meter>(new Tone.Meter())

  const handlePlay = () => {
    setIsPlay(!isPlay)
    if (!player) return
    player.volume.value = 5

    if (player.state === 'started') {
      player.stop()
      return
    }

    player.start()
    player.connect(meter)
    getDB()
  }

  useEffect(() => {
    const player = new Tone.Player(url).toDestination()
    setPlayer(player)

    return () => {
      player.stop()
      player.disconnect()
    }
  }, [])

  const getDB = () => {
    if (player?.state === 'stopped') {
      setValue(-60)
      return
    }
    setValue(meter.getValue() as number)
    requestAnimationFrame(getDB)
  }

  return (
    <section className="w-80">
      <Button onClick={handlePlay} toggled={isPlay} className="mb-5 data-[toggled=true]:bg-red-400">
        {isPlay ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <VuMeter value={value} onChange={setValue} lumpsQuantity={30} />
      <VuMeter
        value={value}
        onChange={setValue}
        className="mt-10"
        horizontal
        compact
        lumpsQuantity={60}
      />
    </section>
  )
}
