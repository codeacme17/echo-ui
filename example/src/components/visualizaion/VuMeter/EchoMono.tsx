import { useEffect, useState } from 'react'
import * as Tone from 'tone'
import { VuMeter, Button } from '@echo-ui'
import { Play, Square } from 'lucide-react'

const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

export const VuMeterMono = () => {
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
    <section className="flex flex-col justify-center items-center w-20">
      <Button onClick={handlePlay} toggled={isPlay} className="mb-5 data-[toggled=true]:bg-red-400">
        {isPlay ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <VuMeter
        value={value}
        lumpsQuantity={40}
        onChange={setValue}
        classNames={{
          lump: 'w-3 rounded-none',
          axis: 'ml-10',
          lumps: 'gap-0',
        }}
      />
    </section>
  )
}
