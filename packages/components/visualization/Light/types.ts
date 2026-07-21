export interface LightProps extends React.HTMLAttributes<HTMLDivElement> {
  on?: boolean
  size?: number | string
  color?: string
}

export type LightRef = HTMLDivElement
