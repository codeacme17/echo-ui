import { Slider } from 'echo-ui'

export const SliderComponent = () => {
  return (
    <section className="flex flex-col items-center">
      {/* Horizontal Slider */}
      <Slider className="mb-16 w-80" />

      {/* Vertical Slider */}
      <Slider vertical className="h-80" min={10} step={10} />
    </section>
  )
}
