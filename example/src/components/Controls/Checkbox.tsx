import { useState } from 'react'
import {
  Checkbox,
  CheckboxChangeEvent,
  SineIcon,
  SquareIcon,
  SawtoothIcon,
  TriangleIcon,
} from 'echo-ui'

export const CheckboxComponent = () => {
  const [value, setValue] = useState([1, 2, 3])

  const handleChange = (e: CheckboxChangeEvent) => {
    setValue(e.value)
  }

  const [singleValue, setSingleValue] = useState(false)
  const handleSingleChange = () => {
    setSingleValue(!singleValue)
  }

  return (
    <section className="flex">
      <Checkbox.Group value={value} className="flex-col gap-5" onChange={handleChange}>
        <Checkbox value={1}>
          <SineIcon className="w-10 h-10" />
        </Checkbox>
        <Checkbox value={2}>
          <SquareIcon className="w-10 h-10" />
        </Checkbox>
        <Checkbox value={3}>
          <SawtoothIcon className="w-10 h-10" />
        </Checkbox>
        <Checkbox value={4}>
          <TriangleIcon className="w-10 h-10" />
        </Checkbox>
      </Checkbox.Group>

      <Checkbox value={singleValue} onChange={handleSingleChange} className="ml-10">
        {singleValue ? 'on' : 'off'}
      </Checkbox>
    </section>
  )
}
