import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button, SineIcon, SquareIcon, SawtoothIcon, TriangleIcon } from '@echo-ui'

export const EchoButton = () => {
  const [values, setValues] = useState([1])
  const [toggled, setToggled] = useState(false)

  const handleClick = () => {
    setToggled(!toggled)
  }

  const handleToChange = () => {
    setToggled(toggled)
  }

  useEffect(() => {
    console.log(values)
  }, [values])

  return (
    <section className="flex flex-col">
      <Button className="mb-4 w-20" size="sm">
        Button
      </Button>

      <Button.Group
        className="mb-4"
        size="md"
        radius="lg"
        classNames={{
          button: 'px-2 data-[toggled=true]:bg-red-400',
        }}
      >
        <Button
          toggled={toggled}
          className="px-2 data-[toggled=true]:bg-blue-400"
          onClick={handleClick}
          onToggleChange={handleToChange}
        >
          Temp
        </Button>
        <Button className="px-2 ">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </Button.Group>

      <Button.Group
        value={values}
        radius="none"
        onChange={setValues}
        classNames={{
          button: 'data-[toggled=true]:bg-red-400 p-5',
        }}
      >
        <Button value={1} className="data-[toggled=true]:bg-red-500">
          <SineIcon />
        </Button>
        <Button value={2}>
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
