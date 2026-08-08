import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Moviesack — Your Movie Watchlist',
    template: '%s — Moviesack',
  },
  description: "Discover movies, build your watchlist, and track what you've watched.",
  metadataBase: new URL('https://moviesack.com'),
  openGraph: {
    siteName: 'Moviesack',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
          {children}
        </main>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
