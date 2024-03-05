import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const LFOAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'frequency',
      description:
        'Controls the frequency of the waveform in Hertz (Hz). Frequency determines the number of cycles per second.',
      type: <Code>number</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'amplitude',
      description:
        "Controls the amplitude of the waveform. Amplitude determines the height of the waveform's peak. (range: 0-1)",
      type: <Code>number</Code>,
      default: <Code>0</Code>,
    },
    {
      attribute: 'delay',
      description:
        'Sets the delay time before the waveform starts, in milliseconds (ms). This can be used to create a pause effect before the waveform begins. (range: 0-1000)',
      type: <Code>number</Code>,
      default: <Code>0</Code>,
    },
    {
      attribute: 'type',
      description:
        "Specifies the type of the waveform. Options include sine wave ('sine'), square wave ('square'), and triangle wave ('triangle').",
      type: <Code>'sine' | 'square' | 'triangle'</Code>,
      default: <Code>'sine'</Code>,
    },
    {
      attribute: 'lineColor',
      description: 'Sets the color of the waveform line. Can be any valid CSS color value.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'lineWidth',
      description: 'Determines the thickness of the waveform line, in pixels.',
      type: <Code>number</Code>,
      default: <Code>3</Code>,
    },
  ]
  return <APITable data={data} />
}
