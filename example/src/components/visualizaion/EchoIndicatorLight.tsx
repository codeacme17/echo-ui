import { useEffect, useState } from 'react'
import { Light, Knob } from '@echo-ui'

export const EchoIndicatorLight = () => {
  const [value, setValue] = useState(0)

  const [onState, setOnState] = useState(false)

  useEffect(() => {
    if (value > 0) setOnState(true)
    else setOnState(false)
  }, [value])

  return (
    <section className="flex gap-3">
      <Light on={onState} className="-mt-2" />
      <Knob value={value} onChange={setValue} />
    </section>
  )
}
