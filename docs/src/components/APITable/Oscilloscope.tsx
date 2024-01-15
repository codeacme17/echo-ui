import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const OscilloscopeAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'data*',
      description: 'Array data passed to the oscilloscope(required)',
      type: <Code>OscilloscopeDataPoint[]</Code>,
      default: '-',
    },
    {
      attribute: 'amplitudeRange',
      description: 'Amplitude range, this property specifies the range of the Y-axis',
      type: <Code>[number, number]</Code>,
      default: <Code>[-2, 2]</Code>,
    },
    {
      attribute: 'lineColor',
      description: "Color of the oscilloscope's line",
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'lineWidth',
      description: "Width of the oscilloscope's line",
      type: <Code>number</Code>,
      default: <Code>3</Code>,
    },
  ]

  return <APITable data={data} />
}
