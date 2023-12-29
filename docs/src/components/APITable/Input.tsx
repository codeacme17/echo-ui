import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const InputAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: '输入框的值',
      type: <Code>any</Code>,
      default: <Code>0</Code>,
    },
    {
      attribute: 'type',
      description: '输入框的类型（该属性覆盖了原生的 type 属性）',
      type: <Code>'text' | 'number'</Code>,
      default: <Code>'number'</Code>,
    },
    {
      attribute: 'size',
      description: '输入框的尺寸',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'radius',
      description: '输入框的圆角',
      type: <Code>'none' | 'sm' | 'md' | 'lg' | 'full'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'placeholder',
      description: '输入框的占位符',
      type: <Code>string</Code>,
      default: '-',
    },
    {
      attribute: 'min',
      description: '输入框的最小值',
      type: <Code>number</Code>,
      default: <Code>0</Code>,
    },
    {
      attribute: 'max',
      description: '输入框的最大值',
      type: <Code>number</Code>,
      default: <Code>100</Code>,
    },
    {
      attribute: 'step',
      description: '输入框的步长',
      type: <Code>number</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'sensitivity',
      description: '输入框的灵敏度',
      type: <Code>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10</Code>,
      default: <Code>5</Code>,
    },
    {
      attribute: 'prohibitDrag',
      description: '是否禁止拖动',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'hideProgress',
      description: '是否隐藏进度条',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'progressColor',
      description: '进度条的颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'onChange',
      description: '输入框值变化时的回调函数',
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
