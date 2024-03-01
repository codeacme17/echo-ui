import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const ButtonAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description: (
        <>
          The bound value (only effective in <Code>`Group`</Code>).
        </>
      ),
      type: <Code>any</Code>,
      default: '-',
    },
    {
      attribute: 'disabled',
      description: 'Indicates whether the button is disabled',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: 'Button size',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'radius',
      description: 'Button border radius',
      type: <Code>'none' | 'sm' | 'md' | 'lg' | 'full'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'toggled',
      description: 'Indicates whether the button is toggled',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'onToggleChange',
      description: 'Callback function when the toggle state changes',
      type: <Code>{`(toggled: boolean) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}

export const ButtonGroupAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'value',
      description:
        'The value associated with the button group. If the value is an array, the button group will be treated as a multi-select group. Otherwise, it will be treated as a single-select group.',
      type: <Code>any</Code>,
      default: '-',
    },
    {
      attribute: 'disabled',
      description: 'Indicates whether buttons in the button group are disabled',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: 'Button size',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'radius',
      description: 'Button border radius',
      type: <Code>'none' | 'sm' | 'md' | 'lg' | 'full'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'classNames',
      description: 'Allows setting custom class names for buttons and toggle states',
      type: <Code>{'{ button?: string }'}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: 'Allows setting custom styles for buttons and toggle states',
      type: <Code>{`{ button?: React.CSSProperties }`}</Code>,
      default: '-',
    },
    {
      attribute: 'onChange',
      description: 'Callback function when options change',
      type: <Code>{`(values: any) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
