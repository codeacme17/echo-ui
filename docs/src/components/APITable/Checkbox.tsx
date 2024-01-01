import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const CheckboxAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: (
        <>
          单选框绑定的值（仅在 <Code> Group </Code> 中生效）
        </>
      ),
      type: <Code>any</Code>,
      default: '-',
    },
    {
      attribute: 'checked',
      description: '是否选中多选框',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'disabled',
      description: '是否禁用多选框',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },

    {
      attribute: 'size',
      description: '多选框的尺寸',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'color',
      description: '多选框激活时的颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'classNames',
      description: '自定义样式类名',
      type: <Code>{`{ label?: string }`}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: '自定义样式',
      type: <Code>{`{ label?: React.CSSProperties }`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChange',
      description: '状态变化时的回调函数',
      type: <Code>{`(e: RadioChangeEvent) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}

export const CheckboxGroupAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: (
        <>
          多选框组绑定的数组, 用于表示包含当前选中项的 <Code> value </Code> 值
        </>
      ),
      type: <Code>any</Code>,
      default: '-',
    },

    {
      attribute: 'disabled',
      description: '是否禁用组中的多选框',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },

    {
      attribute: 'size',
      description: '组中的多选框的尺寸',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'color',
      description: '组中的多选框激活时的颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'classNames',
      description: '自定义样式类名',
      type: <Code>{`{ label?: string }`}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: '自定义样式',
      type: <Code>{`{ label?: React.CSSProperties }`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChange',
      description: '状态变化时的回调函数',
      type: <Code>{`(e: RadioChangeEvent) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
