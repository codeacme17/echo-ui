import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const InputAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: 'The value of the input box',
      type: <Code>any</Code>,
      default: <Code>0</Code>,
    },
    {
      attribute: 'type',
      description: 'The type of the input box (overrides the native type attribute)',
      type: <Code>'text' | 'number'</Code>,
      default: <Code>'number'</Code>,
    },
    {
      attribute: 'bilateral',
      description: 'Whether to enable bidirectional dragging',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: 'The size of the input box',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'radius',
      description: 'The border radius of the input box',
      type: <Code>'none' | 'sm' | 'md' | 'lg' | 'full'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'min',
      description: 'The minimum value of the input box',
      type: <Code>number</Code>,
      default: <Code>0</Code>,
    },
    {
      attribute: 'max',
      description: 'The maximum value of the input box',
      type: <Code>number</Code>,
      default: <Code>100</Code>,
    },
    {
      attribute: 'step',
      description: 'The step value of the input box',
      type: <Code>number</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'sensitivity',
      description: 'The sensitivity of the input box',
      type: <Code>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10</Code>,
      default: <Code>5</Code>,
    },
    {
      attribute: 'prohibitDrag',
      description: 'Whether to disable dragging',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'hideProgress',
      description: 'Whether to hide the progress bar',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'progressColor',
      description: 'The color of the progress bar',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'onChange',
      description: 'Callback function when the value of the input box changes',
      type: (
        <Code>{`(e: {
          value: any,
          nativeEvent?: React.ChangeEvent<HTMLInputElement>
        }) => void`}</Code>
      ),
      default: '-',
    },
  ]

  return <APITable data={data} />
}
