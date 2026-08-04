'use client'

import { Knob, Spectrogram, type SpectrogramDataPoint } from '@nafr/echo-ui'
import { type FC, useCallback, useEffect, useRef, useState } from 'react'

type Eq3Band = 'low' | 'mid' | 'high'
type Eq3Status = 'idle' | 'connecting' | 'playing' | 'stopped' | 'error'

type ToneGraph = Readonly<{
  analyser: import('tone').Analyser
  filters: Record<Eq3Band, import('tone').Filter>
  player: import('tone').Player
}>

const bandDefinitions: ReadonlyArray<
  Readonly<{
    frequency: number
    id: Eq3Band
    label: Uppercase<Eq3Band>
    type: import('tone').FilterOptions['type']
  }>
> = [
  { frequency: 300, id: 'low', label: 'LOW', type: 'lowshelf' },
  { frequency: 1500, id: 'mid', label: 'MID', type: 'peaking' },
  { frequency: 4000, id: 'high', label: 'HIGH', type: 'highshelf' },
]

const initialGains: Record<Eq3Band, number> = { high: 0, low: 0, mid: 0 }
const basePath = process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? ''
const eq3AudioUrl = `${basePath}/audios/loop-2.mp3`

const graphStyle = { height: 160, width: 'min(100%, 560px)' } as const
const rowStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  justifyContent: 'center',
} as const

const statusText: Record<Eq3Status, string> = {
  connecting: 'Connecting',
  error: 'Audio unavailable',
  idle: 'Ready',
  playing: 'Playing',
  stopped: 'Stopped',
}

export const spectrogramEq3Source = `<SpectrogramEq3Example />

type Eq3Band = 'low' | 'mid' | 'high'
type Eq3Graph = {
  analyser: import('tone').Analyser
  filters: Record<Eq3Band, import('tone').Filter>
  player: import('tone').Player
}

const bands = [
  { id: 'low', label: 'LOW', frequency: 300, type: 'lowshelf' },
  { id: 'mid', label: 'MID', frequency: 1500, type: 'peaking' },
  { id: 'high', label: 'HIGH', frequency: 4000, type: 'highshelf' },
] as const
const basePath = process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? ''
const audioUrl = basePath + '/audios/loop-2.mp3'

function SpectrogramEq3Example() {
  const [gains, setGains] = useState<Record<Eq3Band, number>>({
    high: 0,
    low: 0,
    mid: 0,
  })
  const [data, setData] = useState<SpectrogramDataPoint[]>([])
  const [status, setStatus] = useState<'idle' | 'connecting' | 'playing' | 'stopped' | 'error'>(
    'idle',
  )
  const graphRef = useRef<Eq3Graph | null>(null)
  const frameRef = useRef(0)
  const disposedRef = useRef(false)

  const stopGraph = () => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    try {
      graphRef.current?.player.stop()
    } catch {
      // A concurrent teardown may have already stopped the player.
    }
  }

  const disposeGraph = () => {
    stopGraph()
    const graph = graphRef.current
    if (!graph) return
    graph.player.disconnect()
    graph.player.dispose()
    graph.analyser.disconnect()
    graph.analyser.dispose()
    Object.values(graph.filters).forEach((filter) => {
      filter.disconnect()
      filter.dispose()
    })
    graphRef.current = null
  }

  useEffect(() => {
    disposedRef.current = false
    return () => {
      disposedRef.current = true
      disposeGraph()
    }
  }, [])

  const observe = () => {
    const values = graphRef.current?.analyser.getValue()
    if (values instanceof Float32Array) {
      setData(
        Array.from(values, (amplitude, frequency) => ({
          amplitude: Number.isFinite(amplitude) ? amplitude : -120,
          frequency,
        })),
      )
    }
    frameRef.current = requestAnimationFrame(observe)
  }

  const updateGain = (band: Eq3Band, gain: number) => {
    setGains((current) => ({ ...current, [band]: gain }))
    graphRef.current?.filters[band].set({ gain })
  }

  const start = async () => {
    setStatus('connecting')
    try {
      const Tone = await import('tone')
      await Tone.start()
      if (!graphRef.current) {
        const filters = Object.fromEntries(
          bands.map(({ frequency, id, type }) => [
            id,
            new Tone.Filter({ frequency, gain: gains[id], type }),
          ]),
        ) as Record<Eq3Band, import('tone').Filter>
        const analyser = new Tone.Analyser('fft', 256)
        const player = new Tone.Player({ loop: true, url: audioUrl })
        player.connect(filters.low)
        filters.low.connect(filters.mid)
        filters.mid.connect(filters.high)
        filters.high.connect(analyser)
        filters.high.toDestination()
        graphRef.current = { analyser, filters, player }
      }
      await Tone.loaded()
      if (disposedRef.current || !graphRef.current) {
        disposeGraph()
        return
      }
      graphRef.current.player.start()
      observe()
      setStatus('playing')
    } catch {
      disposeGraph()
      if (!disposedRef.current) setStatus('error')
    }
  }

  const stop = () => {
    stopGraph()
    setData([])
    setStatus('stopped')
  }

  return (
    <>
      {bands.map(({ id, label }) => (
        <label key={id}>
          <Knob
            bilateral
            bottomLabel={gains[id] + ' dB'}
            max={25}
            min={-25}
            topLabel={label}
            value={gains[id]}
            onChange={(gain) => updateGain(id, gain)}
          />
          <input
            aria-label={label + ' gain'}
            max={25}
            min={-25}
            type="range"
            value={gains[id]}
            onChange={(event) => updateGain(id, Number(event.target.value))}
          />
        </label>
      ))}
      <Spectrogram amplitudeRange={[-120, 20]} axis data={data} grid shadow />
      <button
        disabled={status === 'connecting'}
        type="button"
        onClick={status === 'playing' ? stop : start}
      >
        {status === 'playing' ? 'Stop EQ3 audio' : 'Start EQ3 audio'}
      </button>
    </>
  )
}`

export const SpectrogramEq3Preview: FC = () => {
  const [gains, setGains] = useState(initialGains)
  const [spectrum, setSpectrum] = useState<SpectrogramDataPoint[]>([])
  const [status, setStatus] = useState<Eq3Status>('idle')
  const graphRef = useRef<ToneGraph | null>(null)
  const frameRef = useRef(0)
  const disposedRef = useRef(false)

  const cancelObservation = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
  }, [])

  const stopGraph = useCallback(() => {
    cancelObservation()
    try {
      graphRef.current?.player.stop()
    } catch {
      // Tone throws when a concurrent teardown already stopped the player.
    }
  }, [cancelObservation])

  const disposeGraph = useCallback(() => {
    stopGraph()
    const graph = graphRef.current
    if (!graph) return
    graph.player.disconnect()
    graph.player.dispose()
    graph.analyser.disconnect()
    graph.analyser.dispose()
    for (const filter of Object.values(graph.filters)) {
      filter.disconnect()
      filter.dispose()
    }
    graphRef.current = null
  }, [stopGraph])

  const observe = useCallback(function readSpectrum() {
    const values = graphRef.current?.analyser.getValue()
    if (values instanceof Float32Array) {
      setSpectrum(
        Array.from(values, (amplitude, frequency) => ({
          amplitude: Number.isFinite(amplitude) ? amplitude : -120,
          frequency,
        })),
      )
    }
    frameRef.current = requestAnimationFrame(readSpectrum)
  }, [])

  const start = async () => {
    setStatus('connecting')
    try {
      const Tone = await import('tone')
      await Tone.start()

      if (!graphRef.current) {
        const filters = Object.fromEntries(
          bandDefinitions.map(({ frequency, id, type }) => [
            id,
            new Tone.Filter({ frequency, gain: gains[id], type }),
          ]),
        ) as Record<Eq3Band, import('tone').Filter>
        const analyser = new Tone.Analyser('fft', 256)
        const player = new Tone.Player({ loop: true, url: eq3AudioUrl })
        player.connect(filters.low)
        filters.low.connect(filters.mid)
        filters.mid.connect(filters.high)
        filters.high.connect(analyser)
        filters.high.toDestination()
        graphRef.current = { analyser, filters, player }
      }

      await Tone.loaded()
      if (disposedRef.current || !graphRef.current) {
        disposeGraph()
        return
      }
      graphRef.current.player.start()
      observe()
      setStatus('playing')
    } catch {
      disposeGraph()
      if (!disposedRef.current) setStatus('error')
    }
  }

  const stop = () => {
    stopGraph()
    setSpectrum([])
    setStatus('stopped')
  }

  const updateGain = (band: Eq3Band, value: number) => {
    setGains((current) => ({ ...current, [band]: value }))
    graphRef.current?.filters[band].set({ gain: value })
  }

  useEffect(() => {
    disposedRef.current = false
    return () => {
      disposedRef.current = true
      disposeGraph()
    }
  }, [disposeGraph])

  return (
    <div style={{ alignItems: 'center', display: 'grid', gap: 16, justifyItems: 'center' }}>
      <div style={rowStyle}>
        {bandDefinitions.map(({ id, label }) => (
          <label
            key={id}
            style={{ alignItems: 'center', display: 'grid', gap: 8, justifyItems: 'center' }}
          >
            <Knob
              bilateral
              bottomLabel={`${gains[id]} dB`}
              max={25}
              min={-25}
              size={50}
              topLabel={label}
              value={gains[id]}
              onChange={(value) => updateGain(id, value)}
            />
            <input
              aria-label={`${label} gain`}
              max={25}
              min={-25}
              type="range"
              value={gains[id]}
              onChange={(event) => updateGain(id, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
      <div style={graphStyle}>
        <Spectrogram amplitudeRange={[-120, 20]} axis data={spectrum} grid shadow />
      </div>
      <button
        disabled={status === 'connecting'}
        type="button"
        onClick={status === 'playing' ? stop : start}
      >
        {status === 'playing' ? 'Stop EQ3 audio' : 'Start EQ3 audio'}
      </button>
      <output aria-live="polite" role="status">
        {statusText[status]}
      </output>
    </div>
  )
}
