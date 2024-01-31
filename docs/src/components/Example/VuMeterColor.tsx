import React from 'react'
import { VuMeter, Button, useFetchAudio, useVuMeter, usePlayer } from 'echo-ui'
import { Play, Square } from 'lucide-react'

export const VuMeterColor = () => {
  const url = '/audios/loop-1.mp3'

  const { pending, error, audioBuffer, fetchAudio } = useFetchAudio({ url })
  const { meter, value, init: initVuMeter, observe, cancelObserve } = useVuMeter({ value: -60 })
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
  }, [audioBuffer, meter])

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

      <VuMeter
        value={value}
        classNames={{
          lump: `
          data-[active=none]:bg-slate-200
          data-[active=low]:bg-indigo-700
          data-[active=medium]:bg-indigo-600
          data-[active=high]:bg-indigo-400
          dark:data-[active=none]:bg-slate-800
          dark:data-[active=low]:bg-indigo-400
          dark:data-[active=medium]:bg-indigo-500
          dark:data-[active=high]:bg-indigo-600`,
        }}
      />
    </section>
  )
}
