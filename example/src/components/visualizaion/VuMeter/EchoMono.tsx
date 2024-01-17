import * as Tone from 'tone'
import { useState } from 'react'
import { VuMeter, Button, Slider, useFetchAudio } from '@echo-ui'
import { Play, Square, Repeat, VolumeX } from 'lucide-react'
import { usePlayer } from '../../../hooks/usePlayer'

export const VuMeterMono = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

  const [meter] = useState<Tone.Meter>(new Tone.Meter())
  const { pending, error, audioBuffer } = useFetchAudio({ url })
  const {
    player,
    isReady,
    isPlaying,
    volume,
    loop,
    mute,
    setMute,
    setLoop,
    setVolume,
    getDuration,
    play,
    stop,
  } = usePlayer({
    audioBuffer,
    chain: [meter, Tone.Destination],
  })
  const [value, setValue] = useState<number | number[]>(-60)

  const handlePlay = () => {
    if (!player) return

    if (isPlaying) stop()
    else {
      play()
      getDB()
    }
  }

  const getDB = () => {
    if (player!.state === 'stopped') {
      setValue(-60)
      return
    }
    console.log(getDuration())
    setValue(meter.getValue() as number)
    requestAnimationFrame(getDB)
  }

  return (
    <section className="w-80 items-center flex flex-col">
      <Button.Group className="mb-3" disabled={pending || error || !isReady}>
        <Button onClick={handlePlay} toggled={isPlaying}>
          {isPlaying ? (
            <Square className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </Button>

        <Button className="p-2" onClick={() => setLoop(!loop)} toggled={loop}>
          <Repeat className="w-4 h-4 fill-current" />
        </Button>

        <Button className="p-2" onClick={() => setMute(!mute)} toggled={mute}>
          <VolumeX className="w-4 h-4 fill-current" />
        </Button>
      </Button.Group>

      <div className="flex gap-5">
        <div>
          <Slider
            min={-60}
            max={10}
            value={volume}
            onChange={setVolume}
            vertical
            className="h-full"
          />
        </div>
        <VuMeter value={value} onChange={setValue} lumpsQuantity={30} />
      </div>

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
