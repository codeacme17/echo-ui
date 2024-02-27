import React from 'react'
import { LFO, Knob } from '@echo-ui'

export const EchoLFO = () => {
  const [speed, setSpeed] = React.useState(5)

  return (
    <section className="h-32 w-2/3">
      <LFO speed={speed} />

      <div>
        <Knob value={speed} onChange={setSpeed} min={0} max={10} step={0.1} sensitivity={2} />

        {speed}
      </div>
    </section>
  )
}
