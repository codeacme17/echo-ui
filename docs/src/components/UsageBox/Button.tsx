import React from 'react'
import { UsageBox } from '.'
import { Button, SineIcon, SawtoothIcon, SquareIcon, TriangleIcon } from 'echo-ui'

export const DefaultButton = () => {
  const scope = { Button }
  const code = `<Button> Button </Button>`

  return <UsageBox code={code} scope={scope} />
}

export const ToggledButton = () => {
  const scope = { Button }
  const code = `<Button toggled> Toggled </Button>`

  return <UsageBox code={code} scope={scope} />
}

export const DisabledButton = () => {
  const scope = { Button }
  const code = `<Button disabled> Disabled </Button>`

  return <UsageBox code={code} scope={scope} />
}

export const SizeButton = () => {
  const scope = { Button }
  const code = `<div className="flex gap-4 items-center">
  <Button size="sm">
    Small
  </Button>  
  <Button size="md">
    Medium
  </Button>  
  <Button size="lg">
    Large
  </Button>  
</div>`

  return <UsageBox code={code} scope={scope} />
}

export const RadiusButton = () => {
  const scope = { Button }
  const code = `<div className="flex gap-4 items-center">
  <Button radius="none">
    None
  </Button>  
  <Button radius="sm">
    Small
  </Button>  
  <Button radius="md">
    Medium
  </Button>  
  <Button radius="lg">
    Large
  </Button>
  <Button radius="full">
    Full
  </Button>  
</div>`

  return <UsageBox code={code} scope={scope} />
}

export const GroupButton = () => {
  const scope = { Button, SineIcon, SawtoothIcon, SquareIcon, TriangleIcon }

  const code = `<Button.Group>
  <Button value={1} className="data-[toggled=true]:bg-red-500">
    Sine
  </Button>
  <Button value={2}>
    Square
  </Button>
  <Button value={3}>
    Sawtooth
  </Button>
  <Button value={4}>
    Triangle
  </Button>
</Button.Group>`

  return <UsageBox code={code} scope={scope} />
}
