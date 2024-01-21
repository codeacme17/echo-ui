import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const WaveformAPITable = () => {
  /* 
  data: number[] | number[][]
  audioDuration: number

  percentage?: number
  hideCursor?: boolean
  cursorWidth?: number
  cursorColor?: string
  hideCursorLabel?: boolean

  disableAnimation?: boolean
  animationDuration?: number

  waveHeight?: number
  waveColor?: string
  maskColor?: string

  onClick?: (e: WaveformClickEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  onMouseMove?: (e: React.MouseEvent) => void
*/

  const data: APITableDataType[] = [
    {
      attribute: 'data*',
      description:
        'The data of the waveform, if pass a 2D array will render stereo waveform(required)',
      type: <Code>number[] | number[][]</Code>,
      default: '-',
    },
    {
      attribute: 'audioDuration*',
      description: 'The duration of the audio(required)',
      type: <Code>number</Code>,
      default: '-',
    },
    {
      attribute: 'percentage',
      description: 'The width percentage of the mask layer compared to the waveform',
      type: <Code>number</Code>,
      default: <Code>0</Code>,
    },
  ]

  return <APITable data={data} />
}
