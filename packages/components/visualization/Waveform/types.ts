export interface WaveformProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseMove' | 'onClick'> {
  data: number[]
  percentage?: number
  hideCursor?: boolean
  cursorWidth?: number

  waveHeight?: number
  lineWidth?: number
  waveColor?: string
  maskColor?: string

  onClick?: (e: WaveformClickEvent) => void
  onMouseMove?: (e: React.MouseEvent) => void
}

export interface WaveformClickEvent {
  percentage: number
  nativeEvent: React.MouseEvent
}

export interface WaveformRef extends HTMLDivElement {}
