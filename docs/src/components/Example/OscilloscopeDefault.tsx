import * as React from 'react'
import { Oscilloscope, Button, useFetchAudio, usePlayer, useOscilloscope } from 'echo-ui'

export const OscilloscopeDefault = () => {
  const url = '/audios/loop-5.mp3'
  const { audioBuffer, fetchAudio } = useFetchAudio({ url })
  const { init: initPlayer, isPlaying, play, pause } = usePlayer()
  const { observer, cancelObserve, analyser, init: initOscilloscope, data } = useOscilloscope()

  React.useEffect(() => {
    fetchAudio()
    initOscilloscope()
  }, [])

  React.useEffect(() => {
    if (!audioBuffer || !analyser) return
    initPlayer(audioBuffer, [analyser])
  }, [audioBuffer, analyser])

  const handleTrigger = () => {
    if (isPlaying) {
      pause()
      cancelObserve()
    } else {
      play()
      observer()
    }
  }

  return (
    <section className="flex flex-col items-center gap-2 w-full">
      <Oscilloscope className="w-full" data={data} amplitudeRange={[-5, 5]} />

      <Button onClick={handleTrigger} toggled={isPlaying}>
        {isPlaying ? 'Stop' : 'Start'}
      </Button>
    </section>
  )
}
