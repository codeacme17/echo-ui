import React from 'react'
import { VuMeter, Button, useFetchAudio, useVuMeter, usePlayer } from 'echo-ui'
import { Play, Square } from 'lucide-react'

export const VuMeterDefault = () => {
  const url = '/audios/loop-1.mp3'

  const { pending, error, audioBuffer } = useFetchAudio({ url })
  const { meter, value, observe, cancelObserve } = useVuMeter({ value: -60 })
  const { player, isPlaying, play, stop } = usePlayer({
    audioBuffer,
    chain: [meter],
    onPlay: observe,
    onStop: cancelObserve,
  })

  const handlePlay = () => {
    if (!player) return

    if (isPlaying) stop()
    else play()
  }

  return (
    <section className="flex flex-col items-center w-full justify-center">
      <Button
        disabled={pending || error}
        onClick={handlePlay}
        toggled={isPlaying}
        className="mb-4 mt-auto"
      >
        {isPlaying ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <VuMeter value={value} />
    </section>
  )
}
