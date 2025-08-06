import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TauOS - The OS for the Intelligence Age',
  description: 'TauOS intelligently orchestrates advanced agents and AI models to create a seamless, context-aware experience that understands your preferences and needs.',
  keywords: 'TauOS, operating system, privacy, AI, artificial intelligence, Linux, open source, security',
  authors: [{ name: 'TauOS Team' }],
  creator: 'TauOS',
  publisher: 'TauOS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.tauos.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TauOS - The OS for the Intelligence Age',
    description: 'TauOS intelligently orchestrates advanced agents and AI models to create a seamless, context-aware experience.',
    url: 'https://www.tauos.org',
    siteName: 'TauOS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TauOS - The OS for the Intelligence Age',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TauOS - The OS for the Intelligence Age',
    description: 'TauOS intelligently orchestrates advanced agents and AI models to create a seamless, context-aware experience.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TauOS Team" />
        <meta name="description" content="TauOS intelligently orchestrates advanced agents and AI models to create a seamless, context-aware experience that understands your preferences and needs." />
        <meta property="og:title" content="TauOS - The OS for the Intelligence Age" />
        <meta property="og:description" content="TauOS intelligently orchestrates advanced agents and AI models to create a seamless, context-aware experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tauos.org" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TauOS - The OS for the Intelligence Age" />
        <meta name="twitter:description" content="TauOS intelligently orchestrates advanced agents and AI models to create a seamless, context-aware experience." />
        <meta name="twitter:image" content="/og-image.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 