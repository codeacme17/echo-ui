import React from 'react'
import {
  Waveform,
  WaveformMouseEvent,
  Button,
  useFetchAudio,
  useWaveform,
  usePlayer,
} from 'echo-ui'
import { Play, Square, Pause, Repeat, VolumeX } from 'lucide-react'

export const WaveformDefault = () => {
  const url = '/audios/loop-6.mp3'

  const { pending, error, audioBuffer } = useFetchAudio({ url })
  const { data } = useWaveform({ audioBuffer })
  const {
    isReady,
    isPlaying,
    loop,
    mute,
    percentage,
    audioDuration,
    setMute,
    setLoop,
    setPickTime,
    play,
    pause,
    stop,
    observe,
    cancelObserve,
  } = usePlayer({
    audioBuffer,
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
    onStop: () => cancelObserve(),
  })

  const togglePlay = () => {
    if (isPlaying) pause()
    else play()
  }

  const handleClick = (e: WaveformMouseEvent) => {
    setPickTime(e.time)
  }

  return (
    <section className="w-full flex flex-col justify-center items-center">
      <Waveform
        data={data}
        audioDuration={audioDuration}
        percentage={percentage}
        onClick={handleClick}
      />

      <Button.Group className="mt-3" disabled={pending || error || !isReady}>
        <Button className="p-2" onClick={() => setLoop(!loop)} toggled={loop}>
          <Repeat className="w-4 h-4 fill-current" />
        </Button>

        <Button className="p-2" onClick={() => stop()}>
          <Square className="w-4 h-4 fill-current" />
        </Button>

        <Button onClick={togglePlay} toggled={isPlaying}>
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </Button>

        <Button
          className="p-2 data-[toggled=true]:bg-red-500"
          onClick={() => setMute(!mute)}
          toggled={mute}
        >
          <VolumeX className="w-4 h-4 fill-current" />
        </Button>
      </Button.Group>
    </section>
  )
}
