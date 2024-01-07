import React from 'react'
import * as Tone from 'tone'
import { Spectrum, Button, SpectrumDataPoint } from 'echo-ui'

export const SpectrumDefault = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-3.mp3'

  const [data, setData] = React.useState<SpectrumDataPoint[]>([])
  const [trigger, setTrigger] = React.useState(false)
  const analyser = React.useRef<Tone.Analyser>()
  const player = React.useRef<Tone.Player | null>(null)

  const fftSize = 512 / 2

  React.useEffect(() => {
    player.current = new Tone.Player(url)
    analyser.current = new Tone.Analyser('fft', fftSize)
    player.current.toDestination()

    return () => {
      player.current?.disconnect()
      player.current?.dispose()
    }
  }, [])

  const handleTrigger = async () => {
    if (!player.current || !analyser.current) {
      console.error('Analyser is not initialized')
      return
    }

    if (trigger) {
      player.current.stop()
      cancelAnimationFrame(requestId.current)
      setData([])
      setTrigger(false)
    } else {
      player.current.connect(analyser.current)
      player.current.loop = true
      player.current.start()
      setTrigger(true)
      getData()
    }
  }

  const requestId = React.useRef<number>(0)

  const getData = () => {
    const spectrumData = analyser.current?.getValue()

    if (spectrumData instanceof Float32Array) {
      const formattedData = Array.from(spectrumData).map((amplitude, frequency) => {
        return { frequency, amplitude }
      })
      setData(formattedData)
    }

    requestId.current = requestAnimationFrame(getData)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Spectrum className="w-full" data={data} fftSize={fftSize} />

      <Button onClick={handleTrigger} toggled={trigger}>
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}
