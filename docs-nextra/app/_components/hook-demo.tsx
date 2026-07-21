'use client'

import {
  Oscilloscope,
  Spectrogram,
  VuMeter,
  Waveform,
  useFetchAudio,
  useOscilloscope,
  usePlayer,
  useSpectrogram,
  useVuMeter,
  useWaveform,
} from '@nafr/echo-ui'
import {
  type ChangeEvent,
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import type { Locale } from './api-reference'
import styles from './display-docs.module.css'
import type { HookName } from './hook-api'

type AudioSource = 'bundled' | 'unavailable'
type HookDemoStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'stopped' | 'error'
type ActiveHookName = 'useOscilloscope' | 'usePlayer' | 'useSpectrogram' | 'useVuMeter'

const basePath = process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? ''

const sourceUrls: Record<AudioSource, string> = {
  bundled: `${basePath}/audios/demo-loop.mp3`,
  unavailable: `${basePath}/audios/unavailable-demo.mp3`,
}

const copy = {
  en: {
    bundled: 'Bundled audio loop',
    error: 'Unavailable source could not be loaded. Choose the bundled loop and try again.',
    fail: 'Simulate graph failure',
    idle: 'Choose a source, then start from a user action.',
    load: 'Load audio',
    loading: 'Requesting and decoding audio…',
    playing: 'Audio and observation are running.',
    prepare: 'Prepare audio',
    ready: 'Decoded audio ready',
    source: 'Audio source',
    start: 'Start',
    stop: 'Stop and release',
    stopped: 'Playback, graph nodes, and animation work released.',
    unavailable: 'Unavailable source',
    waveform: 'Generate waveform',
  },
  zh: {
    bundled: '内置音频循环',
    error: '不可用的音频源无法加载。请选择内置音频循环后重试。',
    fail: '模拟音频图故障',
    idle: '选择音频源，然后通过用户操作启动。',
    load: '加载音频',
    loading: '正在请求并解码音频…',
    playing: '音频与监听任务正在运行。',
    prepare: '准备音频',
    ready: '解码后的音频已就绪',
    source: '音频源',
    start: '开始',
    stop: '停止并释放',
    stopped: '播放、音频图节点与动画任务已释放。',
    unavailable: '不可用的音频源',
    waveform: '生成波形',
  },
} as const

const statusText = (status: HookDemoStatus, lang: Locale) => copy[lang][status]

type DemoShellProps = Readonly<{
  active: boolean
  children: ReactNode
  connected: boolean
  connectionCount?: number
  hook: HookName
  lang: Locale
  onSourceChange: (source: AudioSource) => void
  source: AudioSource
  status: HookDemoStatus
}>

const DemoShell: FC<DemoShellProps> = ({
  active,
  children,
  connected,
  connectionCount = 0,
  hook,
  lang,
  onSourceChange,
  source,
  status,
}) => {
  const labels = copy[lang]
  const sourceId = useId()

  const changeSource = (event: ChangeEvent<HTMLSelectElement>) => {
    onSourceChange(event.target.value as AudioSource)
  }

  return (
    <section
      className={styles.demo}
      data-animation-active={active}
      data-audio-state={status}
      data-connection-count={connectionCount}
      data-graph-connected={connected}
      data-hook-demo={hook}
      data-source={source}
    >
      <header className={styles.demoHeader}>
        <span className={styles.signalLabel}>{lang === 'zh' ? '预览' : 'Preview'}</span>
        <p className={styles.demoStatus} aria-live="polite">
          {statusText(status, lang)}
        </p>
      </header>
      <div className={styles.instrument}>
        <div className={styles.parameterGrid}>
          <label htmlFor={sourceId}>
            {labels.source}
            <select id={sourceId} onChange={changeSource} value={source}>
              <option value="bundled">{labels.bundled}</option>
              <option value="unavailable">{labels.unavailable}</option>
            </select>
          </label>
        </div>
        {children}
      </div>
    </section>
  )
}

type StaticSessionProps = Readonly<{
  lang: Locale
  onStatusChange: (status: HookDemoStatus) => void
  source: AudioSource
  status: HookDemoStatus
}>

const FetchAudioSession: FC<StaticSessionProps> = ({ lang, onStatusChange, source, status }) => {
  const labels = copy[lang]
  const [requested, setRequested] = useState(false)
  const { audioBuffer, error, fetchAudio } = useFetchAudio({ url: sourceUrls[source] })

  useEffect(() => {
    if (audioBuffer) onStatusChange('ready')
  }, [audioBuffer, onStatusChange])

  useEffect(() => {
    if (error) onStatusChange('error')
  }, [error, onStatusChange])

  const load = async () => {
    setRequested(true)
    onStatusChange('loading')
    await fetchAudio()
  }

  return (
    <>
      <div className={styles.hookSummary} aria-live="polite">
        <output>{statusText(status, lang)}</output>
        {audioBuffer && (
          <output>
            {audioBuffer.duration.toFixed(2)} s · {audioBuffer.numberOfChannels}{' '}
            {lang === 'zh' ? '声道' : audioBuffer.numberOfChannels === 1 ? 'channel' : 'channels'}
          </output>
        )}
      </div>
      <div className={styles.controls}>
        <button
          className={styles.primaryAction}
          disabled={status === 'loading'}
          onClick={load}
          type="button"
        >
          {labels.load}
        </button>
      </div>
      {requested && status === 'error' && (
        <p className={styles.feedback} role="alert">
          {labels.error}
        </p>
      )}
    </>
  )
}

const WaveformSession: FC<StaticSessionProps> = ({ lang, onStatusChange, source, status }) => {
  const labels = copy[lang]
  const [requested, setRequested] = useState(false)
  const fetchedAudio = useFetchAudio({ url: sourceUrls[source] })
  const waveform = useWaveform({ audioBuffer: fetchedAudio.audioBuffer, channel: 1, samples: 256 })

  useEffect(() => {
    if (waveform.data.length > 0) onStatusChange('ready')
  }, [onStatusChange, waveform.data])

  useEffect(() => {
    if (fetchedAudio.error || waveform.error) onStatusChange('error')
  }, [fetchedAudio.error, onStatusChange, waveform.error])

  const load = async () => {
    setRequested(true)
    onStatusChange('loading')
    await fetchedAudio.fetchAudio()
  }

  return (
    <>
      <div className={styles.readout}>
        {waveform.data.length > 0 ? (
          <Waveform
            aria-label={lang === 'zh' ? '生成的音频波形' : 'Generated audio waveform'}
            audioDuration={waveform.audioDuration.current}
            className={styles.waveform}
            data={waveform.data}
            role="img"
          />
        ) : (
          <output className={styles.hookSummary}>{statusText(status, lang)}</output>
        )}
      </div>
      <div className={styles.controls}>
        <button
          className={styles.primaryAction}
          disabled={status === 'loading'}
          onClick={load}
          type="button"
        >
          {labels.waveform}
        </button>
      </div>
      {requested && status === 'error' && (
        <p className={styles.feedback} role="alert">
          {labels.error}
        </p>
      )}
    </>
  )
}

const StaticHookDemo: FC<{ hook: 'useFetchAudio' | 'useWaveform'; lang: Locale }> = ({
  hook,
  lang,
}) => {
  const [source, setSource] = useState<AudioSource>('bundled')
  const [status, setStatus] = useState<HookDemoStatus>('idle')

  const changeSource = (nextSource: AudioSource) => {
    setStatus('idle')
    setSource(nextSource)
  }

  const Session = hook === 'useFetchAudio' ? FetchAudioSession : WaveformSession

  return (
    <DemoShell
      active={false}
      connected={false}
      hook={hook}
      lang={lang}
      onSourceChange={changeSource}
      source={source}
      status={status}
    >
      <Session key={source} lang={lang} onStatusChange={setStatus} source={source} status={status} />
    </DemoShell>
  )
}

type ActiveSessionCallbacks = Readonly<{
  onConnected: () => void
  onError: () => void
  onPlaying: () => void
  onRelease: () => void
  onStatusChange: (status: HookDemoStatus) => void
}>

type ActiveSessionProps = ActiveSessionCallbacks &
  Readonly<{
    lang: Locale
    source: AudioSource
    status: HookDemoStatus
  }>

type ActiveControlsProps = Readonly<{
  lang: Locale
  onFail: () => void
  onPrepare: () => Promise<void>
  onStart: () => Promise<void>
  onStop: () => void
  status: HookDemoStatus
}>

const ActiveControls: FC<ActiveControlsProps> = ({
  lang,
  onFail,
  onPrepare,
  onStart,
  onStop,
  status,
}) => {
  const labels = copy[lang]

  return (
    <div className={styles.controls}>
      <button
        className={styles.action}
        disabled={status === 'loading' || status === 'playing'}
        onClick={onPrepare}
        type="button"
      >
        {labels.prepare}
      </button>
      <button
        className={styles.primaryAction}
        disabled={status !== 'ready'}
        onClick={onStart}
        type="button"
      >
        {labels.start}
      </button>
      <button
        className={styles.action}
        disabled={status !== 'playing'}
        onClick={onStop}
        type="button"
      >
        {labels.stop}
      </button>
      <button
        className={styles.action}
        disabled={status !== 'playing'}
        onClick={onFail}
        type="button"
      >
        {labels.fail}
      </button>
    </div>
  )
}

type PlayerChainNode = NonNullable<Parameters<ReturnType<typeof usePlayer>['init']>[1]>[number]

type AnalysisAdapter = Readonly<{
  cancel: () => void
  error: boolean
  getNode: () => PlayerChainNode | null
  init: () => void
  observe: () => void
  visualization: ReactNode
}>

type ActiveAudioSessionOptions = ActiveSessionCallbacks &
  Readonly<{
    analysis?: AnalysisAdapter
    source: AudioSource
  }>

const useActiveAudioSession = ({
  analysis,
  onConnected,
  onError,
  onPlaying,
  onRelease,
  onStatusChange,
  source,
}: ActiveAudioSessionOptions) => {
  const initialized = useRef(false)
  const cleanupRef = useRef<() => void>(() => undefined)
  const fetchedAudio = useFetchAudio({ onError, url: sourceUrls[source] })
  const player = usePlayer({ onError })

  cleanupRef.current = () => {
    analysis?.cancel()
    player.cancelObserve()
  }

  useEffect(() => () => cleanupRef.current(), [])

  useEffect(() => {
    if (analysis?.error) onError()
  }, [analysis?.error, onError])

  useEffect(() => {
    if (!fetchedAudio.audioBuffer || initialized.current) return
    initialized.current = true
    analysis?.init()
    const node = analysis?.getNode() ?? null
    if (analysis && !node) {
      onError()
      return
    }
    player.init(fetchedAudio.audioBuffer, node ? [node] : [])
    onConnected()
  }, [analysis, fetchedAudio.audioBuffer, onConnected, onError, player])

  const prepare = async () => {
    onStatusChange('loading')
    await fetchedAudio.fetchAudio()
  }

  const start = async () => {
    try {
      await player.player.current?.context.resume()
      player.play()
      player.observe()
      analysis?.observe()
      onPlaying()
    } catch {
      onError()
    }
  }

  const stop = () => {
    analysis?.cancel()
    player.cancelObserve()
    player.stop()
    onRelease()
  }

  return { fail: onError, player, prepare, start, stop }
}

const PlayerSession: FC<ActiveSessionProps> = (props) => {
  const session = useActiveAudioSession(props)

  return (
    <>
      <div className={styles.hookSummary} aria-live="polite">
        <output>{statusText(props.status, props.lang)}</output>
        <output>
          {session.player.time.toFixed(2)} s · {session.player.percentage.toFixed(1)}%
        </output>
      </div>
      <ActiveControls
        lang={props.lang}
        onFail={session.fail}
        onPrepare={session.prepare}
        onStart={session.start}
        onStop={session.stop}
        status={props.status}
      />
      {props.status === 'error' && (
        <p className={styles.feedback} role="alert">
          {copy[props.lang].error}
        </p>
      )}
    </>
  )
}

type AnalyzerSessionProps = ActiveSessionProps & Readonly<{ analysis: AnalysisAdapter }>

const AnalyzerSession: FC<AnalyzerSessionProps> = (props) => {
  const session = useActiveAudioSession(props)

  return (
    <>
      <div className={styles.readout}>{props.analysis.visualization}</div>
      <ActiveControls
        lang={props.lang}
        onFail={session.fail}
        onPrepare={session.prepare}
        onStart={session.start}
        onStop={session.stop}
        status={props.status}
      />
      {props.status === 'error' && (
        <p className={styles.feedback} role="alert">
          {copy[props.lang].error}
        </p>
      )}
    </>
  )
}

const OscilloscopeSession: FC<ActiveSessionProps> = (props) => {
  const analysis = useOscilloscope({ onError: props.onError })
  return (
    <AnalyzerSession
      {...props}
      analysis={{
        cancel: analysis.cancelObserve,
        error: analysis.error,
        getNode: () => analysis.analyser.current,
        init: analysis.init,
        observe: analysis.observer,
        visualization: (
          <Oscilloscope
            aria-label={props.lang === 'zh' ? 'Hook 实时示波器' : 'Live Hook oscilloscope'}
            amplitudeRange={[-1, 1]}
            className={styles.chart}
            data={analysis.data}
            role="img"
          />
        ),
      }}
    />
  )
}

const SpectrogramSession: FC<ActiveSessionProps> = (props) => {
  const analysis = useSpectrogram({ fftSize: 512, onError: props.onError })
  return (
    <AnalyzerSession
      {...props}
      analysis={{
        cancel: analysis.cancelObserve,
        error: analysis.error,
        getNode: () => analysis.analyser.current,
        init: analysis.init,
        observe: analysis.observe,
        visualization: (
          <Spectrogram
            aria-label={props.lang === 'zh' ? 'Hook 实时频谱图' : 'Live Hook spectrum'}
            axis
            className={styles.chart}
            data={analysis.data}
            fftSize={512}
            role="img"
          />
        ),
      }}
    />
  )
}

const VuMeterSession: FC<ActiveSessionProps> = (props) => {
  const analysis = useVuMeter({ onError: props.onError, value: -60 })
  return (
    <AnalyzerSession
      {...props}
      analysis={{
        cancel: analysis.cancelObserve,
        error: analysis.error,
        getNode: () => analysis.meter.current,
        init: analysis.init,
        observe: analysis.observe,
        visualization: (
          <div className={styles.meter}>
            <VuMeter horizontal lumpsQuantity={36} value={analysis.value} />
            <output className={styles.levelValue}>
              {typeof analysis.value === 'number' ? analysis.value.toFixed(1) : 'stereo'} dB
            </output>
          </div>
        ),
      }}
    />
  )
}

const ActiveHookDemo: FC<{ hook: ActiveHookName; lang: Locale }> = ({ hook, lang }) => {
  const [source, setSource] = useState<AudioSource>('bundled')
  const [status, setStatus] = useState<HookDemoStatus>('idle')
  const [active, setActive] = useState(false)
  const [connected, setConnected] = useState(false)
  const [connectionCount, setConnectionCount] = useState(0)
  const [sessionVersion, setSessionVersion] = useState(0)

  const onConnected = useCallback(() => {
    setConnected(true)
    setConnectionCount((count) => count + 1)
    setStatus('ready')
  }, [])

  const onError = useCallback(() => {
    setActive(false)
    setConnected(false)
    setStatus('error')
    setSessionVersion((version) => version + 1)
  }, [])

  const onPlaying = useCallback(() => {
    setActive(true)
    setConnected(true)
    setStatus('playing')
  }, [])

  const onRelease = useCallback(() => {
    setActive(false)
    setConnected(false)
    setStatus('stopped')
    setSessionVersion((version) => version + 1)
  }, [])

  const changeSource = (nextSource: AudioSource) => {
    setActive(false)
    setConnected(false)
    setStatus('idle')
    setSource(nextSource)
    setSessionVersion((version) => version + 1)
  }

  const sessionProps: ActiveSessionProps = {
    lang,
    onConnected,
    onError,
    onPlaying,
    onRelease,
    onStatusChange: setStatus,
    source,
    status,
  }

  const session =
    hook === 'useOscilloscope' ? (
      <OscilloscopeSession {...sessionProps} />
    ) : hook === 'useSpectrogram' ? (
      <SpectrogramSession {...sessionProps} />
    ) : hook === 'useVuMeter' ? (
      <VuMeterSession {...sessionProps} />
    ) : (
      <PlayerSession {...sessionProps} />
    )

  return (
    <DemoShell
      active={active}
      connected={connected}
      connectionCount={connectionCount}
      hook={hook}
      lang={lang}
      onSourceChange={changeSource}
      source={source}
      status={status}
    >
      <div key={`${source}-${sessionVersion}`}>{session}</div>
    </DemoShell>
  )
}

type HookDemoProps = Readonly<{
  hook: HookName
  lang: Locale
}>

export const HookDemo: FC<HookDemoProps> = ({ hook, lang }) => {
  if (hook === 'useFetchAudio' || hook === 'useWaveform') {
    return <StaticHookDemo hook={hook} lang={lang} />
  }
  return <ActiveHookDemo hook={hook} lang={lang} />
}
