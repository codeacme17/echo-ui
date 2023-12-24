export interface SpectrumProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: { frequency: number; amplitude: number }[]
}

export interface SpectrumRef extends HTMLDivElement {}
