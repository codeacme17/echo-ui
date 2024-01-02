import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const VuMeterAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value*',
      description: '当前音量的值，在传入数组时开启双声道模式（必传）',
      type: <Code>number | number[]</Code>,
      default: '-',
    },
    {
      attribute: 'horizontal',
      description: '开启水平模式',
      type: <Code> boolean </Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'compact',
      description: '开启紧凑模式',
      type: <Code> boolean </Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'lumpsQuantity',
      description: '音量条的数量',
      type: <Code> number </Code>,
      default: <Code>30</Code>,
    },
    {
      attribute: 'hideAxis',
      description: '隐藏坐标',
      type: <Code> boolean </Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'axisProps',
      description: '传递给 Axis 组件的 props',
      type: <Code> boolean </Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'classNames',
      description: '自定义样式类名',
      type: <Code>{`{ lump?: string, lumps?: string, axis?: string }`}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: '自定义样式',
      type: (
        <Code>{`{ lump?: React.CSSProperties, lumps?: React.CSSProperties, axis?: React.CSSProperties }`}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'onChange',
      description: '值变化时的回调函数',
      type: <Code>{`(value: number | number[]) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
