export interface EnvelopeProps extends React.HTMLAttributes<EnvelopeRef> {
  data: EnvelopeData
  limits?: EnvelopeLimits
  lineColor?: string
  lineWidth?: number
  nodeColor?: string
  nodeSize?: number
  onDataChange?: (data: EnvelopeData) => void
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
