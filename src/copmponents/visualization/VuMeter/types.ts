export interface VuMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number | number[]
  onValueChange?: (value: number | number[]) => void

  lumpsQuantity?: number
  lumpColors?: LumpColors
  lumpClassName?: string
  lumpsClassName?: string

  showAxis?: boolean
  axisClassName?: string

  isStero?: boolean
  leftChannelDB?: number
  rightChannelDB?: number
}

export type LumpColors = {
  defaultColor: string
  lowColor: string
  mediumColor: string
  highColor: string
}

export type LumpValue = 0 | 1
