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
    default: 'SoloMedia - African Culture & Diaspora',
    template: '%s | SoloMedia'
  },
  description: 'Your destination for African fashion, arts, music, film, entertainment, technology and investor dynamics for blacks in the diaspora.',
  keywords: ['African culture', 'diaspora', 'African fashion', 'African music', 'African film', 'African entertainment', 'African technology', 'black diaspora', 'African arts', 'investor relations'],
  authors: [{ name: 'SoloMedia' }],
  creator: 'SoloMedia',
  publisher: 'SoloMedia',
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
    url: 'https://solomedia.onrender.com',
    siteName: 'SoloMedia',
    title: 'SoloMedia - African Culture & Diaspora',
    description: 'Your destination for African fashion, arts, music, film, entertainment, technology and investor dynamics for blacks in the diaspora.',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'SoloMedia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoloMedia - African Culture & Diaspora',
    description: 'Your destination for African fashion, arts, music, film, entertainment, technology and investor dynamics for blacks in the diaspora.',
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
  other: {
    'google-site-verification': '_wKEIuy020-rByWEZ2cYHF4AALvrBK8px7k4IbabWjA',
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
