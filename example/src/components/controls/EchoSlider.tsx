import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import { Slider, Button, Input, InputChangeEvent } from 'echo-ui'
import { Play, Square } from 'lucide-react'

const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

export const HorizontalSlider = () => {
  const [value, setValue] = useState<number>(0.1)

  const SliderRef = useRef(null)
  const handleChange = (e: InputChangeEvent) => {
    setValue(e.value)
  }

  return (
    <>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        className="mb-3 w-12 py-0 px-0 text-center rounded-none text-sm"
      />

      <Slider ref={SliderRef} className="mb-16 w-80" value={value} onChange={setValue} />
    </>
  )
}

export const DynamicSlider = () => {
  const [value, setValue] = useState<number>(-20)
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
    <section className="flex flex-col items-center">
      <Button onClick={handlePlay} disabled={!player} toggled={isPlay} className="mb-5 px-4">
        {isPlay ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <Slider className="h-80" vertical step={10} max={10} min={-60} value={value} />
    </section>
  )
}
