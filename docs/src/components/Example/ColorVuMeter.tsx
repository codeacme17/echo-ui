import React from 'react'
import * as Tone from 'tone'
import { VuMeter, Button } from 'echo-ui'
import { Play, Square } from 'lucide-react'

export const ColorVuMeter = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'
  const [value, setValue] = React.useState<number | number[]>(-60)
  const [player, setPlayer] = React.useState<Tone.Player | null>(null)
  const [isPlay, setIsPlay] = React.useState(false)
  const [meter] = React.useState<Tone.Meter>(new Tone.Meter())

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

  React.useEffect(() => {
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
    <section className="flex flex-col items-center w-full justify-center">
      <Button onClick={handlePlay} toggled={isPlay} className="mb-4 mt-auto">
        {isPlay ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <VuMeter
        value={value}
        classNames={{
          lump: `
          data-[active=none]:bg-slate-200
          data-[active=low]:bg-indigo-700
          data-[active=medium]:bg-indigo-600
          data-[active=high]:bg-indigo-400
          dark:data-[active=none]:bg-slate-800
          dark:data-[active=low]:bg-indigo-400
          dark:data-[active=medium]:bg-indigo-500
          dark:data-[active=high]:bg-indigo-600`,
        }}
      />
    </section>
  )
}
