import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const VuMeterAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value*',
      description: 'The current volume value. Enables stereo mode when passing an array (required)',
      type: <Code>number | number[]</Code>,
      default: '-',
    },
    {
      attribute: 'horizontal',
      description: 'Enable horizontal mode',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'compact',
      description: 'Enable compact mode',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'lumpsQuantity',
      description: 'Number of volume bars',
      type: <Code>number</Code>,
      default: <Code>30</Code>,
    },
    {
      attribute: 'hideAxis',
      description: 'Hide axis',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'axisProps',
      description: 'Props passed to the Axis component',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'classNames',
      description: 'Custom class names',
      type: <Code>{`{ lump?: string, lumps?: string, axis?: string }`}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: 'Custom styles',
      type: (
        <Code>{`{ lump?: React.CSSProperties, lumps?: React.CSSProperties, axis?: React.CSSProperties }`}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'onChange',
      description: 'Callback function when the value changes',
      type: <Code>{`(value: number | number[]) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
