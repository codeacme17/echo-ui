import React from 'react'
import { VuMeter, Button, useFetchAudio, useVuMeter, usePlayer } from 'echo-ui'
import { Play, Square } from 'lucide-react'

export const VuMeterStereo = () => {
  const url = '/audios/loop-1.mp3'

  const { pending, error, audioBuffer, fetchAudio } = useFetchAudio({ url })
  const {
    meter,
    value,
    init: initVuMeter,
    observe,
    cancelObserve,
  } = useVuMeter({ value: [-60, -60] })
  const {
    player,
    isPlaying,
    play,
    stop,
    init: initPlayer,
  } = usePlayer({
    onPlay: observe,
    onStop: cancelObserve,
  })

  React.useEffect(() => {
    fetchAudio()
    initVuMeter()
  }, [])

  React.useEffect(() => {
    if (!audioBuffer || !meter.current) return
    initPlayer(audioBuffer, [meter.current])
  }, [audioBuffer, meter.current])

  const handlePlay = () => {
    if (!player) return

    if (isPlaying) stop()
    else play()
  }

  return (
    <section className="flex flex-col justify-center items-center">
      <Button disabled={pending || error} onClick={handlePlay} toggled={isPlaying} className="mb-5">
        {isPlaying ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <VuMeter value={value} lumpsQuantity={30} />
    </section>
  )
}
