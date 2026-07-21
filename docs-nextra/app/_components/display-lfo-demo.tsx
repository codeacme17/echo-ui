'use client'

import { LFO, type LFOProps } from '@nafr/echo-ui'
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DemoFrame,
  demoCopy,
  getStatusText,
  type AudioStatus,
  type Locale,
} from './display-demo-frame'
import styles from './display-docs.module.css'

type LfoNodes = Readonly<{
  carrier: OscillatorNode
  depth: GainNode
  modulator: OscillatorNode
  output: GainNode
}>

export const LfoDemo: FC<{ lang: Locale }> = ({ lang }) => {
  const [amplitude, setAmplitude] = useState(0.55)
  const [connectionCount, setConnectionCount] = useState(0)
  const [frequency, setFrequency] = useState(3)
  const [status, setStatus] = useState<AudioStatus>('idle')
  const [type, setType] = useState<LFOProps['type']>('sine')
  const contextRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<LfoNodes | null>(null)

  const stopNodes = useCallback(() => {
    const nodes = nodesRef.current
    if (!nodes) return
    try {
      nodes.carrier.stop()
      nodes.modulator.stop()
    } catch {
      // Oscillators may already be stopped during strict-mode cleanup.
    }
    nodes.carrier.disconnect()
    nodes.modulator.disconnect()
    nodes.depth.disconnect()
    nodes.output.disconnect()
    nodesRef.current = null
  }, [])

  const ensureContext = useCallback(async () => {
    let context = contextRef.current
    if (!context || context.state === 'closed') {
      context = new AudioContext()
      contextRef.current = context
      setConnectionCount((count) => count + 1)
    }
    await context.resume()
    return context
  }, [])

  const closeContext = useCallback(async () => {
    const context = contextRef.current
    contextRef.current = null
    if (context && context.state !== 'closed') await context.close()
  }, [])

  const createNodes = useCallback(
    (context: AudioContext) => {
      const carrier = context.createOscillator()
      const modulator = context.createOscillator()
      const depth = context.createGain()
      const output = context.createGain()
      carrier.frequency.value = 220
      modulator.frequency.value = frequency
      modulator.type = type ?? 'sine'
      depth.gain.value = amplitude * 42
      output.gain.value = 0.035
      modulator.connect(depth).connect(carrier.frequency)
      carrier.connect(output).connect(context.destination)
      const nodes = { carrier, depth, modulator, output }
      nodesRef.current = nodes
      return nodes
    },
    [amplitude, frequency, type],
  )

  const start = useCallback(async () => {
    try {
      stopNodes()
      const nodes = createNodes(await ensureContext())
      nodes.carrier.start()
      nodes.modulator.start()
      setStatus('playing')
    } catch {
      stopNodes()
      setStatus('error')
    }
  }, [createNodes, ensureContext, stopNodes])

  const stop = useCallback(async () => {
    stopNodes()
    const context = contextRef.current
    if (context?.state === 'running') await context.suspend()
    setStatus('stopped')
  }, [stopNodes])

  const reconnect = useCallback(async () => {
    try {
      stopNodes()
      await closeContext()
      createNodes(await ensureContext())
      setStatus('ready')
    } catch {
      stopNodes()
      try {
        await closeContext()
      } catch {
        // The context may already be closing after a failed resume.
      }
      setStatus('error')
    }
  }, [closeContext, createNodes, ensureContext, stopNodes])

  useEffect(() => {
    const nodes = nodesRef.current
    if (!nodes) return
    nodes.modulator.frequency.value = frequency
    nodes.modulator.type = type ?? 'sine'
    nodes.depth.gain.value = amplitude * 42
  }, [amplitude, frequency, type])

  useEffect(
    () => () => {
      stopNodes()
      void closeContext()
    },
    [closeContext, stopNodes],
  )

  return (
    <DemoFrame
      active={status === 'playing'}
      connected={status === 'playing' || status === 'ready'}
      connectionCount={connectionCount}
      display="lfo"
      lang={lang}
      status={getStatusText(status, lang)}
      statusCode={status}
    >
      <div className={styles.instrument}>
        <div className={styles.readout}>
          <LFO amplitude={amplitude} className={styles.lfo} frequency={frequency} type={type} />
        </div>
        <div className={styles.parameterGrid}>
          <label>
            <span>{lang === 'zh' ? '波形' : 'Shape'}</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as LFOProps['type'])}
            >
              <option value="sine">Sine</option>
              <option value="square">Square</option>
              <option value="triangle">Triangle</option>
            </select>
          </label>
          <label>
            <span>
              {lang === 'zh' ? '频率' : 'Rate'} · {frequency} Hz
            </span>
            <input
              max={8}
              min={1}
              type="range"
              value={frequency}
              onChange={(event) => setFrequency(Number(event.target.value))}
            />
          </label>
          <label>
            <span>
              {lang === 'zh' ? '深度' : 'Depth'} · {Math.round(amplitude * 100)}%
            </span>
            <input
              max={1}
              min={0}
              step={0.05}
              type="range"
              value={amplitude}
              onChange={(event) => setAmplitude(Number(event.target.value))}
            />
          </label>
        </div>
        <div className={styles.controls}>
          <button className={styles.primaryAction} disabled={status === 'playing'} onClick={start}>
            {demoCopy[lang].start}
          </button>
          <button className={styles.action} disabled={status !== 'playing'} onClick={stop}>
            {demoCopy[lang].stop}
          </button>
          <button className={styles.action} onClick={reconnect}>
            {demoCopy[lang].reconnect}
          </button>
        </div>
      </div>
    </DemoFrame>
  )
}
