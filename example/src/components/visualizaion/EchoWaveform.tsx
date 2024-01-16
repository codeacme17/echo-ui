import * as Tone from 'tone'
import { useEffect, useState, useRef } from 'react'
import { Waveform, WaveformClickEvent, Button } from '@echo-ui'
import { useWaveform } from '../../hooks/useWaveform'

export const EchoWaveform = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-2.mp3'

  const [percentage, setPercentage] = useState<number>(0)
  const [trigger, setTrigger] = useState(false)
  const player = useRef<Tone.Player | null>(null)

  const { fetched, pending, error, data } = useWaveform({ url, channel: 1, samples: 512 / 2 })

  useEffect(() => {
    player.current = new Tone.Player(url)
    player.current.toDestination()

    return () => {
      player.current?.stop()
      player.current?.disconnect()
      player.current?.dispose()
    }
  }, [url])

  const handleTrigger = () => {
    if (!player.current) {
      console.error('Player is not initialized')
      return
    }

    if (trigger) {
      player.current.stop()
      setTrigger(false)
    } else {
      player.current.loop = true
      player.current.start(percentage)
      setTrigger(true)
    }
  }

  const handleClick = (e: WaveformClickEvent) => {
    const newPercentage = e.percentage
    setPercentage(newPercentage)
    if (player.current && trigger) {
      player.current.stop()
      player.current.start(newPercentage)
    }
  }

  return (
    <section className="w-2/3 flex flex-col justify-center items-center">
      <Waveform
        data={data}
        className="max-w-[600px]"
        percentage={percentage}
        onClick={handleClick}
        waveHeight={100}
      />

      <Button onClick={handleTrigger} toggled={trigger} className="mt-2">
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </section>
  )
}
