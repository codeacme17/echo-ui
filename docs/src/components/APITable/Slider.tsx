import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const SliderAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: '滑块的值',
      type: <Code>number</Code>,
      default: '-',
    },
    {
      attribute: 'min',
      description: '最小值',
      type: <Code>number</Code>,
      default: <Code>0</Code>,
    },
    {
      attribute: 'max',
      description: '最大值',
      type: <Code>number</Code>,
      default: <Code>100</Code>,
    },
    {
      attribute: 'step',
      description: '步长',
      type: <Code>number</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'disabled',
      description: '是否禁用滑块',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'vertical',
      description: '是否垂直方向显示',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'bilateral',
      description: '是否双向滑块',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'hideThumb',
      description: '是否隐藏滑块',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'hideThumbLabel',
      description: '是否隐藏滑块标签',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'prohibitInteraction',
      description: '是否禁止交互',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'classNames',
      description: '自定义样式类名',
      type: (
        <Code>{`{ progress?: string; thumb?: string; thumbLabel?: string; axis?: string }`}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'styles',
      description: '自定义样式',
      type: (
        <Code>{`{ progress?: React.CSSProperties; thumb?: React.CSSProperties; thumbLabel?: React.CSSProperties; axis?: React.CSSProperties }`}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'axis',
      description: '是否显示轴',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'axisProps',
      description: '轴的属性',
      type: <Code>AxisProps</Code>,
      default: '-',
    },
    {
      attribute: 'onChange',
      description: '值变化时的回调函数',
      type: <Code>{`(value: number) => void`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChangeEnd',
      description: '值变化结束时的回调函数',
      type: <Code>{`(value: number) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
