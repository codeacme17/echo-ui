import { Slider } from 'echo-ui'

export const SliderComponent = () => {
  return (
    <section className="w-80">
      <Slider className="mb-10" />
      <Slider vertical className="h-80" />
    </section>
  )
}
