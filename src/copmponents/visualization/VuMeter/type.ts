export interface VuMeterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  dB: number
  colors?: Colors
  lumpQuantity?: number
  onDBChange?: (value: number) => void
}

export type Colors = {
  lowColor: string
  mediumColor: string
  highColor: string
  lowColorDark?: string
  mediumColorDark?: string
  highColorDark?: string
}

export type LumpValue = 0 | 1
