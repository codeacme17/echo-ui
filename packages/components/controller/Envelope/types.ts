export interface EnvelopeProps extends React.HTMLAttributes<EnvelopeRef> {
  data: EnvelopeData
  lineColor?: string
  lineWidth?: number
  nodeColor?: string
  nodeSize?: number
}

export interface EnvelopeData {
  attack: number
  decay: number
  sustain: number
  release: number
}

export interface EnvelopeRef extends HTMLDivElement {}
