import * as React from 'react'
import { Card, Knob, Light, Radio, Slider, Button } from 'echo-ui'

export const CardActualScenario = () => {
  const [value, setValue] = React.useState(3)
  const [toggled, setToggled] = React.useState(false)

  const handleValueChange = (value: number) => {
    setValue(value)
  }

  const handleClick = () => {
    setToggled(!toggled)
  }

  const [toggled2, setToggled2] = React.useState(false)

  return (
    <section className="flex gap-8">
      <div>
        <Card toggled={value > 0}>
          <Card.Header>
            <Light on={value > 0} className="mr-2" />
          </Card.Header>

          <Card.Body className="flex gap-10">
            <Knob
              trackWidth={6}
              buttonColor="var(--echo-card)"
              min={0}
              max={20}
              value={value}
              size={60}
              onChange={handleValueChange}
              topLabel={'Attack'}
              bottomLabel={<span className="-mt-2 text-sm">{value} ms</span>}
            />
          </Card.Body>
        </Card>
      </div>

      <div>
        <Card toggled={toggled} className="block data-[toggled=true]:border-indigo-500">
          <Card.Header>
            <Radio checked={toggled} onClick={handleClick} color="#6366f1">
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
                className="data-[toggled=true]:bg-indigo-500"
                onClick={() => setToggled2(!toggled2)}
              >
                Mono Bass
              </Button>
            </div>

            <Slider
              disabled={!toggled}
              className="my-3"
              classNames={{
                progress: 'bg-indigo-500 group-data-[disabled=true]:bg-muted',
              }}
            />
          </Card.Body>
        </Card>
      </div>
    </section>
  )
}
