import { useEffect, useState } from 'react'
import * as Tone from 'tone'
import { VuMeter } from '@/copmponents/visualization/VuMeter'

const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

export const VuMeterComponent = () => {
  const [value, setValue] = useState(-60)
  const [player, setPlayer] = useState<Tone.Player | null>(null)
  const [meter] = useState<Tone.Meter>(new Tone.Meter())

  const handlePlay = () => {
    if (!player) return

    player.volume.value = 10

    if (player.state === 'started') {
      player.stop()
      player.disconnect(meter)
    } else {
      player.start()
      player.connect(meter)
      getDB()
    }
  }

  useEffect(() => {
    const player = new Tone.Player(url).toDestination()
    setPlayer(player)
  }, [url])

  const getDB = () => {
    if (player?.state === 'stopped') {
      setValue(-60)
      return
    }
    console.log(meter.getValue())
    setValue(meter.getValue() as number)
    requestAnimationFrame(getDB)
  }

  return (
    <section>
      <button onClick={handlePlay}>play</button>
      <VuMeter dB={value} lumpQuantity={30} onDBChange={setValue} />
    </section>
  )
}
