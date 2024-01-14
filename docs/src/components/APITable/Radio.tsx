import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const RadioAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: (
        <>
          The value bound to the radio button (only effective in <Code>Radio.Group</Code>).
        </>
      ),
      type: <Code>any</Code>,
      default: '-',
    },
    {
      attribute: 'checked',
      description: 'Whether the radio button is checked.',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'disabled',
      description: 'Whether the radio button is disabled.',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: 'The size of the radio button.',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'color',
      description: 'The color when the radio button is activated.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'classNames',
      description: 'Custom style class names.',
      type: <Code>{`{ label?: string }`}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: 'Custom styles.',
      type: <Code>{`{ label?: React.CSSProperties }`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChange',
      description: 'Callback function when the state changes.',
      type: <Code>{`(e: RadioChangeEvent) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}

export const RadioGroupAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: (
        <>
          The value bound to the radio group, used to indicate the <Code>value</Code> of the
          currently selected item.
        </>
      ),
      type: <Code>any</Code>,
      default: '-',
    },
    {
      attribute: 'disabled',
      description: 'Whether the radio buttons in the group are disabled.',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: 'The size of radio buttons in the group.',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'color',
      description: 'The color of radio buttons in the group when activated.',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'classNames',
      description: 'Custom style class names.',
      type: <Code>{`{ label?: string }`}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: 'Custom styles.',
      type: <Code>{`{ label?: React.CSSProperties }`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChange',
      description: 'Callback function when the state changes.',
      type: <Code>{`(e: RadioChangeEvent) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
