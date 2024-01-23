import React from 'react'
import { Spectrogram, Button, SpectrogramDataPoint, Knob } from 'echo-ui'
import * as Tone from 'tone'

export const SpectrogramEQ3 = () => {
  const url = '/audios/loop-2.mp3'
  const [data, setData] = React.useState<SpectrogramDataPoint[]>([])
  const [trigger, setTrigger] = React.useState(false)
  const analyser = React.useRef<Tone.Analyser>()
  const player = React.useRef<Tone.Player | null>(null)
  const filterLow = React.useRef<Tone.Filter | null>(null)
  const filterMid = React.useRef<Tone.Filter | null>(null)
  const filterHigh = React.useRef<Tone.Filter | null>(null)

  const FFT_SIZE = 512 / 2
  const LOW_FREQ = 300
  const MID_FREQ = 1500
  const HIGH_FREQ = 4000

  const [low, setLow] = React.useState(0)
  const [mid, setMid] = React.useState(0)
  const [high, setHigh] = React.useState(0)

  React.useEffect(() => {
    player.current = new Tone.Player(url)
    analyser.current = new Tone.Analyser('fft', FFT_SIZE)
    filterLow.current = new Tone.Filter(LOW_FREQ, 'lowshelf')
    filterMid.current = new Tone.Filter(MID_FREQ, 'peaking')
    filterHigh.current = new Tone.Filter(HIGH_FREQ, 'highshelf')

    player.current.connect(filterLow.current)
    filterLow.current.connect(filterMid.current)
    filterMid.current?.connect(filterHigh.current)
    filterHigh.current?.toDestination()

    return () => {
      filterHigh.current?.disconnect()
      filterHigh.current?.dispose()
    }
  }, [])

  React.useEffect(() => {
    filterLow.current?.set({ frequency: LOW_FREQ, gain: low })
    filterMid.current?.set({ frequency: MID_FREQ, gain: mid })
    filterHigh.current?.set({ frequency: HIGH_FREQ, gain: high })
  }, [low, mid, high])

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
      filterHigh.current?.connect(analyser.current)
      player.current.loop = true
      player.current.start()
      setTrigger(true)
      getData()
    }
  }

  const requestId = React.useRef<number>(0)
  const getData = () => {
    const SpectrogramData = analyser.current?.getValue()

    if (SpectrogramData instanceof Float32Array) {
      const formattedData = Array.from(SpectrogramData).map((amplitude, frequency) => {
        return { frequency, amplitude }
      })
      setData(formattedData)
    }

    requestId.current = requestAnimationFrame(getData)
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Knob.Group
        size={50}
        trackWidth={2}
        pointerWidth={5}
        pointerHeight={5}
        min={-25}
        max={25}
        bilateral
      >
        <Knob topLabel="LOW" bottomLabel={`${low}`} value={low} onChange={setLow} />
        <Knob topLabel="MID" bottomLabel={`${mid}`} value={mid} onChange={setMid} />
        <Knob topLabel="HIGH" bottomLabel={`${high}`} value={high} onChange={setHigh} />
      </Knob.Group>

      <Spectrogram className="w-full h-52" data={data} fftSize={FFT_SIZE} axis grid shadow />

      <Button onClick={handleTrigger} toggled={trigger}>
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}
