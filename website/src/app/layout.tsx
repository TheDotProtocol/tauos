import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TauOS - Gateway to the Future of Computing',
  description: 'TauOS is a privacy-first, security-focused operating system designed to provide users with complete control over their digital experience.',
  keywords: 'TauOS, operating system, privacy, security, Linux, open source',
  authors: [{ name: 'TauOS Team' }],
  creator: 'TauOS',
  publisher: 'TauOS',
  robots: 'index, follow',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'TauOS - Gateway to the Future of Computing',
    description: 'Privacy-first, security-focused operating system',
    url: 'https://tauos.org',
    siteName: 'TauOS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TauOS - Gateway to the Future of Computing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TauOS - Gateway to the Future of Computing',
    description: 'Privacy-first, security-focused operating system',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#8b5cf6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-tau antialiased">
        {children}
      </body>
    </html>
  )
} 