import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TauMail - Secure Email Service',
  description: 'Privacy-first email service for the TauOS ecosystem',
  keywords: ['email', 'privacy', 'security', 'tauos', 'taumail'],
  authors: [{ name: 'TauOS Team' }],
  creator: 'TauOS Team',
  publisher: 'TauOS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mail.tauos.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TauMail - Secure Email Service',
    description: 'Privacy-first email service for the TauOS ecosystem',
    url: 'https://mail.tauos.org',
    siteName: 'TauMail',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TauMail - Secure Email Service',
    description: 'Privacy-first email service for the TauOS ecosystem',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        {children}
      </body>
    </html>
  );
} 