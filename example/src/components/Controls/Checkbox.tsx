import { useEffect, useState } from 'react'
import { Checkbox, CheckboxChangeEvent } from 'echo-ui'

export const CheckboxComponent = () => {
  const [value, setValue] = useState([1, 2, 3])

  const handleChange = (e: CheckboxChangeEvent) => {
    setValue(e.value)
  }

  const [singleValue, setSingleValue] = useState(false)
  const handleSingleChange = () => {
    setSingleValue(!singleValue)
  }

  useEffect(() => {
    console.log(singleValue)
  }, [singleValue])

  return (
    <>
      <Checkbox.Group
        value={value}
        checkboxInputClassName="w-8 h-8 checked:border-8"
        onChange={handleChange}
      >
        <Checkbox value={1}>Sine</Checkbox>
        <Checkbox value={2}>Square</Checkbox>
        <Checkbox value={3}>Sawtooth</Checkbox>
        <Checkbox value={4} checkboxInputClassName="w-8 h-8 checked:border-4">
          Triangle
        </Checkbox>
      </Checkbox.Group>

      <Checkbox value={singleValue} onChange={handleSingleChange}>
        {singleValue ? 'on' : 'off'}
      </Checkbox>
    </>
  )
}
