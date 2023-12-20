import { useState } from 'react'
import { Card, Knob, IndicatorLight, Radio, Slider, Button } from 'echo-ui'

export const EchoCard = () => {
  const [value, setValue] = useState(0)

  const handleValueChange = (value: number) => {
    setValue(value)
  }

  const [toggled, setToggled] = useState(false)

  const handleClick = () => {
    setToggled(!toggled)
  }

  return (
    <section className="flex gap-4">
      <Card toggled={value > 10}>
        <Card.Header>
          <IndicatorLight on={value > 10} />
        </Card.Header>

        <Card.Body>
          <Knob
            progressWidth={4}
            min={0}
            max={20}
            value={value}
            size={80}
            onChange={handleValueChange}
            bilateral
          >
            <Knob.TopLabel>EQ</Knob.TopLabel>
            <Knob.BottomLabel>{value} %</Knob.BottomLabel>
          </Knob>
        </Card.Body>
      </Card>

      <Card toggled={toggled}>
        <Card.Header>
          <Radio checked={toggled} onChange={handleClick}>
            Delay
          </Radio>
        </Card.Header>

        <Card.Body className="select-none text-muted-foreground px-2">
          Click radio to toggle this card
          <Button toggled className="py-1 rounded-sm mt-2">
            Mono Bass
          </Button>
          <Slider hideAxis className="mt-4" />
        </Card.Body>
      </Card>
    </section>
  )
}
