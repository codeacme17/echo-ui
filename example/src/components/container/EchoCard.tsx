import { useState } from 'react'
import { Card, Knob, IndicatorLight, Radio, Slider, Button } from 'echo-ui'

export const EchoCard = () => {
  const [value, setValue] = useState(3)
  const [toggled, setToggled] = useState(false)

  const handleValueChange = (value: number) => {
    setValue(value)
  }

  const handleClick = () => {
    setToggled(!toggled)
  }

  const [toggled2, setToggled2] = useState(false)

  return (
    <section className="flex gap-4">
      <div>
        <Card toggled={value > 0}>
          <Card.Header>
            <IndicatorLight on={value > 0} className="mr-2" />
          </Card.Header>

          <Card.Body className="flex gap-10">
            <Knob
              trackWidth={6}
              bilateral
              buttonColor="var(--echo-card)"
              min={0}
              max={20}
              value={value}
              size={60}
              onChange={handleValueChange}
              topLabel={'Delay'}
              bottomLabel={`${value} ms`}
              rotationRange={360}
            />

            <Knob
              bilateral
              trackWidth={6}
              buttonColor="var(--echo-card)"
              min={0}
              max={20}
              value={value}
              size={60}
              onChange={handleValueChange}
              topLabel={'Attack'}
              bottomLabel={`${value} ms`}
            />
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

          <Card.Body className="text-muted-foreground flex flex-col gap-2">
            <div>Click radio to toggle this card</div>
            <div>
              <Button
                disabled={!toggled}
                toggled={toggled2}
                radius="sm"
                onClick={() => setToggled2(!toggled2)}
              >
                Mono Bass
              </Button>
            </div>
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
