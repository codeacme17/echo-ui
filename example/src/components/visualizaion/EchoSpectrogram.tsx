import * as Tone from 'tone'
import React, { useState, useEffect, useRef } from 'react'
import {
  Spectrogram,
  Button,
  SpectrogramDataPoint,
  Knob,
  useFetchAudio,
  usePlayer,
  useSpectrogram,
} from '@echo-ui'

export const EchoSpectrogram = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-2.mp3'

  const filterLow = useRef<Tone.Filter | null>(new Tone.Filter(500, 'lowshelf'))
  const filterMid = useRef<Tone.Filter | null>(new Tone.Filter(1000, 'peaking'))
  const filterHigh = useRef<Tone.Filter | null>(new Tone.Filter(2000, 'highshelf'))

  const { audioBuffer, pending } = useFetchAudio({ url })
  const { analyser } = useSpectrogram({})
  const { player, play, stop, isPlaying } = usePlayer({
    audioBuffer,
  })

  const [data, setData] = useState<SpectrogramDataPoint[]>([])
  const [trigger, setTrigger] = useState(false)
  const fftSize = 512 / 2

  const [low, setLow] = useState(0)
  const [mid, setMid] = useState(0)
  const [high, setHigh] = useState(0)

  useEffect(() => {
    return () => {
      filterHigh.current?.disconnect()
      filterHigh.current?.dispose()
    }
  }, [player])

  useEffect(() => {
    filterLow.current?.set({ frequency: 500, gain: low })
    filterMid.current?.set({ frequency: 1000, gain: mid })
    filterHigh.current?.set({ frequency: 2000, gain: high })
  }, [low, mid, high])

  const handleTrigger = async () => {
    if (trigger) {
      stop()
      cancelAnimationFrame(requestId.current)
      setData([])
      setTrigger(false)
    } else {
      play()
      setTrigger(true)
      getData()
    }
  }

  const requestId = useRef<number>(0)

  const getData = () => {
    const SpectrogramData = analyser?.getValue()

    console.log(SpectrogramData)

    if (SpectrogramData instanceof Float32Array) {
      const formattedData = Array.from(SpectrogramData).map((amplitude, frequency) => {
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

      <Spectrogram className="w-full h-52" data={data} fftSize={fftSize} axis grid shadow />

      <Button onClick={handleTrigger} disabled={pending} toggled={isPlaying}>
        {trigger ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}

export const SpectrogramDefault = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-3.mp3'

  const { audioBuffer, pending } = useFetchAudio({ url })
  const { analyser, data, observe, cancelObserve } = useSpectrogram({})
  const { player, play, stop, isPlaying } = usePlayer({
    audioBuffer,
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
    onStop: () => cancelObserve(),
  })

  useEffect(() => {
    player?.connect(analyser)
  }, [player, analyser])

  const handleTrigger = async () => {
    if (isPlaying) stop()
    else play()
  }

  return (
    <div className="max-w-[500px] min-w-[200px] w-3/4 flex flex-col items-center gap-2">
      <Spectrogram className="w-full h-52" data={data} axis grid shadow shadowDirection="top" />

      <Button onClick={handleTrigger} disabled={pending} toggled={isPlaying}>
        {isPlaying ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}
