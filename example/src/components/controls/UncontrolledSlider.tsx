import * as Tone from 'tone'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Square } from 'lucide-react'
import { Slider, Button } from '@nafr/echo-ui'

const meterValue = (value: number | number[]) => (typeof value === 'number' ? value : value[0])

export const UncontrolledSlider = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'
  const [value, setValue] = useState(-60)
  const [ready, setReady] = useState(false)
  const [isPlay, setIsPlay] = useState(false)
  const player = useRef<Tone.Player | null>(null)
  const meter = useRef<Tone.Meter | null>(null)
  const frameId = useRef(0)

  const cancelObservation = useCallback(() => {
    if (!frameId.current) return
    cancelAnimationFrame(frameId.current)
    frameId.current = 0
  }, [])

  const observeLevel = useCallback(() => {
    const readLevel = () => {
      const currentPlayer = player.current
      const currentMeter = meter.current
      if (!currentPlayer || !currentMeter || currentPlayer.state === 'stopped') {
        frameId.current = 0
        setValue(-60)
        return
      }
      setValue(meterValue(currentMeter.getValue()))
      frameId.current = requestAnimationFrame(readLevel)
    }
    if (!frameId.current) frameId.current = requestAnimationFrame(readLevel)
  }, [])

  useEffect(() => {
    const nextMeter = new Tone.Meter()
    const nextPlayer = new Tone.Player(url, () => setReady(true)).toDestination()
    nextPlayer.connect(nextMeter)
    meter.current = nextMeter
    player.current = nextPlayer

    return () => {
      cancelObservation()
      try {
        nextPlayer.stop()
      } catch {
        // The remote player may not have loaded before unmount.
      }
      nextPlayer.dispose()
      nextMeter.dispose()
      player.current = null
      meter.current = null
    }
  }, [cancelObservation])

  const handlePlay = async () => {
    const currentPlayer = player.current
    if (!currentPlayer || !ready) return
    await Tone.start()
    currentPlayer.volume.value = 5
    if (currentPlayer.state === 'started') {
      currentPlayer.stop()
      cancelObservation()
      setValue(-60)
      setIsPlay(false)
      return
    }
    currentPlayer.start()
    observeLevel()
    setIsPlay(true)
  }

  return (
    <section className="flex flex-col items-center">
      <Button onClick={handlePlay} disabled={!ready} toggled={isPlay} className="mb-5 px-4">
        {isPlay ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>
      <div className="h-80">
        <Slider
          className="w-2"
          hideThumb
          prohibitInteraction
          vertical
          axis
          min={-60}
          max={10}
          value={value}
        />
      </div>
    </section>
  )
}
