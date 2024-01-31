import {
  Waveform,
  WaveformMouseEvent,
  Button,
  useFetchAudio,
  useWaveform,
  usePlayer,
} from '@echo-ui'
import { useEffect } from 'react'
import { Play, Square, Pause, Repeat, VolumeX } from 'lucide-react'

export const EchoWaveform = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-6.mp3'

  const { pending, error, audioBuffer, fetchAudio } = useFetchAudio({ url })
  const { data } = useWaveform({ audioBuffer })
  const {
    isReady,
    isPlaying,
    loop,
    mute,
    percentage,
    audioDuration,
    init,
    setMute,
    setLoop,
    setPickTime,
    play,
    pause,
    stop,
    observe,
    cancelObserve,
  } = usePlayer({
    onPlay: () => observe(),
    onPause: () => cancelObserve(),
    onStop: () => cancelObserve(),
  })

  useEffect(() => {
    fetchAudio()
  }, [])

  useEffect(() => {
    if (!audioBuffer) return
    init(audioBuffer)
  }, [audioBuffer])

  const togglePlay = () => {
    if (isPlaying) pause()
    else play()
  }

  const handleClick = (e: WaveformMouseEvent) => {
    setPickTime(e.time)
  }

  return (
    <section className="w-2/3 flex flex-col justify-center items-center">
      <Waveform
        data={data}
        audioDuration={audioDuration.current}
        percentage={percentage}
        onClick={handleClick}
        waveHeight={100}
        hideCursorLabel
        className="w-full"
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

        <Button className="p-2" onClick={() => setMute(!mute)} toggled={mute}>
          <VolumeX className="w-4 h-4 fill-current" />
        </Button>
      </Button.Group>
    </section>
  )
}
