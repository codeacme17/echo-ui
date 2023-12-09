import { useState } from 'react'
import { Knob } from 'echo-ui'

export const KnobComponent = () => {
  const [value, setValue] = useState(0)

  return (
    <section className="flex flex-col items-center">
      <div className="text-primary">{Math.floor(value)}</div>
      <Knob label="Knob" value={value} onChange={setValue} />
    </section>
  )
}
