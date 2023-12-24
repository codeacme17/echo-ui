import type { AxisProps } from '../../visualization'

export interface VuMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number | number[]
  vertical?: boolean

  lumpsQuantity?: number
  lumpsColors?: LumpColors

  hideAxis?: boolean
  axisProps?: Omit<AxisProps, 'min' | 'max' | 'className' | 'style'>

  classNames?: { axis?: string; lump?: string; lumps?: string }
  styles?: { axis?: React.CSSProperties; lump?: React.CSSProperties; lumps?: React.CSSProperties }
  onChange?: (value: number | number[]) => void
}

export type LumpColors = {
  defaultColor?: string
  lowColor?: string
  mediumColor?: string
  highColor?: string
}

export interface VuMeterContextProps extends Omit<VuMeterProps, 'value' | 'onChange'> {
  vertical: boolean
  minThresholdValue: number
  maxThresholdValue: number
}

// Indicates the state of a segment (lump) in the VU meter: 0 for off, 1 for on.
export type LumpValue = 0 | 1

export interface VuMeterRef extends HTMLDivElement {}
