import React from 'react'
import { Spectrogram, Button, useFetchAudio, usePlayer, useSpectrogram } from 'echo-ui'

export const SpectrogramDefault = () => {
  const url = '/audios/loop-2.mp3'

  const { audioBuffer, pending } = useFetchAudio({ url })
  const { analyser, data, observe, cancelObserve } = useSpectrogram({ fftSize: 512 })
  const { isPlaying, play, stop } = usePlayer({
    audioBuffer,
    chain: [analyser],
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
    onStop: () => cancelObserve(),
  })

  const handleTrigger = async () => {
    if (isPlaying) stop()
    else play()
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Spectrogram className="w-full" data={data} />

      <Button onClick={handleTrigger} disabled={pending} toggled={isPlaying}>
        {isPlaying ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}
