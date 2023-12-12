import { useState, useRef } from 'react'
import { Input, InputChangeEvent } from 'echo-ui'

export const InputComponent = () => {
  const [value, setValue] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: InputChangeEvent) => {
    setValue(e.value)
  }

  return (
    <section>
      <Input
        ref={inputRef}
        type="number"
        value={value}
        onChange={handleChange}
        className="mb-5 py-1 text-center rounded-none text-sm w-16"
        step={1}
        draggable
      />

      <Input type="text" value={value} onChange={handleChange} />
    </section>
  )
}
