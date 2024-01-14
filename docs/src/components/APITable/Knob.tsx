import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const KnobAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: 'The value of the knob.',
      type: <Code>number</Code>,
      default: <Code>0</Code>,
    },
    {
      attribute: 'min',
      description: 'The minimum value of the knob.',
      type: <Code>number</Code>,
      default: <Code>-10</Code>,
    },
    {
      attribute: 'max',
      description: 'The maximum value of the knob.',
      type: <Code>number</Code>,
      default: <Code>10</Code>,
    },
    {
      attribute: 'step',
      description: 'The step value of the knob.',
      type: <Code>number</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'disabled',
      description: 'Whether the knob is disabled.',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'rotationRange',
      description: 'The range in which the knob can be rotated.',
      type: <Code>number</Code>,
      default: <Code>270</Code>,
    },
    {
      attribute: 'bilateral',
      description: 'Whether to enable bilateral mode for the knob.',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'sensitivity',
      description: 'The sensitivity of the knob.',
      type: <Code>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'size',
      description: 'The size of the knob.',
      type: <Code>number | string</Code>,
      default: <Code>'4rem'</Code>,
    },
    {
      attribute: 'buttonColor',
      description: 'The color of the knob button.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-button)'</Code>,
    },
    {
      attribute: 'trackColor',
      description: 'The color of the knob track.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-input)'</Code>,
    },
    {
      attribute: 'trackWidth',
      description: 'The width of the knob track.',
      type: <Code>number | string</Code>,
      default: <Code>'0.5rem'</Code>,
    },
    {
      attribute: 'progressColor',
      description: 'The color of the knob progress bar.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'pointerWidth',
      description: 'The width of the knob pointer.',
      type: <Code>number | string</Code>,
      default: <Code>'0.375rem'</Code>,
    },
    {
      attribute: 'pointerHeight',
      description: 'The height of the knob pointer.',
      type: <Code>number | string</Code>,
      default: <Code>'1rem'</Code>,
    },
    {
      attribute: 'pointerColor',
      description: 'The color of the knob pointer.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'topLabel',
      description: 'The top label of the knob.',
      type: <Code>string | React.ReactNode</Code>,
      default: '-',
    },
    {
      attribute: 'bottomLabel',
      description: 'The bottom label of the knob.',
      type: <Code>string | React.ReactNode</Code>,
      default: '-',
    },
    {
      attribute: 'classNames',
      description: 'Custom class names for the knob.',
      type: <Code>{` { button?: string, topLabel?: string, bottomLabel?: string } `}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: 'Custom styles for the knob.',
      type: (
        <Code>{` { button?: React.CSSProperties, topLabel?: React.CSSProperties, bottomLabel?: React.CSSProperties } `}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'onChange',
      description: 'Callback function when the value of the knob changes.',
      type: <Code>{`(value: number) => void`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChangeEnd',
      description: 'Callback function when the value change of the knob ends.',
      type: <Code>{`(value: number) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}

export const KnobGroupAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'min',
      description: 'The minimum value of the knobs within the group.',
      type: <Code>number</Code>,
      default: <Code>-10</Code>,
    },
    {
      attribute: 'max',
      description: 'The maximum value of the knobs within the group.',
      type: <Code>number</Code>,
      default: <Code>10</Code>,
    },
    {
      attribute: 'step',
      description: 'The step increment for the knobs within the group.',
      type: <Code>number</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'disabled',
      description: 'Whether the knobs within the group are disabled.',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'rotationRange',
      description: 'The range of rotation for the knobs within the group.',
      type: <Code>number</Code>,
      default: <Code>270</Code>,
    },
    {
      attribute: 'bilateral',
      description: 'Whether the knobs within the group are in bilateral mode.',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'sensitivity',
      description: 'The sensitivity of the knobs within the group.',
      type: <Code>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10</Code>,
      default: <Code>1</Code>,
    },
    {
      attribute: 'size',
      description: 'The size of the knobs within the group.',
      type: <Code>number | string</Code>,
      default: <Code>'4rem'</Code>,
    },
    {
      attribute: 'buttonColor',
      description: 'The button color of the knobs within the group.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-button)'</Code>,
    },
    {
      attribute: 'trackColor',
      description: 'The track color of the knobs within the group.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-input)'</Code>,
    },
    {
      attribute: 'trackWidth',
      description: 'The track width of the knobs within the group.',
      type: <Code>number | string</Code>,
      default: <Code>'0.5rem'</Code>,
    },
    {
      attribute: 'progressColor',
      description: 'The progress bar color of the knobs within the group.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'pointerWidth',
      description: 'The pointer width of the knobs within the group.',
      type: <Code>number | string</Code>,
      default: <Code>'0.375rem'</Code>,
    },
    {
      attribute: 'pointerHeight',
      description: 'The pointer height of the knobs within the group.',
      type: <Code>number | string</Code>,
      default: <Code>'1rem'</Code>,
    },
    {
      attribute: 'pointerColor',
      description: 'The pointer color of the knobs within the group.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'classNames',
      description: 'Custom class names for the knob group.',
      type: (
        <Code>{` { knob?: string, button?: string, topLabel?: string, bottomLabel?: string } `}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'styles',
      description: 'Custom styles for the knob group.',
      type: (
        <Code>{` { knob?: React.CSSProperties, button?: React.CSSProperties, topLabel?: React.CSSProperties, bottomLabel?: React.CSSProperties } `}</Code>
      ),
      default: '-',
    },
  ]

  return <APITable data={data} />
}
