import { useState, useEffect, useRef } from 'react'
import { Spectrum, Button, SpectrumDataPoint } from '@echo-ui'
import * as Tone from 'tone'

export const EchoSpectrum = () => {
  // const url = '/audio/Abletunes - What I Need 130 DRY(_).wav'
  const url = '/audio/Abletunes - What I Need 130 DRY (mp3cut.net).wav'
  const [data, setData] = useState<SpectrumDataPoint[]>([])
  const [trigger, setTrigger] = useState(false)
  const analyser = useRef<Tone.Analyser>()
  const player = useRef<Tone.Player | null>(null)
  const fftSize = 512 / 2
  const sampleRate = 44100

  useEffect(() => {
    player.current = new Tone.Player(url).toDestination()
    analyser.current = new Tone.Analyser('fft', fftSize)

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
      player.current.loop = true
      player.current.start()
      setTrigger(true)
      getData()
    }
  }

  const requestId = useRef<number>(0)
  const frequencyResolution = sampleRate / fftSize

  const getData = () => {
    const spectrumData = analyser.current?.getValue()

    if (spectrumData instanceof Float32Array) {
      const formattedData = Array.from(spectrumData).map((linearAmplitude, index) => {
        const frequency = index * frequencyResolution

        return {
          frequency,
          amplitude: Math.max(-120, linearAmplitude),
        }
      })
      setData(formattedData)
    }

    requestId.current = requestAnimationFrame(getData)
  }

  return (
    <div className="max-w-[500px] min-w-[200px] w-3/4 flex flex-col items-center gap-2">
      <Spectrum data={data} shadow className="w-full" shadowHeight={10} grid fftSize={fftSize} />
      <Button onClick={handleTrigger} toggled={trigger}>
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}
