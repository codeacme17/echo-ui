export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean

  /**
   * @description The available rotation range.
   * @range (90 - 360)
   */
  rotationRange?: number
  bilateral?: boolean
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  size?: number | string
  buttonColor?: string
  trackColor?: string
  trackWidth?: number | string
  progressColor?: string
  pointerWidth?: number | string
  pointerHeight?: number | string
  pointerColor?: string
  topLabel?: string | React.ReactNode
  bottomLabel?: string | React.ReactNode
  classNames?: {
    button?: string
    topLabel?: string
    bottomLabel?: string
  }
  styles?: {
    button?: React.CSSProperties
    topLabel?: React.CSSProperties
    bottomLabel?: React.CSSProperties
  }
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
}

export interface KnobGroupProps
  extends Omit<
    KnobProps,
    'value' | 'onChange' | 'onChangeEnd' | 'classNames' | 'styles' | 'bottomLabel' | 'topLabel'
  > {
  classNames?: { knob?: string } & KnobProps['classNames']
  styles?: { knob?: React.CSSProperties } & KnobProps['styles']
}

export interface KnobRef extends HTMLDivElement {}

export interface KnobGroupRef extends HTMLDivElement {}
