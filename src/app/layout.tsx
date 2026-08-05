import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { themeInitScript } from '@/lib/theme-script';

export const metadata: Metadata = {
  title: 'TAU CORE™ — Privacy First. AI Native.',
  description:
    'The next generation operating system designed for people who want power, privacy, intelligence and freedom.',
  keywords:
    'TAU CORE, Tau Core Inc., Tau OS, privacy, operating system, AI native, zero telemetry',
  authors: [{ name: 'Tau Core Inc.' }],
  metadataBase: new URL('https://www.tauos.org'),
  openGraph: {
    title: 'TAU CORE™ — Privacy First. AI Native.',
    description:
      'The next generation operating system designed for people who want power, privacy, intelligence and freedom.',
    url: 'https://www.tauos.org',
    siteName: 'TAU CORE',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/brand/tauos-logo.png', alt: 'TAU CORE logo' }],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/brand/tauos-logo.svg', type: 'image/svg+xml' },
      { url: '/brand/tauos-logo.png', type: 'image/png' },
    ],
    apple: '/brand/tauos-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <Script id="tau-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <link rel="icon" href="/brand/tauos-logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/brand/tauos-logo.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/brand/tauos-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[#0a0a0b] text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
