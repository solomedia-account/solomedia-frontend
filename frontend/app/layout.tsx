import type { Metadata } from 'next'
import { Oswald, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const oswald = Oswald({ 
  subsets: ['latin'], 
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700']
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: {
    default: 'SoloMedia Network - African Stories, Global Impact',
    template: '%s | SoloMedia Network'
  },
  description: 'SoloMedia Network bridges the gap between Africa and the diaspora. Discover authentic African stories, culture, innovation, and opportunities that unite the continent with the world. From Lagos to London, Nairobi to New York - we are the voice of Africa, everywhere.',
  keywords: ['African culture', 'diaspora', 'African fashion', 'African music', 'African film', 'African entertainment', 'African technology', 'black diaspora', 'African arts', 'investor relations', 'African innovation', 'African business', 'pan-African', 'African diaspora stories'],
  authors: [{ name: 'SoloMedia Network' }],
  creator: 'SoloMedia Network',
  publisher: 'SoloMedia Network',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://solomedianet.com',
    siteName: 'SoloMedia Network',
    title: 'SoloMedia Network - African Stories, Global Impact',
    description: 'SoloMedia Network bridges the gap between Africa and the diaspora. Discover authentic African stories, culture, innovation, and opportunities that unite the continent with the world. From Lagos to London, Nairobi to New York - we are the voice of Africa, everywhere.',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'SoloMedia Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoloMedia Network - African Stories, Global Impact',
    description: 'SoloMedia Network bridges the gap between Africa and the diaspora. Discover authentic African stories, culture, innovation, and opportunities that unite the continent with the world.',
    images: ['/logo.jpg'],
    creator: '@solomagofficial',
  },
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'iQr8CzYovgfJ7ywiHjkmnpgU7JPvRM0nYpJN41w63jY',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
