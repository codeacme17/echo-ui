import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const EnvelopeAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'data*',
      description: 'The ADSP data to be displayed(required)',
      type: <Code>EnvelopeData</Code>,
      default: '-',
    },
    {
      attribute: 'limits',
      description: 'The limits of each ADSP data',
      type: <Code>EnvelopeLimits</Code>,
      default: <Code>0.75rem</Code>,
    },
    {
      attribute: 'lineColor',
      description: 'Color of the line',
      type: <Code>string</Code>,
      default: <Code>var(--echo-primary)</Code>,
    },
    {
      attribute: 'lineWidth',
      description: 'Width of the line',
      type: <Code>number</Code>,
      default: <Code>3</Code>,
    },
    {
      attribute: 'nodeColor',
      description: 'Color of the node',
      type: <Code>string</Code>,
      default: <Code>var(--echo-secondary)</Code>,
    },
    {
      attribute: 'nodeSize',
      description: 'Size of the node',
      type: <Code>number</Code>,
      default: <Code>6</Code>,
    },
    {
      attribute: 'onChange',
      description: 'The callback function when data changed',
      type: <Code>{`(data: EnvelopeData) => void`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChangeEnd',
      description: 'The callback function when data changed ended',
      type: <Code>{`(data: EnvelopeData) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
