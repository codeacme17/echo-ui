'use client'

import {
  Light,
  Oscilloscope,
  Spectrogram,
  VuMeter,
  Waveform,
  type WaveformMouseEvent,
} from '@nafr/echo-ui'
import type { FC, RefObject } from 'react'
import type { DisplayName } from './display-api'
import {
  demoAudioUrl,
  useAudioGraph,
  type AudioDisplayName,
  type AudioFrame,
} from './display-audio-graph'
import { CardDemo } from './display-card-demo'
import {
  DemoFrame,
  demoCopy,
  getStatusText,
  type AudioStatus,
  type Locale,
} from './display-demo-frame'
import styles from './display-docs.module.css'
import { LfoDemo } from './display-lfo-demo'

type AudioVisualizationProps = Readonly<{
  active: boolean
  frame: AudioFrame
  lang: Locale
  seek: (time: number) => void
}>

const OscilloscopeVisualization: FC<AudioVisualizationProps> = ({ frame, lang }) => (
  <Oscilloscope
    aria-label={lang === 'zh' ? '实时示波器' : 'Live oscilloscope'}
    className={styles.chart}
    data={frame.oscilloscope}
    amplitudeRange={[-1, 1]}
    role="img"
  />
)

const SpectrogramVisualization: FC<AudioVisualizationProps> = ({ frame, lang }) => (
  <Spectrogram
    aria-label={lang === 'zh' ? '实时频谱图' : 'Live spectrum'}
    className={styles.chart}
    data={frame.spectrum}
    fftSize={512}
    role="img"
    xAxisTicks={[50, 500, 5000, 10000]}
    yAxisTicks={[-80, -40, 0]}
    axis
    grid
    shadow
  />
)

const VuMeterVisualization: FC<AudioVisualizationProps> = ({ frame }) => (
  <div className={styles.meter}>
    <VuMeter horizontal value={frame.level} lumpsQuantity={36} />
    <output className={styles.levelValue}>{frame.level.toFixed(1)} dB</output>
  </div>
)

const LightVisualization: FC<AudioVisualizationProps> = ({ active, frame }) => (
  <div className={styles.lightReadout}>
    <Light color="oklch(72% 0.18 64)" on={active && frame.level > -42} size="2rem" />
    <output>{active ? frame.level.toFixed(1) : '−∞'} dB</output>
  </div>
)

const WaveformVisualization: FC<AudioVisualizationProps> = ({ frame, lang, seek }) => {
  const handleClick = (event: WaveformMouseEvent) => seek(event.time)
  return (
    <Waveform
      aria-label={lang === 'zh' ? '音频波形与定位控件' : 'Audio waveform and seek control'}
      className={styles.waveform}
      data={frame.waveform}
      audioDuration={frame.duration}
      percentage={frame.percentage}
      role="img"
      onClick={handleClick}
    />
  )
}

const visualizations: Record<AudioDisplayName, FC<AudioVisualizationProps>> = {
  light: LightVisualization,
  oscilloscope: OscilloscopeVisualization,
  spectrogram: SpectrogramVisualization,
  vumeter: VuMeterVisualization,
  waveform: WaveformVisualization,
}

type AudioControlsProps = Readonly<{
  audioRef: RefObject<HTMLAudioElement>
  lang: Locale
  reconnect: () => Promise<void>
  start: () => Promise<void>
  status: AudioStatus
  stop: () => Promise<void>
}>

const AudioControls: FC<AudioControlsProps> = ({
  audioRef,
  lang,
  reconnect,
  start,
  status,
  stop,
}) => {
  const labels = demoCopy[lang]
  const busy = status === 'connecting'

  return (
    <div className={styles.controls}>
      <audio ref={audioRef} preload="metadata" src={demoAudioUrl} />
      <button
        className={styles.primaryAction}
        disabled={busy || status === 'playing'}
        onClick={start}
      >
        {labels.start}
      </button>
      <button className={styles.action} disabled={busy || status !== 'playing'} onClick={stop}>
        {labels.stop}
      </button>
      <button className={styles.action} disabled={busy} onClick={reconnect}>
        {labels.reconnect}
      </button>
    </div>
  )
}

const AudioDisplayDemo: FC<{ display: AudioDisplayName; lang: Locale }> = ({ display, lang }) => {
  const graph = useAudioGraph(display)
  const Visualization = visualizations[display]

  return (
    <DemoFrame
      active={graph.active}
      connected={graph.connected}
      connectionCount={graph.connectionCount}
      display={display}
      lang={lang}
      status={getStatusText(graph.status, lang)}
      statusCode={graph.status}
    >
      <div className={styles.instrument}>
        <div className={styles.readout}>
          <Visualization active={graph.active} frame={graph.frame} lang={lang} seek={graph.seek} />
        </div>
        <AudioControls
          audioRef={graph.audioRef}
          lang={lang}
          reconnect={graph.reconnect}
          start={graph.start}
          status={graph.status}
          stop={graph.stop}
        />
      </div>
    </DemoFrame>
  )
}

type DisplayDemoProps = Readonly<{
  display: DisplayName
  lang: Locale
}>

export const DisplayDemo: FC<DisplayDemoProps> = ({ display, lang }) => {
  if (display === 'lfo') return <LfoDemo lang={lang} />
  if (display === 'card') return <CardDemo lang={lang} />
  return <AudioDisplayDemo display={display} lang={lang} />
}
