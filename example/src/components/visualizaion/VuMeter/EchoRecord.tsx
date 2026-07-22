import * as Tone from 'tone'
import { Circle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { VuMeter, Button } from '@nafr/echo-ui'

export const VuMeterRecord = () => {
  const [value, setValue] = useState([-60, -60])
  const [isRecording, setIsRecording] = useState(false)
  const [recorder] = useState(() => new Tone.UserMedia())
  const [meter] = useState(() => new Tone.Meter({ channelCount: 2 }))

  useEffect(() => {
    return () => {
      void recorder.close()
      recorder.dispose()
      meter.dispose()
    }
  }, [meter, recorder])

  const handleRecord = async () => {
    if (isRecording) {
      setIsRecording(false)
      recorder.disconnect()
      await recorder.close()
    } else {
      await Tone.start()
      await recorder.open()
      recorder.connect(meter)
      setIsRecording(true)
    }
  }

  useEffect(() => {
    let animationFrameId = 0

    const getDB = () => {
      if (!isRecording) {
        setValue([-60, -60])
        return
      }

      const currentValue = meter.getValue()
      setValue(typeof currentValue === 'number' ? [currentValue, currentValue] : currentValue)
      animationFrameId = requestAnimationFrame(getDB)
    }

    if (isRecording) {
      animationFrameId = requestAnimationFrame(getDB)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isRecording, meter])

  return (
    <section
      className="flex flex-col justify-center items-center"
      data-audio-example="microphone-vu"
      data-audio-state={isRecording ? 'recording' : 'stopped'}
    >
      <Button
        aria-label={isRecording ? 'Stop microphone VU' : 'Start microphone VU'}
        onClick={handleRecord}
        toggled={isRecording}
        className="mb-5"
      >
        <Circle className="w-4 h-4 fill-current" />
      </Button>

      <VuMeter value={value} lumpsQuantity={23} />
    </section>
  )
}
