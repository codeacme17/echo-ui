import { Radio, RadioChangeEvent } from 'echo-ui'
import { useState } from 'react'

export const RadioComponent = () => {
  const [value, setValue] = useState(1)
  const [singleValue, setSingleValue] = useState(false)

  const handleChange = (e: RadioChangeEvent) => {
    setValue(e.value)
  }

  const hanldeClick = () => {
    setSingleValue(!singleValue)
  }

  return (
    <section>
      <Radio.Group
        value={value}
        onChange={handleChange}
        size="sm"
        classNames={{
          button: 'data-[toggled=true]:bg-red-400',
        }}
      >
        <Radio
          value={1}
          size="lg"
          classNames={{
            button: 'group-data-[toggled=true]:bg-red-400',
          }}
        >
          SIN
        </Radio>
        <Radio value={2}>SQUARE</Radio>
        <Radio value={3}>SAW</Radio>
        <Radio value={4}>R SAW</Radio>
      </Radio.Group>

      <Radio checked={singleValue} onClick={hanldeClick} className="mt-1">
        {singleValue ? 'checked' : 'unchecked'}
      </Radio>
    </section>
  )
}
