export interface VuMeterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  dB: number
  onDBChange?: (value: number) => void

  lumpsQuantity?: number
  lumpColors?: LumpColors
  lumpClassName?: string
  lumpsClassName?: string

  showAxis?: boolean
  axisClassName?: string

  isStero?: boolean
}

export type LumpColors = {
  lowColor: string
  mediumColor: string
  highColor: string
  lowColorDark?: string
  mediumColorDark?: string
  highColorDark?: string
}

export type LumpValue = 0 | 1
