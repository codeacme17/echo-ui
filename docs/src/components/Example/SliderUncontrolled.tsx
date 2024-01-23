import React from 'react'
import { Slider, Button, useFetchAudio, useVuMeter, usePlayer } from 'echo-ui'
import { Play, Square } from 'lucide-react'

export const SliderUncontrolled = () => {
  const url = '/audios/loop-4.mp3'

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
    <section className="flex flex-col items-center">
      <Button
        onClick={handlePlay}
        disabled={pending || error}
        toggled={isPlaying}
        className="mb-5 px-4"
      >
        {isPlaying ? (
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
          value={value as number}
        />
      </div>
    </section>
  )
}
