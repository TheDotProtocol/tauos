import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { QueryProvider } from '@/contexts/QueryContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TauCloud - Privacy-First Cloud Storage',
  description: 'Secure, encrypted cloud storage with zero telemetry. Complete control over your data with TauOS.',
  keywords: 'cloud storage, privacy, encryption, file management, TauOS',
  authors: [{ name: 'TauOS Team' }],
  creator: 'TauOS Team',
  publisher: 'TauOS',
  robots: 'index, follow',
  openGraph: {
    title: 'TauCloud - Privacy-First Cloud Storage',
    description: 'Secure, encrypted cloud storage with zero telemetry',
    url: 'https://cloud.arholdings.group',
    siteName: 'TauCloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TauCloud - Privacy-First Cloud Storage',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TauCloud - Privacy-First Cloud Storage',
    description: 'Secure, encrypted cloud storage with zero telemetry',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#667eea',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-full">
              {children}
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
} 