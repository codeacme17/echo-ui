import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const SwitchAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'toggled',
      description: 'The state of the switch',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'disabled',
      description: 'Whether the switch is disabled',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'size',
      description: 'The size of the switch',
      type: <Code>'sm' | 'md' | 'lg'</Code>,
      default: <Code>'md'</Code>,
    },
    {
      attribute: 'classNames',
      description: 'Custom style class names',
      type: <Code>{`{ label?: string; button?: string; thumb?: string }`}</Code>,
      default: '-',
    },
    {
      attribute: 'styles',
      description: 'Custom styles',
      type: (
        <Code>{`{ label?: React.CSSProperties; button?: React.CSSProperties; thumb?: React.CSSProperties }`}</Code>
      ),
      default: '-',
    },
    {
      attribute: 'onChange',
      description: 'Callback function when the state changes',
      type: <Code>{`(toggled: boolean) => void`}</Code>,
      default: '-',
    },
  ]

  return <APITable data={data} />
}
