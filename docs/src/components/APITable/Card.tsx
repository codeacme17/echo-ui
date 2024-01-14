import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const CardAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'toggled',
      description: 'Is the card activated',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
  ]

  return <APITable data={data} />
}
