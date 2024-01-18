import { useEffect, useState } from 'react'
import {
  Waveform,
  WaveformClickEvent,
  Button,
  useFetchAudio,
  useWaveform,
  usePlayer,
} from '@echo-ui'
import { Play, Square, Pause, Repeat, VolumeX } from 'lucide-react'

export const EchoWaveform = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-5.mp3'

  const { pending, error, audioBuffer } = useFetchAudio({ url })
  const {
    player,
    isReady,
    isPlaying,
    isFinish,
    loop,
    mute,
    time,
    percentage,
    setMute,
    setLoop,
    play,
    pause,
    stop,
  } = usePlayer({
    audioBuffer,
    onPause: () => handleStop(),
    onStop: () => handleStop(),
  })

  const { data } = useWaveform({ audioBuffer })

  const handleStop = () => {
    if (!player) return
  }

  const handleTriggerPlay = () => {
    if (!player) return
    if (isPlaying) pause()
    else play()
  }

  const handleClick = (e: WaveformClickEvent) => {
    const newPercentage = e.percentage
  }

  useEffect(() => {
    console.log(time)
  }, [time])

  return (
    <section className="w-2/3 flex flex-col justify-center items-center">
      <Waveform data={data} percentage={percentage} onClick={handleClick} waveHeight={100} />

      <Button.Group className="mt-3" disabled={pending || error || !isReady}>
        <Button className="p-2" onClick={() => setLoop(!loop)} toggled={loop}>
          <Repeat className="w-4 h-4 fill-current" />
        </Button>

        <Button className="p-2" onClick={() => stop(0)}>
          <Square className="w-4 h-4 fill-current" />
        </Button>

        <Button onClick={handleTriggerPlay} toggled={isPlaying}>
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </Button>

        <Button className="p-2" onClick={() => setMute(!mute)} toggled={mute}>
          <VolumeX className="w-4 h-4 fill-current" />
        </Button>
      </Button.Group>
    </section>
  )
}
