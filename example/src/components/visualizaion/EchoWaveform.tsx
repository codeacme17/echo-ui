import {
  Waveform,
  WaveformMouseEvent,
  Button,
  useFetchAudio,
  useWaveform,
  usePlayer,
} from '@nafr/echo-ui'
import { useEffect } from 'react'
import { Play, Square, Pause, Repeat, VolumeX } from 'lucide-react'
import * as Tone from 'tone'

export const EchoWaveform = () => {
  const url = '/audio/Drum Loop.wav'

  const { pending, error, audioBuffer, fetchAudio } = useFetchAudio({ url })
  const { data, audioDuration } = useWaveform({ audioBuffer })
  const {
    isReady,
    isPlaying,
    loop,
    mute,
    percentage,
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

  const togglePlay = async () => {
    await Tone.start()
    if (isPlaying) pause()
    else play()
  }

  const handleClick = (e: WaveformMouseEvent) => {
    setPickTime(e.time)
  }

  return (
    <section
      className="w-2/3 flex flex-col justify-center items-center"
      data-audio-example="waveform"
      data-audio-state={isPlaying ? 'playing' : 'stopped'}
    >
      <Waveform
        data={data}
        audioDuration={audioDuration.current}
        percentage={percentage}
        onClick={handleClick}
        waveHeight={100}
        className="w-full"
      />

      <Button.Group className="mt-3" disabled={pending || error || !isReady}>
        <Button className="p-2" onClick={() => setLoop(!loop)} toggled={loop}>
          <Repeat className="w-4 h-4 fill-current" />
        </Button>

        <Button className="p-2" onClick={() => stop()}>
          <Square className="w-4 h-4 fill-current" />
        </Button>

        <Button
          aria-label={isPlaying ? 'Pause waveform' : 'Start waveform'}
          onClick={togglePlay}
          toggled={isPlaying}
        >
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
