import { useState, useRef } from 'react'
import { Input, InputChangeEvent } from '@echo-ui'

export const InputComponent = () => {
  const [numberValue, setNumberValue] = useState(50)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: InputChangeEvent) => {
    setNumberValue(e.value)
  }

  return (
    <section className="flex flex-col gap-4 items-center">
      <Input
        ref={inputRef}
        value={numberValue}
        onChange={handleChange}
        radius="none"
        size="sm"
        className="w-16"
        bilateral
      />

      <Input type="text" placeholder="Echo UI" />
      <Input />
    </section>
  )
}
