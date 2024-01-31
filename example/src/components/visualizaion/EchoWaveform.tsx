import {
  Waveform,
  WaveformMouseEvent,
  Button,
  useFetchAudio,
  useWaveform,
  usePlayer,
} from '@echo-ui'
import { Play, Square, Pause, Repeat, VolumeX } from 'lucide-react'
import { useEffect, useState } from 'react'

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

  const [tab, setTab] = useState('a')
  const swichB = (c: 'a' | 'b') => {
    setTab(c)
  }

  return (
    <section className="w-2/3 flex flex-col justify-center items-center">
      <button onClick={() => swichB(tab === 'a' ? 'b' : 'a')}>swichB</button>

      {tab === 'a' ? (
        <Waveform
          data={data}
          audioDuration={audioDuration.current}
          percentage={percentage}
          onClick={handleClick}
          waveHeight={100}
          hideCursorLabel
        />
      ) : (
        <></>
      )}

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
