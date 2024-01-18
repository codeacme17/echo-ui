import { VuMeter, Button, Slider, useFetchAudio, usePlayer } from '@echo-ui'
import { Play, Square, Pause, Repeat, VolumeX } from 'lucide-react'
import { useVuMeter } from '../../../hooks/useVuMeter.ts'

export const VuMeterMono = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

  const { pending, error, audioBuffer } = useFetchAudio({ url })
  const { meter, value, observe, cancelObserve } = useVuMeter({ value: -60 })
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
  } = usePlayer({
    audioBuffer,
    chain: [meter],
    onPlay: () => handlePlay(),
    onPause: () => handleStop(),
    onStop: () => handleStop(),
  })

  const handlePlay = () => {
    if (!player) return
    observe()
  }

  const handleStop = () => {
    if (!player) return
    cancelObserve()
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
        <VuMeter value={value} lumpsQuantity={30} />
      </div>

      <VuMeter value={value} className="mt-10" horizontal compact lumpsQuantity={60} />
    </section>
  )
}
