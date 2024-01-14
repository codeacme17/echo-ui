import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const SliderAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: 'The value of the slider',
      type: <Code>number</Code>,
      default: '-',
    },
    {
      attribute: 'min',
      description: 'The minimum value',
      type: <Code>number</Code>,
      default: <Code>0</Code>,
    },
    {
      attribute: 'max',
      description: 'The maximum value',
      type: <Code>number</Code>,
      default: <Code>100</Code>,
    },
    {
      attribute: 'step',
      description: 'The step value',
      type: <Code>number</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'disabled',
      description: 'Whether the slider is disabled',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'vertical',
      description: 'Whether the slider is displayed vertically',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'bilateral',
      description: 'Whether the slider is bilateral',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'hideThumb',
      description: 'Whether to hide the slider thumb',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'hideThumbLabel',
      description: 'Whether to hide the slider thumb label',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'prohibitInteraction',
      description: 'Whether to prohibit interaction',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'classNames',
      description: 'Custom style class names',
      type: (
        <Code>{`{ progress?: string; thumb?: string; thumbLabel?: string; axis?: string }`}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'styles',
      description: 'Custom styles',
      type: (
        <Code>{`{ progress?: React.CSSProperties; thumb?: React.CSSProperties; thumbLabel?: React.CSSProperties; axis?: React.CSSProperties }`}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'axis',
      description: 'Whether to show the axis',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'axisProps',
      description: 'Props passed to the Axis component',
      type: <Code>AxisProps</Code>,
      default: '-',
    },
    {
      attribute: 'onChange',
      description: 'Callback function when the value changes',
      type: <Code>{`(value: number) => void`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChangeEnd',
      description: 'Callback function when the value change ends',
      type: <Code>{`(value: number) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
