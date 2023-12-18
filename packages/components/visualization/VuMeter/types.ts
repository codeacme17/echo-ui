import type { AxisProps } from '../../visualization'

export interface VuMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number | number[]
  vertical?: boolean

  lumpsQuantity?: number
  lumpsColors?: LumpColors
  lumpWidth?: number | string
  lumpHeight?: number | string

  hideAxis?: boolean
  axisProps?: Omit<AxisProps, 'min' | 'max'>
  onChange?: (value: number | number[]) => void
}

export type LumpColors = {
  defaultColor?: string
  lowColor?: string
  mediumColor?: string
  highColor?: string
}

export interface VuMeterContextProps {
  vertical: boolean
  lumpWidth?: number | string
  lumpHeight?: number | string
  getLumpColor: (index: number, lumpValue: LumpValue) => string
}

// Indicates the state of a segment (lump) in the VU meter: 0 for off, 1 for on.
export type LumpValue = 0 | 1

export interface VuMeterRef extends HTMLDivElement {}
