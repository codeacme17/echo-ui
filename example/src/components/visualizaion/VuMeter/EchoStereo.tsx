import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import { VuMeter, Button } from 'echo-ui'

const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

export const VueMeterStereo = () => {
  const [value, setValue] = useState([-60, -60])
  const [player, setPlayer] = useState<Tone.Player | null>(null)
  const [isPlay, setIsPlay] = useState(false)
  const split = new Tone.Split()
  const meterLeft = new Tone.Meter()
  const meterRight = new Tone.Meter()

  const meterRef = useRef<HTMLDivElement>(null)

  const handlePlay = () => {
    setIsPlay(!isPlay)
    if (!player) return

    if (player.state === 'started') {
      player.stop()
      return
    }

    player.volume.value = 5
    player.start()
    player.connect(split)
    split.connect(meterLeft, 0, 0)
    split.connect(meterRight, 1, 0)
    getDB()
  }

  useEffect(() => {
    const player = new Tone.Player(url).toDestination()
    setPlayer(player)

    return () => {
      player.stop()
      player.disconnect()
    }
  }, [])

  const getDB = () => {
    if (player?.state === 'stopped') {
      setValue([-60, -60])
      return
    }

    const levelLeft = meterLeft.getValue()
    const levelRight = meterRight.getValue()

    setValue([levelLeft, levelRight] as number[])
    requestAnimationFrame(getDB)
  }

  return (
    <section className="flex flex-col justify-center items-center">
      <Button disabled={!player} toggled={isPlay} className="mb-5 px-4" onClick={handlePlay}>
        Stereo
      </Button>

      <VuMeter ref={meterRef} value={value} lumpsQuantity={23} />
    </section>
  )
}
