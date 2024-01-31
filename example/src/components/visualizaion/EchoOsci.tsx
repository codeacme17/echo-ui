import { useEffect } from 'react'
import { Oscilloscope, Button, useOscilloscope, usePlayer, useFetchAudio } from '@echo-ui'

export const EchoOsci = () => {
  const url = '/audio/Drum Loop.wav'
  const { audioBuffer, fetchAudio } = useFetchAudio({ url })
  const { init: initPlayer, isPlaying, play, pause } = usePlayer()
  const { observer, cancelObserve, analyser, init: initOscilloscope, data } = useOscilloscope()

  useEffect(() => {
    fetchAudio()
    initOscilloscope()
  }, [])

  useEffect(() => {
    if (!audioBuffer || !analyser.current) return
    initPlayer(audioBuffer, [analyser.current])
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
    <section className="flex flex-col items-center gap-2 w-1/2">
      <Oscilloscope className="w-full" data={data} amplitudeRange={[-3, 3]} />

      <Button onClick={handleTrigger} toggled={isPlaying}>
        {isPlaying ? 'Stop' : 'Start'}
      </Button>
    </section>
  )
}
