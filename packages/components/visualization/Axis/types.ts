export interface AxisProps extends React.SVGAttributes<SVGSVGElement> {
  min?: number
  max?: number
  ticks?: number
  tickSize?: number
  vertical?: boolean
  relatedRef?: React.RefObject<HTMLElement | null>
}

export type AxisRef = SVGSVGElement
