import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const ButtonAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: (
        <>
          绑定的值（仅在 <Code> `Group` </Code> 中生效）
        </>
      ),
      type: <Code>any</Code>,
      default: '-',
    },
    {
      attribute: 'disabled',
      description: '指示按钮是否禁用',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: '按钮大小',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'radius',
      description: '按钮边框圆角',
      type: <Code>'none' | 'sm' | 'md' | 'lg' | 'full'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'toggled',
      description: '表示按钮是否切换状态',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'onToggleChange',
      description: '切换状态变化时的回调函数',
      type: <Code>{`(toggled: boolean) => void`}</Code>,
      default: '-',
    },
    {
      attribute: 'value',
      description: '按钮组关联的值',
      type: <Code>any[]</Code>,
      default: '-',
    },
    {
      attribute: 'classNames',
      description: '允许为按钮和切换状态设置自定义类名',
      type: <Code>{'button?: string'}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: '允许为按钮和切换状态设置自定义样式表',
      type: <Code>{`button?: React.CSSProperties`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChange',
      description: '选项变化时的回调函数',
      type: <Code>{`(values: any[]) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
