import { useState } from 'react'
import { Knob } from '@echo-ui'

export const KnobComponent = () => {
  const [value, setValue] = useState(-0)

  return (
    <section className="flex flex-col items-center">
      <div className="text-primary text-xl mb-2">{value}</div>
      <Knob value={value} trackWidth={5} rotationRange={212} />
    </section>
  )
}
