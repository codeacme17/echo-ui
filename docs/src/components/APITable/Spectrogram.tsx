import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const SpectrogramtAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'data',
      description: '指示灯是否开启',
      type: <Code>SpectrogramDataPoint[]</Code>,
      default: '-',
    },
    {
      attribute: 'fftSize',
      description: '快速傅立叶变换的大小(必须为 2 的指数)',
      type: <Code> number </Code>,
      default: <Code>1024</Code>,
    },
    {
      attribute: 'amplitudeRange',
      description: '振幅范围，该属性可以指定 Y 轴的范围',
      type: <Code>[number, number]</Code>,
      default: <Code>[-100, 10]</Code>,
    },
    {
      attribute: 'lineColor',
      description: '线条颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'lineWidth',
      description: '线条宽度',
      type: <Code>number</Code>,
      default: <Code>2</Code>,
    },
    {
      attribute: 'axis',
      description: '是否显示坐标轴',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'axisColor',
      description: '坐标轴字体颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-muted-foreground)'</Code>,
    },
    {
      attribute: 'xAxisTicks',
      description: 'X 轴展示的刻度',
      type: <Code>number[]</Code>,
      default: <Code>[50, 100, 200, 500, 1000, 2000, 5000, 10000]</Code>,
    },
    {
      attribute: 'xAxisTicks',
      description: 'X 轴展示的刻度',
      type: <Code>number[]</Code>,
      default: <Code>[50, 100, 200, 500, 1000, 2000, 5000, 10000]</Code>,
    },
    {
      attribute: 'yAxisTicks',
      description: 'Y 轴展示的刻度',
      type: <Code>number[]</Code>,
      default: <Code>[-80, -60, -20, 0]</Code>,
    },
    {
      attribute: 'grid',
      description: '是否显示网格线',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'gridColor',
      description: '网格线颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-background)'</Code>,
    },
    {
      attribute: 'shadow',
      description: '是否显示阴影',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'shadowColor',
      description: '阴影颜色',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'shadowDirection',
      description: '阴影方向',
      type: <Code>'top' | 'bottom'</Code>,
      default: <Code>'bottom'</Code>,
    },
    {
      attribute: 'shadowHeight',
      description: '阴影的高度',
      type: <Code> number </Code>,
      default: <Code>20</Code>,
    },
    {
      attribute: 'onDataChange',
      description: '当数据变化触发的回调函数',
      type: <Code> {`(data: SpectrogramDataPoint[]) => void`} </Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
