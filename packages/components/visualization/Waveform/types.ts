export interface WaveformProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseMove' | 'onClick'> {
  data: number[] | number[][]
  audioDuration: number

  percentage?: number
  hideCursor?: boolean
  cursorWidth?: number
  cursorColor?: string

  waveHeight?: number
  waveColor?: string
  maskColor?: string

  onClick?: (e: WaveformClickEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  onMouseMove?: (e: React.MouseEvent) => void
}

export interface WaveformClickEvent {
  time: number
  percentage: number
  nativeEvent: React.MouseEvent
}

export interface WaveformRef extends HTMLDivElement {}
