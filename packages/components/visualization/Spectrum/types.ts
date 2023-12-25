export interface SpectrumProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: SpectrumDataPoint[]
  lineColor?: string
  lineWidth?: number
  shadow?: boolean
  shadowColor?: string
  onDataChange?: (data: SpectrumDataPoint[]) => void
}

export interface SpectrumDataPoint {
  frequency: number
  amplitude: number
}

export interface SpectrumRef extends HTMLDivElement {}
