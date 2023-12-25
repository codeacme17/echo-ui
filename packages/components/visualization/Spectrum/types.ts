export interface SpectrumProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: SpectrumData[]
  onDataChange?: (data: SpectrumData[]) => void
}

export interface SpectrumData {
  frequency: number
  amplitude: number
}

export interface SpectrumRef extends HTMLDivElement {}
