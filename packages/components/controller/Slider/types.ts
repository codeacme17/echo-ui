import type { AxisProps } from '../../visualization'

export interface SliderProps extends Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  vertical?: boolean
  bilateral?: boolean
  hideThumb?: boolean
  hideThumbLabel?: boolean
  prohibitInteraction?: boolean
  progressColor?: string
  classNames?: {
    thumb?: string
    thumbLabel?: string
  }
  styles?: {
    thumb?: React.CSSProperties
    thumbLabel?: React.CSSProperties
  }
  hideAxis?: boolean
  axisProps?: AxisProps
  onChange?: (value: number) => void
}

export interface SliderRef extends HTMLDivElement {}
