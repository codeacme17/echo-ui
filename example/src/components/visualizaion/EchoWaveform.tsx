import { useState } from 'react'
import { Waveform, WaveformClickEvent } from '@echo-ui'

export const EchoWaveform = () => {
  const DATA_LENGTH = 1000

  const data = Array.from(
    { length: DATA_LENGTH },
    (_, i) => Math.sin((i / DATA_LENGTH) * 2 * Math.PI * 10) * (0.5 + Math.random() * 0.5),
  )

  const [percentage] = useState(10)

  const handleClick = (e: WaveformClickEvent) => {
    console.log(e)
  }

  return (
    <section className="w-2/3 flex justify-center">
      <Waveform
        data={data}
        className="max-w-[600px]"
        percentage={percentage}
        onClick={handleClick}
      />
    </section>
  )
}
