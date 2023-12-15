export interface AxisProps extends React.SVGAttributes<SVGSVGElement> {
  min?: number
  max?: number
  ticks?: number
  tickSize?: number
  vertical?: boolean
}

export interface AxisRef extends SVGSVGElement {}
