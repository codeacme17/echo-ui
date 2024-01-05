import { useState, useEffect, useRef } from 'react'
import { Spectrum, Button, SpectrumDataPoint, Knob } from '@echo-ui'
import * as Tone from 'tone'

export const EchoSpectrum = () => {
  // const url = '/audio/Abletunes - What I Need 130 DRY(_).wav'
  const url = '/audio/Abletunes - What I Need 130 DRY.wav'
  const [data, setData] = useState<SpectrumDataPoint[]>([])
  const [trigger, setTrigger] = useState(false)
  const analyser = useRef<Tone.Analyser>()
  const player = useRef<Tone.Player | null>(null)
  const fftSize = 512 * 2
  const eq3 = useRef<Tone.EQ3 | null>(null)

  const [low, setLow] = useState(0)
  const [mid, setMid] = useState(0)
  const [high, setHigh] = useState(0)

  useEffect(() => {
    player.current = new Tone.Player(url)
    analyser.current = new Tone.Analyser('fft', fftSize)
    eq3.current = new Tone.EQ3()

    player.current.connect(eq3.current)
    eq3.current.toDestination()

    return () => {
      player.current?.disconnect()
      player.current?.dispose()
      eq3.current?.disconnect()
      eq3.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if (eq3.current) {
      eq3.current.low.value = low
      eq3.current.mid.value = mid
      eq3.current.high.value = high
    }
  }, [low, mid, high])

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
      eq3.current?.connect(analyser.current)
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
      const formattedData = Array.from(spectrumData).map((amplitude, frequency) => {
        return { frequency, amplitude }
      })
      setData(formattedData)
    }

    requestId.current = requestAnimationFrame(getData)
  }

  return (
    <div className="max-w-[500px] min-w-[200px] w-3/4 flex flex-col items-center gap-2">
      <div className="flex gap-7">
        <Knob
          topLabel="LOW"
          bottomLabel={`${low}`}
          value={low}
          onChange={setLow}
          size={40}
          trackWidth={2}
          pointerWidth={5}
          pointerHeight={5}
          min={-100}
          max={100}
          sensitivity={10}
        />
        <Knob
          topLabel="MID"
          bottomLabel={`${mid}`}
          value={mid}
          onChange={setMid}
          size={40}
          trackWidth={2}
          pointerWidth={5}
          pointerHeight={5}
          min={-100}
          max={100}
          sensitivity={10}
        />
        <Knob
          topLabel="HIGH"
          bottomLabel={`${high}`}
          value={high}
          onChange={setHigh}
          size={40}
          trackWidth={2}
          pointerWidth={5}
          pointerHeight={5}
          min={-100}
          max={100}
          sensitivity={10}
        />
      </div>

      <Spectrum
        data={data}
        shadow
        className="w-full"
        shadowHeight={100}
        lineWidth={1}
        grid
        fftSize={fftSize}
      />
      <Button onClick={handleTrigger} toggled={trigger}>
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}
