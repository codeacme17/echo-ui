import * as Tone from 'tone'
import { Circle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { VuMeter, Button } from '@nafr/echo-ui'

export const VuMeterRecord = () => {
  const [value, setValue] = useState([-60, -60])
  const [isRecording, setIsRecording] = useState(false)
  const [recorder] = useState(() => new Tone.UserMedia())
  const [split] = useState(() => new Tone.Split())
  const [meterLeft] = useState(() => new Tone.Meter())
  const [meterRight] = useState(() => new Tone.Meter())

  useEffect(() => {
    return () => {
      void recorder.close()
      recorder.dispose()
      split.dispose()
      meterLeft.dispose()
      meterRight.dispose()
    }
  }, [recorder, split, meterLeft, meterRight])

  const handleRecord = async () => {
    if (isRecording) {
      setIsRecording(false)
      recorder.disconnect()
      split.disconnect()
      await recorder.close()
    } else {
      await Tone.start()
      await recorder.open()
      split.disconnect()
      recorder.connect(split)
      split.connect(meterLeft, 0)
      split.connect(meterRight, 1)
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

      const leftValue = meterLeft.getValue()
      const rightValue = meterRight.getValue()
      const levelLeft = typeof leftValue === 'number' ? leftValue : leftValue[0]
      const levelRight = typeof rightValue === 'number' ? rightValue : rightValue[0]

      setValue([levelLeft, levelRight])
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
      <Button onClick={handleRecord} toggled={isRecording} className="mb-5">
        <Circle className="w-4 h-4 fill-current" />
      </Button>

      <VuMeter value={value} lumpsQuantity={23} />
    </section>
  )
}
