export interface SpectrumProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SpectrumDataPoint[]
  fftSize: number

  lineColor?: string
  lineWidth?: number
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
