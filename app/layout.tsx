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
  title: 'SoloMedia - African Culture & Diaspora',
  description: 'Your destination for African fashion, arts, music, film, entertainment, technology and investor dynamics for blacks in the diaspora.',
  icons: {
    icon: '/logo.jpg',
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
