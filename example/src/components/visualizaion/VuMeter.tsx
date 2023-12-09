import { useEffect, useState } from 'react'
import * as Tone from 'tone'
import { VuMeter, Button } from 'echo-ui'
import { Play, Square, Circle } from 'lucide-react'

const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

export const VuMeterMonoComponent = () => {
  const [value, setValue] = useState<number | number[]>(-60)
  const [player, setPlayer] = useState<Tone.Player | null>(null)
  const [isPlay, setIsPlay] = useState(false)
  const [meter] = useState<Tone.Meter>(new Tone.Meter())

  const handlePlay = () => {
    setIsPlay(!isPlay)
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
      <Button onClick={handlePlay} disabled={!player} isToggled={isPlay} className="mb-5 px-4">
        {isPlay ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <VuMeter
        showAxis
        value={value}
        lumpsQuantity={22}
        onChange={setValue}
        axisProps={{
          className: 'ml-2',
        }}
      />
    </section>
  )
}

export const VuMeterStereoComponent = () => {
  const [value, setValue] = useState([-60, -60])
  const [player, setPlayer] = useState<Tone.Player | null>(null)
  const [isPlay, setIsPlay] = useState(false)
  const split = new Tone.Split()
  const meterLeft = new Tone.Meter()
  const meterRight = new Tone.Meter()

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
    <section className="flex flex-col justify-center items-center w-20">
      <Button onClick={handlePlay} disabled={!player} isToggled={isPlay} className="mb-5 px-4">
        {isPlay ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <VuMeter value={value} lumpsQuantity={22} />
    </section>
  )
}

export const VuMeterRecordComponent = () => {
  const [value, setValue] = useState<number | number[]>(-60)
  const [player, setPlayer] = useState<Tone.Player | null>(null)
  const [isPlay, setIsPlay] = useState(false)
  const [meter] = useState<Tone.Meter>(new Tone.Meter())

  const handlePlay = () => {
    setIsPlay(!isPlay)
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
      <Button
        onClick={handlePlay}
        disabled={!player}
        isToggled={isPlay}
        toggledClassName="bg-rose-500 dark:bg-red-600"
        className="mb-5 px-2"
      >
        <Circle className="w-4 h-4 fill-current" />
      </Button>

      <VuMeter value={value} lumpsQuantity={22} onChange={setValue} />
    </section>
  )
}
