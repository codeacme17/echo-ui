import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const OscilloscopeAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'data',
      description: '传递给示波器的数组数据',
      type: <Code>OscilloscopeDataPoint[]</Code>,
      default: '-',
    },
    {
      attribute: 'amplitudeRange',
      description: '示波器的振幅范围',
      type: <Code>[number, number]</Code>,
      default: <Code> [-2, 2]</Code>,
    },
    {
      attribute: 'lineColor',
      description: '示波器的线条颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'lineWidth',
      description: '示波器的线条宽度',
      type: <Code>number</Code>,
      default: <Code>3</Code>,
    },
  ]

  return <APITable data={data} />
}
