import React from 'react'
import { LiveProvider, LivePreview } from 'react-live'
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { CodeBlock } from '../CodeBlock'
import { cn } from '../../libs/utils'
import 'echo-ui/dist/style.css'

interface UsageBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
  scope: Record<string, unknown>
  classNames?: {
    tab?: string
    preview?: string
    code?: string
  }
}

export const UsageBox = ({ code, scope, classNames }: UsageBoxProps) => {
  return (
    <LiveProvider code={code} scope={scope}>
      <Tabs
        aria-label="Usage Box"
        className="mt-3"
        color="primary"
        variant="underlined"
        items={[
          { id: 'preview', label: 'Preview' },
          { id: 'code', label: 'Code' },
        ]}
        classNames={{
          tab: 'data-[focus-visible=true]:outline-none',
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label} className={cn('w-full', classNames?.tab)}>
            {item.id === 'preview' && (
              <Card shadow="none" className="border border-border bg-transparent w-full">
                <CardBody
                  className={cn('w-full p-5 flex justify-center rounded-lg', classNames?.preview)}
                >
                  <LivePreview />
                </CardBody>
              </Card>
            )}

            {item.id === 'code' && (
              <CodeBlock code={code} language="tsx" className={classNames?.code} />
            )}
          </Tab>
        )}
      </Tabs>
    </LiveProvider>
  )
}
