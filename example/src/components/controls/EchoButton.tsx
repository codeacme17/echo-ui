import { useState } from 'react'
import { Button, SineIcon, SquareIcon, SawtoothIcon, TriangleIcon } from 'echo-ui'

export const EchoButton = () => {
  const [values, setValues] = useState([1, 2, 3])

  return (
    <section>
      <Button className="mb-4 hover:bg-opacity-25">t</Button>

      <Button.Group value={values} onChange={setValues}>
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
