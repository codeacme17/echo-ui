import React from 'react'
import { Button } from 'echo-ui'
import { themes } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { NextUIProvider } from '@nextui-org/react'
import { Tabs, Tab, Card, CardBody, CardHeader } from '@nextui-org/react'
import 'echo-ui/dist/style.css'

export const UsageBox = () => {
  const scope = { Button }

  const code = `
  <Button>Button</Button>
  `

  const tabs = [
    {
      id: 'photos',
      label: 'Photos',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'music',
      label: 'Music',
      content:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
      id: 'videos',
      label: 'Videos',
      content:
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ]

  return (
    <NextUIProvider>
      <LiveProvider code={code} scope={scope} theme={themes.shadesOfPurple}>
        <div className="w-full p-5 flex justify-center bg-background rounded-lg">
          <LivePreview />
        </div>

        <code className="rounded-lg overflow-hidden">
          <LiveEditor className="bg-background" />
        </code>
        <LiveError />
      </LiveProvider>

      <Tabs aria-label="Dynamic tabs" items={tabs}>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Card>
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </NextUIProvider>
  )
}
