import React from 'react'
import { themes } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { useDarkMode } from '../../hooks/useDarkMode'
import 'echo-ui/dist/style.css'

export const UsageBox = ({ code, scope }) => {
  const darkMode = useDarkMode()

  return (
    <LiveProvider
      code={code}
      scope={scope}
      theme={darkMode ? themes.shadesOfPurple : themes.oneLight}
    >
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

            {item.id === 'code' && (
              <Card shadow="none" className="bg-transparent w-full">
                <CardBody className="w-full p-5 flex justify-center bg-background rounded-lg">
                  <code className="rounded-lg overflow-hidden">
                    <LiveEditor className="bg-background" />
                  </code>
                </CardBody>
              </Card>
            )}
          </Tab>
        )}
      </Tabs>

      <LiveError />
    </LiveProvider>
  )
}
