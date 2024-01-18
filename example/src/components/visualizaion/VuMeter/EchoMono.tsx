import * as Tone from 'tone'
import { useRef, useState } from 'react'
import { VuMeter, Button, Slider, useFetchAudio, usePlayer } from '@echo-ui'
import { Play, Square, Pause, Repeat, VolumeX } from 'lucide-react'

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
    play,
    pause,
    stop,
    // getTime,
    getPercent,
  } = usePlayer({
    audioBuffer,
    chain: [meter], // You dont need pass Destination
    onPlay: () => handlePlay(),
    onPause: () => handleStop(),
    onStop: () => handleStop(),
  })

  const [value, setValue] = useState<number | number[]>(-60)
  const reqId = useRef<number>()

  const handlePlay = () => {
    if (!player) return
    getDB()
  }

  const getDB = () => {
    setValue(meter.getValue() as number)
    console.log(getPercent())
    reqId.current = requestAnimationFrame(getDB)
  }

  const handleStop = () => {
    if (!player) return
    setValue(-60)
    cancelAnimationFrame(reqId.current!)
  }

  const handleTriggerPlay = () => {
    if (!player) return
    if (isPlaying) pause()
    else play()
  }

  return (
    <section className="w-80 items-center flex flex-col">
      <Button.Group className="mb-3" disabled={pending || error || !isReady}>
        <Button onClick={handleTriggerPlay} toggled={isPlaying}>
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </Button>

        <Button className="p-2" onClick={() => stop()}>
          <Square className="w-4 h-4 fill-current" />
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
