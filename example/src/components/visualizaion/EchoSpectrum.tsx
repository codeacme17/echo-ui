import { useState, useEffect, useRef } from 'react'
import { Spectrum, Button, SpectrumDataPoint } from '@echo-ui'
import * as Tone from 'tone'

const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'

export const EchoSpectrum = () => {
  const [data, setData] = useState<SpectrumDataPoint[]>([])
  const [trigger, setTrigger] = useState(false)

  const oscillator = useRef<Tone.Oscillator>()
  const analyser = useRef<Tone.Analyser>()
  const player = useRef<Tone.Player | null>(null)

  useEffect(() => {
    oscillator.current = new Tone.Oscillator(440, 'sine').toDestination()
    player.current = new Tone.Player(url).toDestination()
    analyser.current = new Tone.Analyser('fft', 128)
    oscillator.current.connect(analyser.current)

    return () => {
      player.current?.disconnect()
      player.current?.dispose()
    }
  }, [])

  const handleTrigger = async () => {
    if (!player.current || !analyser.current) {
      console.error('Oscillator or Analyser is not initialized')
      return
    }

    if (trigger) {
      player.current.stop()
      player.current.disconnect()
      player.current?.dispose()
      cancelAnimationFrame(requestId.current)
      setTrigger(false)
    } else {
      player.current.connect(analyser.current)
      player.current.start()
      setTrigger(true)
      getData()
    }
  }

  const requestId = useRef<number>(0)
  const getData = () => {
    const spectrumData = analyser.current?.getValue()

    if (spectrumData) {
      const formattedData = [...spectrumData].map((amplitude, index) => ({
        frequency: index,
        amplitude: amplitude as number,
      }))
      setData(formattedData)
    }

    requestId.current = requestAnimationFrame(getData)
  }

  return (
    <div className="max-w-[500px] min-w-[200px] w-3/4 flex flex-col items-center gap-2">
      <Spectrum
        data={data}
        shadow
        className="w-full"
        shadowHeight={10}
        grid
        shadowDirection="top"
      />
      <Button onClick={handleTrigger} toggled={trigger}>
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}
