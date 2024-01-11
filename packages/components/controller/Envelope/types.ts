export interface EnvelopeProps extends React.HTMLAttributes<EnvelopeRef> {
  data: EnvelopeData
  lineColor?: string
  lineWidth?: number
  nodeColor?: string
  nodeSize?: number
  onDataChange?: (data: EnvelopeData) => void
}

export interface EnvelopeRanges {
  attack: [number, number]
  decay: [number, number]
  hold: [number, number]
  sustain: [number, number]
  release: [number, number]
}

export interface EnvelopeData {
  delay: number
  attack: number
  decay: number
  hold: number
  sustain: number
  release: number
}

export interface EnvelopeRef extends HTMLDivElement {}
