export interface WaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  lineColor?: string
  lineWidth?: number
}

export interface WaveformRef extends HTMLDivElement {}
