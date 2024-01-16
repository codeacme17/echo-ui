export interface WaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  percentage?: number
  waveHeight?: number
  lineWidth?: number
  waveColor?: string
  maskColor?: string
}

export interface WaveformRef extends HTMLDivElement {}
