import type { AxisProps } from '../../visualization'

export interface SliderProps extends Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  vertical?: boolean
  disabled?: boolean
  hideThumb?: boolean
  hideThumbLabel?: boolean
  prohibitInteraction?: boolean
  hideAxis?: boolean
  axisProps?: AxisProps
  onChange?: (value: number) => void
}

export interface SliderRef extends HTMLDivElement {}
