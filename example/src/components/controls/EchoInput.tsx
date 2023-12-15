import { useState, useRef } from 'react'
import { Input, InputChangeEvent } from 'echo-ui'

export const InputComponent = () => {
  const [numberValue, setNumberValue] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: InputChangeEvent) => {
    setNumberValue(e.value)
  }

  return (
    <section>
      <Input
        ref={inputRef}
        value={numberValue}
        onChange={handleChange}
        className="mb-5 py-1 text-center rounded-none text-sm w-16"
      />

      <Input draggable />
    </section>
  )
}
