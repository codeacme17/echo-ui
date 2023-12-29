import React from 'react'
import { LiveProvider, LivePreview } from 'react-live'
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { CodeBlock } from '../CodeBlock'
import 'echo-ui/dist/style.css'

export const UsageBox = ({ code, scope }) => {
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
          <Tab key={item.id} title={item.label} className="w-full">
            {item.id === 'preview' && (
              <Card shadow="none" className="border border-border bg-transparent w-full">
                <CardBody className="w-full p-5 flex justify-center  rounded-lg">
                  <LivePreview />
                </CardBody>
              </Card>
            )}

            {item.id === 'code' && <CodeBlock code={code} language="tsx" />}
          </Tab>
        )}
      </Tabs>
    </LiveProvider>
  )
}
