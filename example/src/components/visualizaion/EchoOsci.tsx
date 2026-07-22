import { useEffect } from 'react'
import * as Tone from 'tone'
import { Oscilloscope, Button, useOscilloscope, usePlayer, useFetchAudio } from '@nafr/echo-ui'

export const EchoOsci = () => {
  const url = '/audio/Drum Loop.wav'
  const { audioBuffer, fetchAudio, pending } = useFetchAudio({ url })
  const { init: initPlayer, isPlaying, isReady, play, pause } = usePlayer()
  const { observer, cancelObserve, analyser, init: initOscilloscope, data } = useOscilloscope()

  useEffect(() => {
    fetchAudio()
    initOscilloscope()
  }, [])

  useEffect(() => {
    if (!audioBuffer || !analyser.current) return
    initPlayer(audioBuffer, [analyser.current])
  }, [audioBuffer, analyser])

  const handleTrigger = async () => {
    await Tone.start()
    if (isPlaying) {
      pause()
      cancelObserve()
    } else {
      play()
      observer()
    }
  }

  return (
    <section
      className="flex flex-col items-center gap-2 w-1/2"
      data-audio-example="oscilloscope"
      data-audio-state={isPlaying ? 'playing' : 'stopped'}
    >
      <Oscilloscope className="w-full" data={data} amplitudeRange={[-3, 3]} />

      <Button
        aria-label={isPlaying ? 'Stop oscilloscope' : 'Start oscilloscope'}
        disabled={pending || !isReady}
        onClick={handleTrigger}
        toggled={isPlaying}
      >
        {isPlaying ? 'Stop' : 'Start'}
      </Button>
    </section>
  )
}
