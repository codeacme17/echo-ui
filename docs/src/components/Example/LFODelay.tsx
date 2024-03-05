import React from 'react'
import { LFO, Knob } from 'echo-ui'

export const LFODelay = () => {
  const [delay, setDelay] = React.useState(1)

  return (
    <section className="">
      <LFO delay={delay} className="h-32" frequency={2} />

      <Knob
        value={delay}
        onChange={setDelay}
        className="mt-3"
        topLabel="Delay"
        min={1}
        max={1000}
        step={1}
        sensitivity={10}
        size={40}
        trackWidth={3}
        pointerHeight={6}
        bottomLabel={delay + 'ms'}
      />
    </section>
  )
}
