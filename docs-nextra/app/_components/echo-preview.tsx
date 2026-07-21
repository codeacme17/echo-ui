'use client'

import { Button } from '@nafr/echo-ui'

type EchoPreviewProps = Readonly<{
  buttonLabel: string
  description: string
}>

export function EchoPreview({ buttonLabel, description }: EchoPreviewProps) {
  return (
    <div className="echo-docs-preview">
      <p>{description}</p>
      <Button aria-label={buttonLabel}>{buttonLabel}</Button>
    </div>
  )
}
