import { Slider } from 'echo-ui'

export const SliderComponent = () => {
  return (
    <section className="flex flex-col items-center">
      <Slider className="mb-10 w-80" />

      <Slider vertical className="h-80" step={10} />
    </section>
  )
}
