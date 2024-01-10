import { Envelope, EnvelopeData } from '@echo-ui'

export const EchoEnvelop = () => {
  const envelopeData: EnvelopeData = {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.8,
    release: 0.7,
  }

  return (
    <section>
      <Envelope data={envelopeData} />
    </section>
  )
}
