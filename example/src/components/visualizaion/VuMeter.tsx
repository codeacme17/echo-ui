import { useState } from 'react'
import { VuMeter } from '@/copmponents/visualization/VuMeter'

export const VuMeterComponent = () => {
  const [value, setValue] = useState(-10)

  // setInterval(() => {
  //   setValue(Math.random() * 20)
  //   console.log(Math.random() * 20)
  // }, 1000)

  return (
    <section>
      <button onClick={() => setValue(Math.random() * 20)}>increase</button>
      <VuMeter volumn={value} onVolumnChange={setValue} />
    </section>
  )
}
