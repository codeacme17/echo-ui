import { Radio, RadioChangeEvent } from '@echo-ui'
import { useState } from 'react'

export const RadioComponent = () => {
  const [value, setValue] = useState(2)
  const [singleValue, setSingleValue] = useState(false)

  const handleChange = (e: RadioChangeEvent) => {
    setValue(e.value)
  }

  const hanldeClick = () => {
    setSingleValue(!singleValue)
  }

  return (
    <section>
      <Radio.Group value={value} onChange={handleChange} disabled>
        <Radio value={1} size="lg">
          SIN
        </Radio>
        <Radio value={2} disabled>
          SQUARE
        </Radio>
        <Radio value={3} size="sm">
          SAW
        </Radio>
        <Radio value={4}>R SAW</Radio>
      </Radio.Group>

      <Radio checked={singleValue} onClick={hanldeClick} className="ml-2">
        {singleValue ? 'checked' : 'unchecked'}
      </Radio>
    </section>
  )
}
