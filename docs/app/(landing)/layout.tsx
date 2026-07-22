import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './landing.css'

export const metadata: Metadata = {
  description: 'Choose a language for the Echo UI documentation.',
  metadataBase: new URL('https://echoui.dev'),
  title: 'Echo UI documentation',
}

export default function LandingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
