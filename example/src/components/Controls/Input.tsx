import { useState, useRef } from 'react'
import { Input, InputChangeEvent } from 'echo-ui'

export const InputComponent = () => {
  const [value, setValue] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: InputChangeEvent) => {
    setValue(e.value)
    console.log(inputRef)
  }

  return (
    <section>
      <Input
        ref={inputRef}
        type="number"
        value={value}
        onChange={handleChange}
        className="mb-5 w-16 py-1 px-0 text-center rounded-none text-sm"
        step={1}
        draggable
        onFocus={() => console.log('focus')}
      />

      <Input type="text" value={value} onChange={handleChange} />
    </section>
  )
}
