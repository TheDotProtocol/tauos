import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TauCore™ - Sovereign Privacy First OS',
  description: 'TauCore™ is a complete, secure, zero-telemetry operating system for desktop and mobile—with first-party apps, encrypted services, and enterprise controls.',
  keywords: 'TauCore™, operating system, privacy, security, Linux, open source, zero telemetry, encrypted, sovereign',
  authors: [{ name: 'TauCore™ Team' }],
  creator: 'TauCore™',
  publisher: 'TauCore™',
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
    title: 'TauCore™ - Sovereign Privacy First OS',
    description: 'TauCore™ is a complete, secure, zero-telemetry operating system for desktop and mobile—with first-party apps, encrypted services, and enterprise controls.',
    url: 'https://www.tauos.org',
    siteName: 'TauCore',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tau OS - Sovereign Privacy First OS',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TauCore™ - Sovereign Privacy First OS',
    description: 'TauCore™ is a complete, secure, zero-telemetry operating system for desktop and mobile—with first-party apps, encrypted services, and enterprise controls.',
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
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fbbf24" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TauCore Team" />
        <meta name="description" content="TauCore is a complete, secure, zero-telemetry operating system for desktop and mobile—with first-party apps, encrypted services, and enterprise controls." />
        <meta property="og:title" content="Tau OS - Sovereign Privacy First OS" />
        <meta property="og:description" content="TauCore is a complete, secure, zero-telemetry operating system for desktop and mobile—with first-party apps, encrypted services, and enterprise controls." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tauos.org" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tau OS - Sovereign Privacy First OS" />
        <meta name="twitter:description" content="TauCore is a complete, secure, zero-telemetry operating system for desktop and mobile—with first-party apps, encrypted services, and enterprise controls." />
        <meta name="twitter:image" content="/og-image.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 