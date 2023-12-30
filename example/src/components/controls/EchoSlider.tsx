import { useRef, useState } from 'react'
import { Slider, Input, InputChangeEvent } from '@echo-ui'

export const HorizontalSlider = () => {
  const [value, setValue] = useState<number>(0.1)

  const SliderRef = useRef(null)
  const handleChange = (e: InputChangeEvent) => {
    setValue(e.value)
  }

  return (
    <>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        className="mb-3 w-12 py-0 px-0 text-center rounded-none text-sm"
      />

      <Slider
        ref={SliderRef}
        className="mb-16 w-80"
        value={value}
        onChange={setValue}
        bilateral
        min={-10}
        max={10}
      />
    </>
  )
}
