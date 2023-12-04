import { Knob } from '@/copmponents/control/Knob'
import { useState } from 'react'

interface KnobComponentProps {
  size: 'small' | 'medium' | 'large'
}

export const KnobComponent = ({ size }: KnobComponentProps) => {
  const [value, setValue] = useState(0)

  return (
    <section className="flex flex-col items-center">
      <div className="text-primary">{Math.floor(value)}</div>
      <Knob label="Knob" value={value} size={size} onValueChange={setValue} />
    </section>
  )
}