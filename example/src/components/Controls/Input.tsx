import { useState } from 'react'
import { Input, InputChangeEvent } from 'echo-ui'

export const InputComponent = () => {
  const [value, setValue] = useState(0)

  const handleChange = (e: InputChangeEvent) => {
    setValue(e.value)
  }

  return (
    <section>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        className="mb-5 w-16 py-1 px-0 text-center rounded-none text-sm"
        min={-20}
        step={0.01}
        hideProgress
      />

      <Input type="text" value={value} onChange={handleChange} step={0.1} />
    </section>
  )
}
