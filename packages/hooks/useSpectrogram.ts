import * as Tone from 'tone'
import { useEffect, useRef, useState } from 'react'
import { SpectrogramDataPoint } from '../main'

export interface UseSpectrogramProps {
  fftSize?: number
  chain?: Tone.InputNode[]
}

const FFT_SIZE = 1024

export const useSpectrogram = (props: UseSpectrogramProps) => {
  const { fftSize: _fftSize = FFT_SIZE, chain } = props

  const analyser = useRef<Tone.Analyser | null>(null)
  const [fftSize, setFftSize] = useState(_fftSize)
  const [data, setData] = useState<SpectrogramDataPoint[]>([])
  const observerId = useRef<number>(0)

  useEffect(() => {
    init()

    return () => {
      analyser.current?.dispose()
      analyser.current = null
    }
  }, [])

  useEffect(() => {
    if (!analyser.current) return

    analyser.current.size = fftSize
  }, [fftSize])

  const init = () => {
    analyser.current = new Tone.Analyser('fft', fftSize)
    if (chain?.length) analyser.current.chain(...chain)
  }

  const observe = () => {
    if (!analyser.current) return

    const spectrogramData = analyser.current.getValue()
    if (spectrogramData instanceof Float32Array) {
      const formattedData = Array.from(spectrogramData).map((amplitude, frequency) => {
        return { frequency, amplitude }
      })
      setData(formattedData)
    }

    observerId.current = requestAnimationFrame(observe)
  }

  const cancelObserve = () => {
    setData([])
    cancelAnimationFrame(observerId.current)
  }

  return {
    analyser: analyser.current!,
    data,
    fftSize,
    setFftSize,
    observe,
    cancelObserve,
  }
}
