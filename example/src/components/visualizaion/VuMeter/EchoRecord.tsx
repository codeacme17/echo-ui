import * as Tone from 'tone'
import { Circle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { VuMeter, Button } from 'echo-ui'

export const VuMeterRecord = () => {
  const [value, setValue] = useState([-60, -60])
  const [isRecording, setIsRecording] = useState(false)
  const [recorder] = useState(() => new Tone.UserMedia())
  const [split] = useState(() => new Tone.Split())
  const [meterLeft] = useState(() => new Tone.Meter())
  const [meterRight] = useState(() => new Tone.Meter())

  useEffect(() => {
    return () => {
      recorder.dispose()
      split.dispose()
      meterLeft.dispose()
      meterRight.dispose()
    }
  }, [recorder, split, meterLeft, meterRight])

  const handleRecord = async () => {
    // Toggle the recording state
    setIsRecording(!isRecording)

    if (isRecording) {
      split.disconnect()
    } else {
      recorder.open()
      recorder.connect(split)
      split.connect(meterLeft)
      split.connect(meterRight)
    }
  }

  useEffect(() => {
    let animationFrameId = 0

    const getDB = () => {
      if (!isRecording) {
        setValue([-60, -60])
        return
      }

      const levelLeft = meterLeft.getValue()
      const levelRight = meterRight.getValue()

      setValue([levelLeft, levelRight] as number[])
      animationFrameId = requestAnimationFrame(getDB)
    }

    if (isRecording) {
      animationFrameId = requestAnimationFrame(getDB)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isRecording, meterLeft, meterRight])

  return (
    <section className="flex flex-col justify-center items-center">
      <Button onClick={handleRecord} isToggled={isRecording} className="mb-5">
        <Circle className="w-4 h-4 fill-current" />
      </Button>

      <VuMeter value={value} lumpsQuantity={23} showAxis />
    </section>
  )
}
