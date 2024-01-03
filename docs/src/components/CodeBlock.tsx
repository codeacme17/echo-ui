import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Card, CardBody, CardProps, Button } from '@nextui-org/react'
import { Copy, Check, Link } from 'lucide-react'
import { useDarkMode, useCopy } from '../hooks'

interface CodeBlockProps extends CardProps {
  code: string
  language?: string
  type?: 'copy' | 'link'
  url?: string
}

export const CodeBlock = ({ code, language = 'ts', type = 'copy', url }: CodeBlockProps) => {
  const darkMode = useDarkMode()

  const { copySuccess, copyToClipboard } = useCopy(code)

  const hanldeClickLink = () => {
    if (!url) return
    window.open(url, '_blank')
  }

  return (
    <Card shadow="none" className="group bg-transparent">
      <div className="absolute z-10 right-3 opacity-0 transition-opacity group-hover:opacity-100 top-3.5 delay-75">
        {type === 'copy' ? (
          <Button size="sm" isIconOnly onClick={copyToClipboard}>
            {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        ) : (
          <Button size="sm" isIconOnly onClick={hanldeClickLink}>
            <Link className="w-4 h-4" />
          </Button>
        )}
      </div>

      <CardBody className="p-5 flex justify-center bg-background rounded-lg">
        <Highlight
          theme={darkMode ? themes.oneDark : themes.oneLight}
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
