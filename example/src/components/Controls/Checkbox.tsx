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
      <Checkbox.Group value={value} onChange={handleChange}>
        <Checkbox value={1}>123</Checkbox>
        <Checkbox value={2}>123</Checkbox>
        <Checkbox value={3}>123</Checkbox>
      </Checkbox.Group>

      <Checkbox value={singleValue} onChange={handleSingleChange}>
        123
      </Checkbox>
    </>
  )
}
