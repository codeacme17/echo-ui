import { useState } from 'react'
import { Input, InputChangeEvent } from 'echo-ui'

export const InputComponent = () => {
  const [value, setValue] = useState(0)

  const handleChange = (e: InputChangeEvent) => {
    console.log(e.value)
    setValue(e.value)
  }
  return (
    <section>
      <Input type="number" value={value} onChange={handleChange} step={0.1} />
    </section>
  )
}
