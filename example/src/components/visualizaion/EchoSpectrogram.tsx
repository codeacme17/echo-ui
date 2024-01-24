import * as Tone from 'tone'
import React, { useRef } from 'react'
import { Spectrogram, Button, Knob, useFetchAudio, usePlayer, useSpectrogram } from '@echo-ui'

export const EchoSpectrogram = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-3.mp3'

  const filterLow = useRef<Tone.Filter | null>(null)
  const filterMid = useRef<Tone.Filter | null>(null)
  const filterHigh = useRef<Tone.Filter | null>(null)

  const { audioBuffer, pending, fetchAudio } = useFetchAudio({ url })
  const { analyser, data, init: initSpectrogram, observe, cancelObserve } = useSpectrogram()
  const {
    isPlaying,
    init: initPlayer,
    play,
    stop,
  } = usePlayer({
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
    onStop: () => cancelObserve(),
  })

  const LOW_FREQ = 300
  const MID_FREQ = 1500
  const HIGH_FREQ = 4000

  const [low, setLow] = React.useState(0)
  const [mid, setMid] = React.useState(0)
  const [high, setHigh] = React.useState(0)

  React.useEffect(() => {
    fetchAudio()
    initSpectrogram()
    filterLow.current = new Tone.Filter(LOW_FREQ, 'lowshelf')
    filterMid.current = new Tone.Filter(MID_FREQ, 'peaking')
    filterHigh.current = new Tone.Filter(HIGH_FREQ, 'highshelf')
  }, [])

  React.useEffect(() => {
    if (!analyser || !filterLow.current || !filterMid.current || !filterHigh.current) return
    initPlayer(audioBuffer!, [filterLow.current, filterMid.current, filterHigh.current, analyser])
  }, [audioBuffer, analyser, filterLow.current, filterMid.current, filterHigh.current])

  React.useEffect(() => {
    filterLow.current?.set({ frequency: LOW_FREQ, gain: low })
    filterMid.current?.set({ frequency: MID_FREQ, gain: mid })
    filterHigh.current?.set({ frequency: HIGH_FREQ, gain: high })
  }, [low, mid, high])

  const handleTrigger = async () => {
    if (isPlaying) stop()
    else play()
  }

  return (
    <div className="max-w-[500px] min-w-[200px] w-3/4 flex flex-col items-center gap-2">
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

      <Spectrogram className="w-full h-52" data={data} axis grid shadow />

      <Button disabled={pending} onClick={handleTrigger} toggled={isPlaying}>
        {isPlaying ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}

export const SpectrogramDefault = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-3.mp3'

  const { audioBuffer, pending, fetchAudio } = useFetchAudio({ url })
  const { analyser, data, init: initSpectrogram, observe, cancelObserve } = useSpectrogram()
  const {
    isPlaying,
    init: initPlayer,
    play,
    stop,
  } = usePlayer({
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
    onStop: () => cancelObserve(),
  })

  React.useEffect(() => {
    fetchAudio()
    initSpectrogram()
  }, [])

  React.useEffect(() => {
    if (!audioBuffer || !analyser) return
    initPlayer(audioBuffer!, [analyser])
  }, [audioBuffer, analyser])

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
