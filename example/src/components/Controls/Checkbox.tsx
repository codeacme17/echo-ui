import { useState } from 'react'
import { Checkbox, CheckboxChangeEvent } from 'echo-ui'
import { Sine, Square, Sawtooth, Triangle } from '../icons'

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
    <>
      <Checkbox.Group value={value} onChange={handleChange}>
        <Checkbox value={1}>
          <Sine />
        </Checkbox>
        <Checkbox value={2}>
          <Square />
        </Checkbox>
        <Checkbox value={3}>
          <Sawtooth />
        </Checkbox>
        <Checkbox value={4}>
          <Triangle />
        </Checkbox>
      </Checkbox.Group>

      <Checkbox value={singleValue} onChange={handleSingleChange}>
        {singleValue ? 'on' : 'off'}
      </Checkbox>
    </>
  )
}
