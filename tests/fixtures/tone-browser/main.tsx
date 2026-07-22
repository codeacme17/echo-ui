/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as Tone from 'tone'
import { useOscilloscope, usePlayer, useSpectrogram, useVuMeter, useWaveform } from '@nafr/echo-ui'

type DisposableToneNode = { disposed: boolean }

declare global {
  interface Window {
    __echoActiveAnimationFrames: () => number
    __echoReleasedNodes: DisposableToneNode[]
    __echoToneHarness: {
      analysis: () => {
        contextState: string
        meter: number | number[]
        oscilloscopeSamples: number
        spectrogramSamples: number
        stereoMeter: number | number[]
      }
      initAnalysis: () => Promise<void>
      initPlayer: (duration: number, amplitude: number) => void
      pausePlayer: () => void
      playPlayer: () => Promise<void>
      player: () => {
        disposedReplacedPlayers: boolean
        instanceOfConsumerTone: boolean
        isFinish: boolean
        isPlaying: boolean
        percentage: number
        time: number
        toneVersion: string
      }
      release: () => void
      seekPlayer: (time: number) => void
      setWaveform: (channels: number, amplitude: number) => void
      stopPlayer: () => void
      waveform: () => number[][]
    }
  }
}

const makeBuffer = (duration: number, amplitude: number, channels = 1) => {
  const context = Tone.getContext().rawContext
  const frameCount = Math.max(32, Math.floor(context.sampleRate * duration))
  const buffer = context.createBuffer(channels, frameCount, context.sampleRate)
  for (let channel = 0; channel < channels; channel += 1) {
    buffer.getChannelData(channel).fill(amplitude * (channel + 1))
  }
  return buffer
}

const Harness = ({ release }: { release: () => void }) => {
  const player = usePlayer()
  const oscilloscope = useOscilloscope({ fftSize: 128 })
  const spectrogram = useSpectrogram({ fftSize: 128 })
  const meter = useVuMeter({ value: -60 })
  const stereoMeter = useVuMeter({ value: [-60, -60] })
  const [waveformBuffer, setWaveformBuffer] = useState<AudioBuffer | null>(null)
  const waveform = useWaveform({ audioBuffer: waveformBuffer, channel: 2, samples: 16 })
  const analysisSource = useRef<Tone.Oscillator | null>(null)
  const replacedPlayers = useRef<Tone.Player[]>([])

  useEffect(
    () => () => {
      try {
        analysisSource.current?.stop()
      } catch {
        // The source may already be stopped during cleanup.
      }
      analysisSource.current?.dispose()
      analysisSource.current = null
    },
    [],
  )

  useEffect(() => {
    window.__echoToneHarness = {
      analysis: () => ({
        contextState: Tone.getContext().state,
        meter: meter.value,
        oscilloscopeSamples: oscilloscope.data.length,
        spectrogramSamples: spectrogram.data.length,
        stereoMeter: stereoMeter.value,
      }),
      initAnalysis: async () => {
        await Tone.start()
        oscilloscope.init()
        spectrogram.init()
        meter.init()
        stereoMeter.init()
        try {
          analysisSource.current?.stop()
        } catch {
          // A prior source may already be stopped.
        }
        analysisSource.current?.dispose()
        const source = new Tone.Oscillator({ frequency: 220, volume: -12 }).toDestination()
        source.connect(oscilloscope.analyser.current!)
        source.connect(spectrogram.analyser.current!)
        source.connect(meter.meter.current!)
        source.connect(stereoMeter.meter.current!)
        source.start()
        analysisSource.current = source
        oscilloscope.observer()
        spectrogram.observe()
        meter.observe()
        stereoMeter.observe()
      },
      initPlayer: (duration, amplitude) => {
        if (player.player.current) replacedPlayers.current.push(player.player.current)
        player.init(makeBuffer(duration, amplitude))
      },
      pausePlayer: player.pause,
      playPlayer: async () => {
        await Tone.start()
        player.play()
        player.observe()
      },
      player: () => ({
        disposedReplacedPlayers: replacedPlayers.current.every((node) => node.disposed),
        instanceOfConsumerTone: player.player.current instanceof Tone.Player,
        isFinish: player.isFinish,
        isPlaying: player.isPlaying,
        percentage: player.percentage,
        time: player.time,
        toneVersion: Tone.version,
      }),
      release: () => {
        window.__echoReleasedNodes = [
          player.player.current,
          oscilloscope.analyser.current,
          spectrogram.analyser.current,
          meter.meter.current,
          stereoMeter.meter.current,
        ].filter((node): node is DisposableToneNode => node !== null)
        release()
      },
      seekPlayer: player.setPickTime,
      setWaveform: (channels, amplitude) => setWaveformBuffer(makeBuffer(0.1, amplitude, channels)),
      stopPlayer: player.stop,
      waveform: () => waveform.data,
    }
  })

  return <output data-tone-harness="ready">{Tone.version}</output>
}

const App = () => {
  const [mounted, setMounted] = useState(true)
  return mounted ? <Harness release={() => setMounted(false)} /> : <output>released</output>
}

createRoot(document.getElementById('root')!).render(<App />)
