export interface VuMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  // The current volume level.
  // A single number for mono or an array of two numbers for stereo.
  value: number | number[]

  // Callback function when the volume level changes.
  onValueChange?: (value: number | number[]) => void

  // The number of segments (lumps) in the VU meter.
  lumpsQuantity?: number

  // Color settings for the VU meter segments based on volume levels.
  lumpColors?: LumpColors

  // Class name for individual segments (lumps) in the VU meter.
  lumpClassName?: string

  // Class name for the container of the segments (lumps).
  lumpsClassName?: string

  // Whether to show the axis (scale) or not.
  showAxis?: boolean

  // Class name for the axis (scale) of the VU meter.
  axisClassName?: string

  // Indicates whether the VU meter is in stereo mode.
  isStero?: boolean

  // The dB value for the left channel in stereo mode.
  leftChannelDB?: number

  // The dB value for the right channel in stereo mode.
  rightChannelDB?: number
}

export type LumpColors = {
  // Default color for the segments (lumps).
  defaultColor: string

  // Color for segments representing low volume levels.
  lowColor: string

  // Color for segments representing medium volume levels.
  mediumColor: string

  // Color for segments representing high volume levels.
  highColor: string
}

// Indicates the state of a segment (lump) in the VU meter: 0 for off, 1 for on.
export type LumpValue = 0 | 1