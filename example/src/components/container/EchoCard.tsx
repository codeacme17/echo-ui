import { Card, Knob, IndicatorLight } from 'echo-ui'
import { useState } from 'react'

export const EchoCard = () => {
  const [value, setValue] = useState(0)

  const handleValueChange = (value: number) => {
    setValue(value)
  }

  return (
    <section>
      <Card toggled={value > 10}>
        <Card.Header>
          <IndicatorLight on={value > 10} />
        </Card.Header>
        <Knob min={0} max={20} value={value} onChange={handleValueChange} />
        {value > 10 ? true : false}
      </Card>
    </section>
  )
}
