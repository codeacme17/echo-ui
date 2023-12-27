import React from 'react'
import { Button } from 'echo-ui'
import { themes } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

export const UsageBox = () => {
  const scope = { Button }

  const code = `
  <Button>53s</Button>
  `

  return (
    <LiveProvider code={code} scope={scope} theme={themes.shadesOfPurple}>
      <div className="w-full p-5 flex justify-center bg-background rounded-lg">
        <LivePreview />
      </div>

      <code className="rounded-lg overflow-hidden">
        <LiveEditor className="bg-background" />
      </code>
      <LiveError />
    </LiveProvider>
  )
}
