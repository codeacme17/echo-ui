import React from 'react'
import { Spectrogram, Button, useFetchAudio, usePlayer, useSpectrogram } from 'echo-ui'

export const SpectrogramDefault = () => {
  const url = '/audios/loop-2.mp3'

  const { audioBuffer, pending, fetchAudio } = useFetchAudio({ url })
  const {
    analyser,
    data,
    init: initSpectrogram,
    observe,
    cancelObserve,
  } = useSpectrogram({ fftSize: 512 })
  const {
    isPlaying,
    init: initPlayer,
    play,
    stop,
  } = usePlayer({
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
    onStop: () => cancelObserve(),
  })

  React.useEffect(() => {
    fetchAudio()
    initSpectrogram()
  }, [])

  React.useEffect(() => {
    if (!analyser.current) return
    initPlayer(audioBuffer!, [analyser.current])
  }, [audioBuffer, analyser.current])

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
