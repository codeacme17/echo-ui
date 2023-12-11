import { useState } from 'react'
import { Input, InputChangeEvent } from 'echo-ui'

export const InputComponent = () => {
  const [value, setValue] = useState(-1)

  const handleChange = (e: InputChangeEvent) => {
    setValue(e.value)
  }
  return (
    <section>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        className="mb-3 w-16 px-2 py-1"
        min={-10}
      />

      <Input type="text" value={value} onChange={handleChange} step={0.1} />
    </section>
  )
}
