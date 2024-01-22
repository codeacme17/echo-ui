import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const WaveformAPITable = () => {
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
    {
      attribute: 'waveHeight',
      description: 'The percentage of this waveform compared to the height of the container',
      type: <Code>number</Code>,
      default: <Code>100</Code>,
    },
    {
      attribute: 'waveColor',
      description: 'The color of the waveform',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-wave)'</Code>,
    },
    {
      attribute: 'maskColor',
      description: 'The color of the mask layer',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'hideCursor',
      description: 'Hide the cursor',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'cursorWidth',
      description: 'The width of the cursor',
      type: <Code>number</Code>,
      default: <Code>2</Code>,
    },
    {
      attribute: 'cursorColor',
      description: 'The color of the cursor',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-muted-foreground)'</Code>,
    },
    {
      attribute: 'hideCursorLabel',
      description: 'Hide the time label of the cursor',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'disableAnimation',
      description: 'Disable animation when waveform is initialized',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'animationDuration',
      description: 'The duration of the animation, in milliseconds',
      type: <Code>number</Code>,
      default: <Code>300</Code>,
    },
    {
      attribute: 'onClick',
      description: 'The callback function when click the waveform',
      type: <Code>{`(e: WaveformMouseEvent) => void`}</Code>,
      default: '-',
    },
    {
      attribute: 'onMouseMove',
      description: 'The callback function when move the mouse on the waveform',
      type: <Code>{`(e: WaveformMouseEvent) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
