import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Card, CardBody, CardProps } from '@nextui-org/react'
import { useDarkMode } from '../../hooks/useDarkMode'

interface CodeBlockProps extends CardProps {
  code: string
  language?: string
}

export const CodeBlock = ({ code, language = 'ts', ...restProps }: CodeBlockProps) => {
  const darkMode = useDarkMode()

  return (
    <Card shadow="none" className="bg-transparent" {...restProps}>
      <CardBody className="p-5 flex justify-center bg-background rounded-lg">
        <Highlight
          theme={darkMode ? themes.oneDark : themes.github}
          code={code}
          language={language}
        >
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </CardBody>
    </Card>
  )
}
