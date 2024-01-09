import { useState, useEffect, useRef } from 'react'
import { Oscilloscope, Button, OscilloscopeDataPoint } from '@echo-ui'
import * as Tone from 'tone'

export const EchoOsci = () => {
  const url = '/audio/Drum Loop.wav'
  const [data, setData] = useState<OscilloscopeDataPoint[]>([])
  const [trigger, setTrigger] = useState(false)
  const analyser = useRef<Tone.Analyser>()
  const player = useRef<Tone.Player | null>(null)

  const fftSize = 512 * 2

  useEffect(() => {
    player.current = new Tone.Player(url)
    analyser.current = new Tone.Analyser('waveform', fftSize)
    player.current.toDestination()

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
      cancelAnimationFrame(requestId.current)
      setData([])
      setTrigger(false)
    } else {
      player.current?.connect(analyser.current)
      player.current.loop = true
      player.current.start()
      setTrigger(true)
      getData()
    }
  }

  const requestId = useRef<number>(0)

  const getData = () => {
    const spectrumData = analyser.current?.getValue()

    if (spectrumData instanceof Float32Array) {
      const formattedData = Array.from(spectrumData).map((amplitude, index) => {
        return { index, amplitude }
      })
      setData(formattedData)
    }

    requestId.current = requestAnimationFrame(getData)
  }

  return (
    <section className="flex flex-col items-center gap-2 w-1/2">
      <Oscilloscope className="w-full" data={data} amplitudeRange={[-3, 3]} />

      <Button onClick={handleTrigger} toggled={trigger}>
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </section>
  )
}
