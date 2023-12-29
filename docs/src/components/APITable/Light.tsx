import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const LightAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'on',
      description: '指示灯是否开启',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: '指示灯的大小',
      type: <Code> number | string </Code>,
      default: <Code>0.75rem</Code>,
    },
    {
      attribute: 'color',
      description: '指示灯灯光颜色',
      type: <Code>string</Code>,
      default: <Code>var(--echo-primary)</Code>,
    },
  ]

  return <APITable data={data} />
}
