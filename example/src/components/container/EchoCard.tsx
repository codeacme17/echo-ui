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

  const [toggled2, setToggled2] = useState(false)

  return (
    <section className="flex gap-4">
      <div>
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
      </div>

      <div>
        <Card toggled={toggled}>
          <Card.Header>
            <Radio checked={toggled} onChange={handleClick}>
              Delay
            </Radio>
          </Card.Header>

          <Card.Body className="text-muted-foreground">
            Click radio to toggle this card
            <Button
              disabled={!toggled}
              toggled={toggled2}
              onClick={() => setToggled2(!toggled2)}
              className="py-1 rounded-sm mt-2"
            >
              Mono Bass
            </Button>
            <Slider
              disabled={!toggled}
              className="my-3"
              hideAxis
              axisProps={{
                tickSize: 0,
              }}
            />
          </Card.Body>
        </Card>
      </div>
    </section>
  )
}
