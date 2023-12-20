import { Card, Knob, IndicatorLight } from 'echo-ui'
import { useRef, useState } from 'react'

export const EchoCard = () => {
  const [value, setValue] = useState(0)

  const handleValueChange = (value: number) => {
    setValue(value)
    console.log(labelRef)
  }

  const labelRef = useRef(null)

  return (
    <section>
      <Card toggled={value > 10}>
        <Card.Header>
          <IndicatorLight on={value > 10} />
        </Card.Header>

        <Card.Body>
          <Knob
            progressWidth={4}
            label="EQ"
            min={0}
            max={20}
            value={value}
            size={60}
            onChange={handleValueChange}
            ref={labelRef}
          >
            <Knob.TopLabel>EQ</Knob.TopLabel>
            <Knob.BottomLabel>{value}</Knob.BottomLabel>
          </Knob>
        </Card.Body>
      </Card>
    </section>
  )
}
