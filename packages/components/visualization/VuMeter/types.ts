import type { AxisProps } from '../../visualization'

export interface VuMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number | number[]
  horizontal?: boolean
  lumpsQuantity?: number
  hideAxis?: boolean
  axisProps?: Omit<AxisProps, 'min' | 'max' | 'className' | 'style'>
  classNames?: { axis?: string; lump?: string; lumps?: string }
  styles?: { axis?: React.CSSProperties; lump?: React.CSSProperties; lumps?: React.CSSProperties }
  onChange?: (value: number | number[]) => void
}

export interface StereoVuMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  stereoLumps: LumpValue[][]
}

export interface MonoVuMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  lumps: LumpValue[]
}

export interface VuMeterContextProps extends Omit<VuMeterProps, 'value' | 'onChange'> {
  vertical?: boolean
  minThresholdValue: number
  maxThresholdValue: number
  _lumps: any
  lump: any
}

// Indicates the state of a segment (lump) in the VU meter: 0 for off, 1 for on.
export type LumpValue = 0 | 1

export interface VuMeterRef extends HTMLDivElement {}

export interface StereoVuMeterRef extends HTMLDivElement {}

export interface MonoVuMeterRef extends HTMLDivElement {}
