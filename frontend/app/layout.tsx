import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Librilabs Translator',
  description: 'Translation application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

