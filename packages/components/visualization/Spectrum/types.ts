export interface SpectrumProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: SpectrumDataPoint[]
  fftSize?: number
  amplitudeRange?: [number, number]
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
