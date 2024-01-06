export interface SpectrumProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: SpectrumDataPoint[]
  fftSize?: number
  sampleRate?: 8000 | 11025 | 22050 | 32000 | 44100 | 48000 | 88200 | 96000 | 176400 | 192000
  lineColor?: string
  lineWidth?: number
  axis?: boolean
  xAxisTicks?: number[]
  yAxisTicks?: number[]
  grid?: boolean
  shadow?: boolean
  shadowColor?: string
  shadowDirection?: 'top' | 'bottom'
  shadowHeight?: number
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  onDataChange?: (data: SpectrumDataPoint[]) => void
}

export interface SpectrumDataPoint {
  frequency: number
  amplitude: number
}

export interface SpectrumRef extends HTMLDivElement {}
