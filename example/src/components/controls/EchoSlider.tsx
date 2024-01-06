import { useState } from 'react'
import { Slider, Input, InputChangeEvent } from '@echo-ui'

export const HorizontalSlider = () => {
  const [value, setValue] = useState<number>(0.1)

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

      <Slider className="mb-16 w-60 bg-slate-400 h-2" min={-20} value={50} axis bilateral />
    </>
  )
}
