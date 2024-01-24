import React from 'react'
import { VuMeter, Button, usePlayer, useFetchAudio, useVuMeter } from '@echo-ui'

const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

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
    if (!audioBuffer || !meter) return
    initPlayer(audioBuffer, [meter])
  }, [audioBuffer, meter])

  const handleClick = () => {
    if (isPlaying) pause()
    else play()
  }

  return (
    <section className="">
      <Button disabled={pending} toggled={isPlaying} className="mb-5 px-4" onClick={handleClick}>
        Stereo
      </Button>

      <VuMeter value={value} lumpsQuantity={50} compact />
      <VuMeter value={value} lumpsQuantity={30} horizontal className="mt-10" />
    </section>
  )
}
