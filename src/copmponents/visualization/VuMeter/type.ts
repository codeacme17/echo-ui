export interface VuMeterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  dB: number
  lumpQuantity?: number
  lumpColors?: LumpColors
  showAxis?: boolean
  lumpClassName?: string
  lumpsClassName?: string
  axisClassName?: string

  onDBChange?: (value: number) => void
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
