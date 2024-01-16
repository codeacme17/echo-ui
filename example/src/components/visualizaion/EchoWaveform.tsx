import { Waveform } from '@echo-ui'

export const EchoWaveform = () => {
  const DATA_LENGTH = 500

  const data = Array.from(
    { length: DATA_LENGTH },
    (_, i) => Math.sin((i / DATA_LENGTH) * 2 * Math.PI * 10) * (0.5 + Math.random() * 0.5),
  )

  console.log(data)

  return (
    <section>
      <Waveform data={data} />
    </section>
  )
}
