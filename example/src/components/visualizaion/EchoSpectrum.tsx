import { useState, useEffect, useRef } from 'react'
import { Spectrum, Button } from 'echo-ui'
import * as Tone from 'tone'

export const EchoSpectrum = () => {
  const [data, setData] = useState<{ frequency: number; amplitude: number }[]>([])
  const [trigger, setTrigger] = useState(false)

  const oscillator = useRef<Tone.Oscillator>()
  const analyser = useRef<Tone.Analyser>()

  useEffect(() => {
    oscillator.current = new Tone.Oscillator(440, 'sine').toDestination()
    analyser.current = new Tone.Analyser('fft', 32)
    oscillator.current.connect(analyser.current)

    return () => {
      oscillator.current?.disconnect()
      oscillator.current?.dispose()
    }
  }, [])

  const handleTrigger = async () => {
    if (!oscillator.current || !analyser.current) {
      console.error('Oscillator or Analyser is not initialized')
      return
    }

    if (trigger) {
      oscillator.current.stop()
      setTrigger(false)
    } else {
      await Tone.start()
      oscillator.current.start()
      setTimeout(() => {
        console.log(analyser.current?.getValue())
      }, 1000)
      setTrigger(true)
    }
  }

  return (
    <div className="w-2/3 flex flex-col items-center gap-2">
      <Spectrum data={data} shadow className="w-full" />
      <Button onClick={handleTrigger}>{trigger ? 'Stop' : 'Start'}</Button>
    </div>
  )
}
