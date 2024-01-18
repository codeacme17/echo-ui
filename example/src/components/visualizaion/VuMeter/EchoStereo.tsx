import { VuMeter, Button, usePlayer, useFetchAudio } from '@echo-ui'
import { useVuMeter } from '../../../hooks/useVuMeter.ts'

const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

export const VueMeterStereo = () => {
  const { audioBuffer, pending } = useFetchAudio({ url })
  const { value, meter, cancelObserve, observe } = useVuMeter({ value: [-60, -60] })
  const { isPlaying, play, pause } = usePlayer({
    audioBuffer,
    chain: [meter],
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
  })

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
