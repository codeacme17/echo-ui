import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button, SineIcon, SquareIcon, SawtoothIcon, TriangleIcon } from 'echo-ui'

export const EchoButton = () => {
  const [values, setValues] = useState([1, 2, 3])
  const [toggled, setToggled] = useState(false)

  const handleClick = () => {
    setToggled(!toggled)
  }

  const handleToChange = () => {
    setToggled(toggled)
  }

  return (
    <section>
      <Button className="mb-4" size="md">
        t
      </Button>

      <Button.Group className="border-0 rounded-none mb-4" size="sm">
        <Button toggled={toggled} onClick={handleClick} onToggleChange={handleToChange}>
          Temp
        </Button>
        <Button className="px-1">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </Button.Group>

      <Button.Group value={values} onChange={setValues}>
        <Button value={1}>
          <SineIcon />
        </Button>
        <Button value={2} classNames={{ toggled: 'bg-slate-500' }}>
          <SquareIcon />
        </Button>
        <Button>
          <SawtoothIcon />
        </Button>
        <Button value={4}>
          <TriangleIcon />
        </Button>
      </Button.Group>
    </section>
  )
}
