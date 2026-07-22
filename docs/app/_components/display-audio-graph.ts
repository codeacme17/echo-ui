'use client'

import type { OscilloscopeDataPoint, SpectrogramDataPoint } from '@nafr/echo-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { DisplayName } from './display-api'
import type { AudioStatus } from './display-demo-frame'

export type AudioDisplayName = Exclude<DisplayName, 'lfo' | 'card'>

export type AudioFrame = Readonly<{
  duration: number
  level: number
  oscilloscope: OscilloscopeDataPoint[]
  percentage: number
  spectrum: SpectrogramDataPoint[]
  waveform: number[][]
}>

const emptyFrame: AudioFrame = {
  duration: 0,
  level: -60,
  oscilloscope: [],
  percentage: 0,
  spectrum: [],
  waveform: [],
}

const sampleModeByDisplay: Record<
  AudioDisplayName,
  'level' | 'spectrum' | 'time-domain' | 'waveform'
> = {
  light: 'level',
  oscilloscope: 'time-domain',
  spectrogram: 'spectrum',
  vumeter: 'level',
  waveform: 'waveform',
}

const basePath = process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? ''
export const demoAudioUrl = `${basePath}/audios/demo-loop.mp3`

const simplifyChannel = (data: Float32Array, samples = 320) => {
  const blockSize = Math.max(1, Math.floor(data.length / samples))
  return Array.from({ length: samples }, (_, index) => {
    let peak = 0
    const start = index * blockSize
    const end = Math.min(start + blockSize, data.length)
    for (let cursor = start; cursor < end; cursor += 1) {
      peak = Math.max(peak, Math.abs(data[cursor]))
    }
    return peak
  })
}

const decodeWaveform = async (context: AudioContext) => {
  const response = await fetch(demoAudioUrl)
  if (!response.ok) throw new Error(`Audio request failed with ${response.status}`)
  const buffer = await context.decodeAudioData(await response.arrayBuffer())
  const channels = Array.from({ length: Math.min(2, buffer.numberOfChannels) }, (_, channel) =>
    simplifyChannel(buffer.getChannelData(channel)),
  )
  if (channels.length === 1) channels.push([...channels[0]])
  return { data: channels, duration: buffer.duration }
}

export const useAudioGraph = (display: AudioDisplayName) => {
  const mode = sampleModeByDisplay[display]
  const audioRef = useRef<HTMLAudioElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const connectedRef = useRef(false)
  const frameIdRef = useRef(0)
  const lastFrameTimeRef = useRef(0)
  const waveformLoadedRef = useRef(false)
  const [active, setActive] = useState(false)
  const [connected, setConnected] = useState(false)
  const [connectionCount, setConnectionCount] = useState(0)
  const [frame, setFrame] = useState<AudioFrame>(emptyFrame)
  const [status, setStatus] = useState<AudioStatus>('idle')

  const cancelFrames = useCallback((reset = false) => {
    if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
    frameIdRef.current = 0
    lastFrameTimeRef.current = 0
    setActive(false)
    if (reset) {
      setFrame((current) => ({
        ...emptyFrame,
        duration: current.duration,
        waveform: current.waveform,
      }))
    }
  }, [])

  const readFrame = useCallback(
    (timestamp: number) => {
      const analyser = analyserRef.current
      const audio = audioRef.current
      if (!analyser || !audio) return

      if (timestamp - lastFrameTimeRef.current >= 32) {
        lastFrameTimeRef.current = timestamp
        const duration = Number.isFinite(audio.duration) ? audio.duration : frame.duration
        const percentage = duration > 0 ? (audio.currentTime / duration) * 100 : 0

        if (mode === 'spectrum') {
          const values = new Float32Array(analyser.frequencyBinCount)
          analyser.getFloatFrequencyData(values)
          setFrame((current) => ({
            ...current,
            duration,
            percentage,
            spectrum: Array.from(values, (amplitude, frequency) => ({
              amplitude: Number.isFinite(amplitude) ? amplitude : -100,
              frequency,
            })),
          }))
        } else if (mode === 'time-domain') {
          const values = new Float32Array(analyser.fftSize)
          analyser.getFloatTimeDomainData(values)
          setFrame((current) => ({
            ...current,
            duration,
            percentage,
            oscilloscope: Array.from(values, (amplitude, index) => ({ amplitude, index })),
          }))
        } else if (mode === 'level') {
          const values = new Float32Array(analyser.fftSize)
          analyser.getFloatTimeDomainData(values)
          const rms = Math.sqrt(
            values.reduce((sum, value) => sum + value * value, 0) / values.length,
          )
          const level = Math.max(-60, Math.min(5, rms > 0 ? 20 * Math.log10(rms) : -60))
          setFrame((current) => ({ ...current, duration, level, percentage }))
        } else {
          setFrame((current) => ({ ...current, duration, percentage }))
        }
      }

      frameIdRef.current = requestAnimationFrame(readFrame)
    },
    [frame.duration, mode],
  )

  const startFrames = useCallback(() => {
    if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
    setActive(true)
    frameIdRef.current = requestAnimationFrame(readFrame)
  }, [readFrame])

  const connect = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) throw new Error('Audio element is unavailable')

    setStatus('connecting')
    let context = contextRef.current
    if (!context || context.state === 'closed') {
      context = new AudioContext()
      contextRef.current = context
    }

    if (!sourceRef.current) sourceRef.current = context.createMediaElementSource(audio)
    if (!analyserRef.current) {
      analyserRef.current = context.createAnalyser()
      analyserRef.current.fftSize = 1024
      analyserRef.current.smoothingTimeConstant = 0.78
    }

    if (!connectedRef.current) {
      sourceRef.current.connect(analyserRef.current)
      analyserRef.current.connect(context.destination)
      connectedRef.current = true
      setConnected(true)
      setConnectionCount((count) => count + 1)
    }

    await context.resume()

    if (mode === 'waveform' && !waveformLoadedRef.current) {
      const waveform = await decodeWaveform(context)
      waveformLoadedRef.current = true
      setFrame((current) => ({
        ...current,
        duration: waveform.duration,
        waveform: waveform.data,
      }))
    }

    setStatus('ready')
  }, [mode])

  const disconnect = useCallback(async () => {
    if (connectedRef.current) {
      sourceRef.current?.disconnect()
      analyserRef.current?.disconnect()
      connectedRef.current = false
      setConnected(false)
    }
    const context = contextRef.current
    if (context?.state === 'running') {
      try {
        await context.suspend()
      } catch {
        // A concurrent teardown may have already closed the context.
      }
    }
  }, [])

  const start = useCallback(async () => {
    try {
      await connect()
      const audio = audioRef.current
      if (!audio) return
      if (audio.ended) audio.currentTime = 0
      audio.loop = true
      await audio.play()
      startFrames()
      setStatus('playing')
    } catch {
      cancelFrames()
      await disconnect()
      setStatus('error')
    }
  }, [cancelFrames, connect, disconnect, startFrames])

  const stop = useCallback(async () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    cancelFrames(true)
    await disconnect()
    setStatus('stopped')
  }, [cancelFrames, disconnect])

  const reconnect = useCallback(async () => {
    try {
      audioRef.current?.pause()
      cancelFrames(true)
      await disconnect()
      await connect()
    } catch {
      cancelFrames(true)
      await disconnect()
      setStatus('error')
    }
  }, [cancelFrames, connect, disconnect])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = Math.max(0, Math.min(time, audio.duration))
    setFrame((current) => ({
      ...current,
      percentage: (audio.currentTime / audio.duration) * 100,
    }))
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      audio?.pause()
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
      sourceRef.current?.disconnect()
      analyserRef.current?.disconnect()
      connectedRef.current = false
      const context = contextRef.current
      if (context && context.state !== 'closed') void context.close()
    }
  }, [])

  return {
    active,
    audioRef,
    connected,
    connectionCount,
    frame,
    reconnect,
    seek,
    start,
    status,
    stop,
  }
}
