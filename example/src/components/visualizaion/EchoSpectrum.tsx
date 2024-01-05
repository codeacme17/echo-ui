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
  const filterLow = useRef<Tone.Filter | null>(null)
  const filterMid = useRef<Tone.Filter | null>(null)
  const filterHigh = useRef<Tone.Filter | null>(null)

  const fftSize = 512 / 2

  const [low, setLow] = useState(0)
  const [mid, setMid] = useState(0)
  const [high, setHigh] = useState(0)

  useEffect(() => {
    player.current = new Tone.Player(url)
    analyser.current = new Tone.Analyser('fft', fftSize)
    filterLow.current = new Tone.Filter(500, 'lowshelf')
    filterMid.current = new Tone.Filter(1000, 'peaking')
    filterHigh.current = new Tone.Filter(2000, 'highshelf')

    player.current.connect(filterLow.current)
    filterLow.current.connect(filterMid.current)
    filterMid.current?.connect(filterHigh.current)
    filterHigh.current?.toDestination()

    return () => {
      player.current?.disconnect()
      player.current?.dispose()
      filterLow.current?.disconnect()
      filterLow.current?.dispose()
      filterMid.current?.disconnect()
      filterMid.current?.dispose()
      filterHigh.current?.disconnect()
      filterHigh.current?.dispose()
    }
  }, [])

  useEffect(() => {
    filterLow.current?.set({ frequency: 500, gain: low })
    filterMid.current?.set({ frequency: 1000, gain: mid })
    filterHigh.current?.set({ frequency: 2000, gain: high })
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
      filterLow.current?.connect(analyser.current)
      filterMid.current?.connect(analyser.current)
      filterHigh.current?.connect(analyser.current)
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

      <Spectrum className="w-full" data={data} fftSize={fftSize} />

      <Button onClick={handleTrigger} toggled={trigger}>
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}
