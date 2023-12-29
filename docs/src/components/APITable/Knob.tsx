import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const KnobAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: '旋钮的值',
      type: <Code>number</Code>,
      default: <Code>0</Code>,
    },
    {
      attribute: 'min',
      description: '最小值',
      type: <Code>number</Code>,
      default: <Code>-10</Code>,
    },
    {
      attribute: 'max',
      description: '最大值',
      type: <Code>number</Code>,
      default: <Code>10</Code>,
    },
    {
      attribute: 'step',
      description: '步进值',
      type: <Code>number</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'disabled',
      description: '是否禁用',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'rotationRange',
      description: '旋转范围',
      type: <Code>number</Code>,
      default: <Code>270</Code>,
    },
    {
      attribute: 'bilateral',
      description: '双向旋钮',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'sensitivity',
      description: '灵敏度',
      type: <Code>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'size',
      description: '尺寸',
      type: <Code>number | string</Code>,
      default: <Code>'4rem'</Code>,
    },
    {
      attribute: 'buttonColor',
      description: '按钮颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-button)'</Code>,
    },
    {
      attribute: 'trackColor',
      description: '轨道颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-input)'</Code>,
    },
    {
      attribute: 'trackWidth',
      description: '轨道宽度',
      type: <Code>number | string</Code>,
      default: <Code>'0.5rem'</Code>,
    },
    {
      attribute: 'progressColor',
      description: '进度条颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'pointerWidth',
      description: '指针宽度',
      type: <Code>number | string</Code>,
      default: <Code>'0.375rem'</Code>,
    },
    {
      attribute: 'pointerHeight',
      description: '指针高度',
      type: <Code>number | string</Code>,
      default: <Code>'1rem'</Code>,
    },
    {
      attribute: 'pointerColor',
      description: '指针颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'topLabel',
      description: '顶部标签',
      type: <Code>string | React.ReactNode</Code>,
      default: '-',
    },
    {
      attribute: 'bottomLabel',
      description: '底部标签',
      type: <Code>string | React.ReactNode</Code>,
      default: '-',
    },
    {
      attribute: 'classNames',
      description: '自定义类名',
      type: <Code>{` { button?: string, topLabel?: string, bottomLabel?: string } `}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: '自定义样式',
      type: (
        <Code>{` { button?: React.CSSProperties, topLabel?: React.CSSProperties, bottomLabel?: React.CSSProperties } `}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'onChange',
      description: '值变化回调',
      type: <Code>{`(value: number) => void`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChangeEnd',
      description: '值变化结束回调',
      type: <Code>{`(value: number) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
