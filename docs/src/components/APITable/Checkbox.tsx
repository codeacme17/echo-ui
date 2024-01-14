import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const CheckboxAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: (
        <>
          The value bound to the checkbox (only effective in <Code> Group </Code>)
        </>
      ),
      type: <Code>any</Code>,
      default: '-',
    },
    {
      attribute: 'checked',
      description: 'Whether the checkbox is checked',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'disabled',
      description: 'Whether the checkbox is disabled',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: 'The size of the checkbox',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'color',
      description: 'The color when the checkbox is activated',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'classNames',
      description: 'Custom style class names',
      type: <Code>{`{ label?: string }`}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: 'Custom styles',
      type: <Code>{`{ label?: React.CSSProperties }`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChange',
      description: 'Callback function when the state changes',
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
          The array bound to the checkbox group, used to represent the <Code> value </Code>{' '}
          including currently selected items
        </>
      ),
      type: <Code>any</Code>,
      default: '-',
    },
    {
      attribute: 'disabled',
      description: 'Whether the checkboxes in the group are disabled',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: 'The size of the checkboxes in the group',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'color',
      description: 'The color when the checkboxes in the group are activated',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'classNames',
      description: 'Custom style class names',
      type: <Code>{`{ label?: string }`}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: 'Custom styles',
      type: <Code>{`{ label?: React.CSSProperties }`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChange',
      description: 'Callback function when the state changes',
      type: <Code>{`(e: RadioChangeEvent) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
