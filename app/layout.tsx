import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IckyAI - Sales Organization',
  description: 'Cloud-synced sales pipeline management for Icky',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
