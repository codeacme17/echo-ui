import React from 'react'
import * as Tone from 'tone'
import { Slider, Button } from 'echo-ui'
import { Play, Square } from 'lucide-react'

export const SliderUncontrolled = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'
  const [value, setValue] = React.useState<number>(-60)
  const [player, setPlayer] = React.useState<Tone.Player | null>(null)
  const [isPlay, setIsPlay] = React.useState(false)
  const [meter] = React.useState<Tone.Meter>(new Tone.Meter())

  React.useEffect(() => {
    const player = new Tone.Player(url).toDestination()
    setPlayer(player)

    return () => {
      player.stop()
      player.disconnect()
    }
  }, [])

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

  const getDB = () => {
    if (player?.state === 'stopped') {
      setValue(-60)
      return
    }
    setValue(meter.getValue() as number)
    requestAnimationFrame(getDB)
  }

  return (
    <section className="flex flex-col items-center">
      <Button onClick={handlePlay} disabled={!player} toggled={isPlay} className="mb-5 px-4">
        {isPlay ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <div className="h-80">
        <Slider
          className="w-2"
          hideThumb
          prohibitInteraction
          vertical
          axis
          min={-60}
          max={10}
          value={value}
        />
      </div>
    </section>
  )
}
