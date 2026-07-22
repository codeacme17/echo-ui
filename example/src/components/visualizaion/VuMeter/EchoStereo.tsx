import React from 'react'
import * as Tone from 'tone'
import { VuMeter, Button, usePlayer, useFetchAudio, useVuMeter } from '@nafr/echo-ui'

const url = '/audio/Drum Loop.wav'

export const VueMeterStereo = () => {
  const { audioBuffer, pending, fetchAudio } = useFetchAudio({ url })
  const {
    value,
    meter,
    init: initVuMeter,
    observe,
    cancelObserve,
  } = useVuMeter({ value: [-60, -60] })
  const {
    isReady,
    isPlaying,
    init: initPlayer,
    play,
    pause,
  } = usePlayer({
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
  })

  React.useEffect(() => {
    fetchAudio()
    initVuMeter()
  }, [])

  React.useEffect(() => {
    if (!audioBuffer || !meter.current) return
    initPlayer(audioBuffer, [meter.current])
  }, [audioBuffer, meter.current])

  const handleClick = async () => {
    await Tone.start()
    if (isPlaying) pause()
    else play()
  }

  return (
    <section data-audio-example="vu-stereo" data-audio-state={isPlaying ? 'playing' : 'stopped'}>
      <Button
        aria-label={isPlaying ? 'Pause stereo VU' : 'Start stereo VU'}
        disabled={pending || !isReady}
        toggled={isPlaying}
        className="mb-5 px-4"
        onClick={handleClick}
      >
        Stereo
      </Button>

      <VuMeter value={value} lumpsQuantity={50} compact />
      <VuMeter value={value} lumpsQuantity={30} horizontal className="mt-10" />
    </section>
  )
}
