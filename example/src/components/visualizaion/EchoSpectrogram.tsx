import * as Tone from 'tone'
import { useState, useEffect, useRef } from 'react'
import { Spectrogram, Button, Knob, useFetchAudio, usePlayer, useSpectrogram } from '@echo-ui'

export const EchoSpectrogram = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-2.mp3'

  const filterLow = useRef<Tone.Filter>(new Tone.Filter(500, 'lowshelf'))
  const filterMid = useRef<Tone.Filter>(new Tone.Filter(1000, 'peaking'))
  const filterHigh = useRef<Tone.Filter>(new Tone.Filter(2000, 'highshelf'))
  const { audioBuffer, pending } = useFetchAudio({ url })
  const { analyser, data, observe, cancelObserve } = useSpectrogram()
  const { play, stop, isPlaying } = usePlayer({
    audioBuffer,
    chain: [filterLow.current!, filterMid.current!, filterHigh.current!, analyser],
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
    onStop: () => cancelObserve(),
  })

  const [low, setLow] = useState(0)
  const [mid, setMid] = useState(0)
  const [high, setHigh] = useState(0)

  useEffect(() => {
    filterLow.current?.set({ frequency: 500, gain: low })
    filterMid.current?.set({ frequency: 1000, gain: mid })
    filterHigh.current?.set({ frequency: 2000, gain: high })
  }, [low, mid, high])

  const handleTrigger = async () => {
    if (isPlaying) stop()
    else play()
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

      <Spectrogram className="w-full h-52" data={data} axis grid shadow />

      <Button onClick={handleTrigger} disabled={pending} toggled={isPlaying}>
        {isPlaying ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}

export const SpectrogramDefault = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-3.mp3'

  const { audioBuffer, pending } = useFetchAudio({ url })
  const { analyser, data, observe, cancelObserve } = useSpectrogram({})
  const { isPlaying, play, stop } = usePlayer({
    audioBuffer,
    chain: [analyser],
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
    onStop: () => cancelObserve(),
  })

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
