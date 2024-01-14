import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const LightAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'on',
      description: 'Whether the indicator light is on',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: 'Size of the indicator light',
      type: <Code>number | string</Code>,
      default: <Code>0.75rem</Code>,
    },
    {
      attribute: 'color',
      description: 'Color of the indicator light',
      type: <Code>string</Code>,
      default: <Code>var(--echo-primary)</Code>,
    },
  ]

  return <APITable data={data} />
}
