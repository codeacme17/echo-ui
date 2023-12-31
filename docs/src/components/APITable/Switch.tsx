import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const SwitchAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'disabled',
      description: '是否禁用开关',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'toggled',
      description: '开关的状态',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: '开关的尺寸',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'classNames',
      description: '自定义样式类名',
      type: <Code>{`{ label?: string; button?: string; thumb?: string }`}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: '自定义样式',
      type: (
        <Code>{`{ label?: React.CSSProperties; button?: React.CSSProperties; thumb?: React.CSSProperties }`}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'onChange',
      description: '状态变化时的回调函数',
      type: <Code>{`(toggled: boolean) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
