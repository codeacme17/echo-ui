import * as Tone from 'tone'
import { useState } from 'react'
import { VuMeter, Button, Slider, useFetchAudio } from '@echo-ui'
import { Play, Square } from 'lucide-react'
import { usePlayer } from '../../../hooks/usePlayer'

export const VuMeterMono = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

  const { pending, error, audioBuffer } = useFetchAudio({ url })
  const { player, isReady, volume, setVolume } = usePlayer({
    audioBuffer: audioBuffer!,
  })
  const [value, setValue] = useState<number | number[]>(-60)
  const [isPlay, setIsPlay] = useState(false)
  const [meter] = useState<Tone.Meter>(new Tone.Meter())

  const handlePlay = () => {
    setIsPlay(!isPlay)
    if (!player) return

    if (player.state === 'started') {
      player.stop()
      return
    }

    player.start()
    player.connect(meter)
    getDB()
  }

  const getDB = () => {
    if (player!.state === 'stopped') {
      setValue(-60)
      return
    }
    setValue(meter.getValue() as number)
    requestAnimationFrame(getDB)
  }

  return (
    <section className="w-80">
      <Button
        disabled={pending || error || !isReady}
        onClick={handlePlay}
        toggled={isPlay}
        className="mb-5 data-[toggled=true]:bg-red-400"
      >
        {isPlay ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <Slider min={-10} max={10} value={volume} onChange={setVolume} />

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
