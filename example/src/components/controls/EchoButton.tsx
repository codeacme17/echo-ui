import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button, SineIcon, SquareIcon, SawtoothIcon, TriangleIcon } from 'echo-ui'

export const EchoButton = () => {
  const [values, setValues] = useState([1])
  const [toggled, setToggled] = useState(false)

  const handleClick = () => {
    setToggled(!toggled)
  }

  const handleToChange = () => {
    setToggled(toggled)
  }

  return (
    <section className="flex flex-col">
      <Button className="mb-4 w-20" size="md" radius="lg">
        Button
      </Button>

      <Button.Group className="mb-4" size="md">
        <Button toggled={toggled} onClick={handleClick} onToggleChange={handleToChange}>
          Temp
        </Button>
        <Button className="px-2">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </Button.Group>

      <Button.Group value={values} radius="none" onChange={setValues}>
        <Button value={1}>
          <SineIcon />
        </Button>
        <Button value={2} classNames={{ toggled: 'bg-slate-500' }}>
          <SquareIcon />
        </Button>
        <Button value={3}>
          <SawtoothIcon />
        </Button>
        <Button value={4}>
          <TriangleIcon />
        </Button>
      </Button.Group>
    </section>
  )
}
