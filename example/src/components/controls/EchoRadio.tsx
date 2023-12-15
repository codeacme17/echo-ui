import { Radio, RadioChangeEvent } from 'echo-ui'
import { useRef, useState } from 'react'

export const RadioComponent = () => {
  const [value, setValue] = useState(1)
  const [singleValue, setSingleValue] = useState(false)

  const count = useRef(0)

  const handleChange = (e: RadioChangeEvent) => {
    setValue(e.value)
  }

  const handleSingleChange = () => {
    setSingleValue(!singleValue)
    count.current++
    console.log(count.current)
  }

  return (
    <section>
      <Radio.Group value={value} onChange={handleChange}>
        <Radio value={1}>SIN</Radio>
        <Radio value={2}>SQUARE</Radio>
        <Radio value={3}>SAW</Radio>
        <Radio value={4}>R SAW</Radio>
      </Radio.Group>

      <Radio
        checked={singleValue}
        onChange={handleSingleChange}
        className="mt-1"
        checkedColor="red"
      >
        {singleValue ? 'checked' : 'unchecked'}
      </Radio>
    </section>
  )
}
