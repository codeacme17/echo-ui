import { Button, SineIcon, SquareIcon, SawtoothIcon, TriangleIcon } from 'echo-ui'

export const EchoButton = () => {
  return (
    <section>
      <Button.Group>
        <Button>
          <SineIcon className="w-6 h-6" />
        </Button>
        <Button>
          <SquareIcon className="w-6 h-6" />
        </Button>
        <Button>
          <SawtoothIcon className="w-6 h-6" />
        </Button>
        <Button>
          <TriangleIcon className="w-6 h-6" />
        </Button>
      </Button.Group>
    </section>
  )
}
