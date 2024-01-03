import React from 'react'
import { Tabs, Tab } from '@nextui-org/react'
import { CodeBlock } from './CodeBlock'

interface ManagerSwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  npm?: string
  yarn?: string
  pnpm?: string
}

export const ManagerSwitch = ({ npm, yarn, pnpm }: ManagerSwitchProps) => {
  const tabs = [
    {
      id: 'npm',
      label: 'npm',
      content: npm,
    },
    {
      id: 'yarn',
      label: 'yarn',
      content: yarn,
    },
    {
      id: 'pnpm',
      label: 'pnpm',
      content: pnpm,
    },
  ]

  return (
    <div className="flex w-full flex-col mt-3">
      <Tabs
        aria-label="Dynamic tabs"
        items={tabs}
        color="primary"
        variant="underlined"
        classNames={{
          tab: 'data-[focus-visible=true]:outline-none',
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <CodeBlock code={item.content!} language="bash" />
          </Tab>
        )}
      </Tabs>
    </div>
  )
}
