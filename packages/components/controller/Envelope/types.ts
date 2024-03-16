export interface EnvelopeProps extends Omit<React.HTMLAttributes<EnvelopeRef>, 'onChange'> {
  data: EnvelopeData
  limits?: EnvelopeLimits
  lineColor?: string
  lineWidth?: number
  nodeColor?: string
  nodeSize?: number
  onChange?: (data: EnvelopeData) => void
  onChangeEnd?: (data: EnvelopeData) => void
}

export interface EnvelopeData {
  delay?: number
  attack: number
  decay: number
  hold?: number
  sustain: number
  release: number
}

export interface EnvelopeLimits {
  delay?: number
  attack?: number
  hold?: number
  decay?: number
  release?: number
}

export interface EnvelopeRef extends HTMLDivElement {}
