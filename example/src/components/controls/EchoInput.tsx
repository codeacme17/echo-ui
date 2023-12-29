import { useState, useRef } from 'react'
import { Input, InputChangeEvent } from '@echo-ui'

export const InputComponent = () => {
  const [numberValue, setNumberValue] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: InputChangeEvent) => {
    setNumberValue(e.value)
  }

  return (
    <section className="flex gap-4 items-center">
      <Input
        ref={inputRef}
        value={numberValue}
        onChange={handleChange}
        radius="none"
        size="lg"
        className="text-center"
      />

      <Input type="text" placeholder="Echo UI" />
    </section>
  )
}
