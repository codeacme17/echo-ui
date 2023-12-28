import React from 'react'
import { Button } from 'echo-ui'
import { themes } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { NextUIProvider } from '@nextui-org/react'
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { useDarkMode } from '../hooks/useDarkMode'
import 'echo-ui/dist/style.css'

export const UsageBox = () => {
  const darkMode = useDarkMode()
  const scope = { Button }
  const code = `<Button>Button</Button>`

  return (
    <NextUIProvider>
      <LiveProvider
        code={code}
        scope={scope}
        theme={darkMode ? themes.shadesOfPurple : themes.github}
      >
        <Tabs
          aria-label="Usage Box"
          items={[
            { id: 'preview', label: 'Preview' },
            { id: 'code', label: 'Code' },
          ]}
        >
          {(item) => (
            <Tab key={item.id} title={item.label}>
              <Card>
                {item.id === 'preview' && (
                  <CardBody className="w-full p-5 flex justify-center bg-background rounded-lg">
                    <LivePreview />
                  </CardBody>
                )}

                {item.id === 'code' && (
                  <CardBody className="w-full p-5 flex justify-center bg-background rounded-lg">
                    <code className="rounded-lg overflow-hidden">
                      <LiveEditor className="bg-background" />
                    </code>
                  </CardBody>
                )}
              </Card>
            </Tab>
          )}
        </Tabs>

        <LiveError />
      </LiveProvider>
    </NextUIProvider>
  )
}
