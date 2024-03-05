export interface LFOProps extends React.HTMLAttributes<HTMLDivElement> {
  frequency?: number
  amplitude?: number
  minFrequency?: number
  maxFrequency?: number
  min?: number
  max?: number
  delay?: number
  type?: 'sine' | 'square' | 'triangle'
  lineColor?: string
  lineWidth?: number
}

export interface LFORef extends HTMLDivElement {}
