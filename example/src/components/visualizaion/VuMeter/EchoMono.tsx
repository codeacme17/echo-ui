import { VuMeter, Button, Slider, useFetchAudio, usePlayer, useVuMeter } from '@nafr/echo-ui'
import { Play, Square, Pause, Repeat, VolumeX } from 'lucide-react'
import { useEffect } from 'react'
import * as Tone from 'tone'

export const VuMeterMono = () => {
  const url = '/audio/Drum Loop.wav'

  const { pending, error, audioBuffer, fetchAudio } = useFetchAudio({ url })
  const { meter, value, init: initVuMeter, observe, cancelObserve } = useVuMeter({ value: -60 })
  const {
    player,
    isReady,
    isPlaying,
    volume,
    loop,
    mute,
    init: initPlayer,
    setMute,
    setLoop,
    setVolume,
    play,
    pause,
    stop,
  } = usePlayer({
    onPlay: () => handlePlay(),
    onPause: () => handleStop(),
    onStop: () => handleStop(),
  })

  useEffect(() => {
    fetchAudio()
    initVuMeter()
  }, [])

  useEffect(() => {
    if (!audioBuffer || !meter.current) return
    initPlayer(audioBuffer, [meter.current])
  }, [audioBuffer, meter.current])

  const handlePlay = () => {
    if (!player.current) return
    observe()
  }

  const handleStop = () => {
    if (!player.current) return
    cancelObserve()
  }

  const handleTriggerPlay = async () => {
    if (!player.current) return
    await Tone.start()
    if (isPlaying) pause()
    else play()
  }

  return (
    <section
      className="w-80 items-center flex flex-col"
      data-audio-example="vu-mono"
      data-audio-state={isPlaying ? 'playing' : 'stopped'}
    >
      <Button.Group className="mb-3" disabled={pending || error || !isReady}>
        <Button
          aria-label={isPlaying ? 'Pause mono VU' : 'Start mono VU'}
          onClick={handleTriggerPlay}
          toggled={isPlaying}
        >
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
