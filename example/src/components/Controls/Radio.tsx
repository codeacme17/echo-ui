import { Radio, RadioChangeEvent } from 'echo-ui'
import { useState } from 'react'

export const RadioComponent = () => {
  const [value, setValue] = useState(0)
  const [singleValue, setSingleValue] = useState(false)

  const handleChange = (e: RadioChangeEvent) => {
    setValue(e.target.value)
  }

  const handleSingleChange = () => {
    setSingleValue(!singleValue)
  }

  return (
    <section>
      <Radio.group value={value} onChange={handleChange}>
        <Radio value={1}>SIN</Radio>
        <Radio value={2}>SQUARE</Radio>
        <Radio value={3}>SAW</Radio>
        <Radio value={4}>R SAW</Radio>
      </Radio.group>

      <Radio checked={singleValue} onChange={handleSingleChange}>
        {singleValue ? 'checked' : 'unchecked'}
      </Radio>
    </section>
  )
}
