import React from 'react'
import { themes } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { NextUIProvider } from '@nextui-org/react'
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { useDarkMode } from '../hooks/useDarkMode'
import 'echo-ui/dist/style.css'

export const UsageBox = ({ code, scope }) => {
  const darkMode = useDarkMode()

  return (
    <NextUIProvider>
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
        >
          {(item) => (
            <Tab key={item.id} title={item.label}>
              {item.id === 'preview' && (
                <Card shadow="none" className="border border-border bg-transparent">
                  <CardBody className="w-full p-5 flex justify-center  rounded-lg">
                    <LivePreview />
                  </CardBody>
                </Card>
              )}

              {item.id === 'code' && (
                <Card shadow="none" className="bg-transparent">
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
    </NextUIProvider>
  )
}
