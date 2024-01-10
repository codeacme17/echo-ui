import { Envelope } from '@echo-ui'

export const EchoEnvelop = () => {
  const envelopeData = {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.7,
    release: 0.1,
  }

  return (
    <section>
      <Envelope data={envelopeData} />
    </section>
  )
}
