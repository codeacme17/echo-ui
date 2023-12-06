import { useEffect, useState } from 'react'
import * as Tone from 'tone'
import { VuMeter, Button } from 'echo-ui'

const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

export const VuMeterMonoComponent = () => {
  const [value, setValue] = useState<number | number[]>(-60)
  const [player, setPlayer] = useState<Tone.Player | null>(null)
  const [meter] = useState<Tone.Meter>(new Tone.Meter())

  const handlePlay = () => {
    if (!player) return
    player.volume.value = 5

    if (player.state === 'started') {
      player.stop()
      return
    }

    player.start()
    player.connect(meter)
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
      setValue(-60)
      return
    }
    setValue(meter.getValue() as number)
    requestAnimationFrame(getDB)
  }

  return (
    <section className="flex flex-col justify-center items-center">
      <button onClick={handlePlay} className="text-muted-foreground mb-5">
        play
      </button>
      <VuMeter value={value} lumpsQuantity={22} onValueChange={setValue} axisClassName="ml-2" />
    </section>
  )
}

export const VuMeterStereoComponent = () => {
  const [value, setValue] = useState([-60, -60])
  const [player, setPlayer] = useState<Tone.Player | null>(null)
  const split = new Tone.Split()
  const meterLeft = new Tone.Meter()
  const meterRight = new Tone.Meter()

  const handlePlay = () => {
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
    <section className="flex flex-col justify-center items-center w-20">
      <Button onClick={handlePlay} className="mb-5 rounded-full">
        Asad
      </Button>
      <VuMeter value={value} lumpsQuantity={22} axisClassName="ml-2" />
    </section>
  )
}
