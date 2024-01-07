import React, { useState, useEffect, useRef } from 'react'
import { Spectrum, Button, SpectrumDataPoint, Knob } from '@echo-ui'
import * as Tone from 'tone'

export const EchoSpectrum = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-2.mp3'
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
      <Knob.Group
        size={60}
        trackWidth={2}
        pointerWidth={5}
        pointerHeight={5}
        min={-100}
        max={100}
        sensitivity={10}
        bilateral
      >
        <Knob topLabel="LOW" bottomLabel={`${low}`} value={low} onChange={setLow} />
        <Knob topLabel="MID" bottomLabel={`${mid}`} value={mid} onChange={setMid} />
        <Knob topLabel="HIGH" bottomLabel={`${high}`} value={high} onChange={setHigh} />
      </Knob.Group>

      <Spectrum className="w-full h-52" data={data} fftSize={fftSize} axis grid shadow />

      <Button onClick={handleTrigger} toggled={trigger}>
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}

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
    <div className="max-w-[500px] min-w-[200px] w-3/4 flex flex-col items-center gap-2">
      <Spectrum className="w-full h-52" data={data} fftSize={fftSize} axis grid shadow />

      <Button onClick={handleTrigger} toggled={trigger}>
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}
